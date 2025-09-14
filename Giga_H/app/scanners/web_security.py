"""Web Security Headers Analysis Scanner - HTTP security headers assessment."""

import asyncio
import aiohttp
from typing import Dict, List, Any, Optional
from urllib.parse import urlparse, urljoin
import re

from app.scanners.base import BaseScanner, NetworkTimeoutError, ScanningNotPossibleError
from app.config import settings


class WebSecurityScanner(BaseScanner):
    """
    Scanner for web security headers analysis including:
    - HTTPS redirect implementation
    - Content Security Policy (CSP)
    - Security headers analysis (X-Frame-Options, X-XSS-Protection, etc.)
    - Basic web application security assessment
    """
    
    def __init__(self, target: str, scan_type: str = "full"):
        super().__init__(target, scan_type)
        self.results = {
            "https_redirect": False,
            "security_headers": {},
            "missing_headers": [],
            "security_score": 0,
            "vulnerabilities": [],
            "response_details": {}
        }
        
        # Define expected security headers and their scoring weights
        self.security_headers_config = {
            "strict-transport-security": {"weight": 15, "name": "HSTS"},
            "content-security-policy": {"weight": 20, "name": "CSP"},
            "x-frame-options": {"weight": 15, "name": "X-Frame-Options"},
            "x-content-type-options": {"weight": 10, "name": "X-Content-Type-Options"},
            "x-xss-protection": {"weight": 10, "name": "X-XSS-Protection"},
            "referrer-policy": {"weight": 10, "name": "Referrer-Policy"},
            "permissions-policy": {"weight": 10, "name": "Permissions-Policy"},
            "x-permitted-cross-domain-policies": {"weight": 5, "name": "X-Permitted-Cross-Domain-Policies"}
        }
    
    def scan(self) -> Dict[str, Any]:
        """
        Perform web security headers scanning.
        
        Returns:
            dict: Web security analysis results
        """
        self.start_scan()
        
        try:
            # Run async scanning operations
            asyncio.run(self._perform_web_scan())
            
            # Calculate security score
            self._calculate_security_score()
            
            return self.create_result("completed", self.results)
            
        except NetworkTimeoutError:
            return self.handle_timeout("web security analysis")
        except ScanningNotPossibleError as e:
            return self.handle_network_error("web security analysis", str(e))
        except Exception as e:
            return self.handle_network_error("web security analysis", str(e))
    
    async def _perform_web_scan(self) -> None:
        """
        Perform the main web security scanning operations.
        """
        # Configure aiohttp session with custom settings
        timeout = aiohttp.ClientTimeout(total=self.timeout)
        connector = aiohttp.TCPConnector(
            ssl=False,  # Allow invalid SSL for testing
            limit=10,
            ttl_dns_cache=300
        )
        
        async with aiohttp.ClientSession(
            timeout=timeout,
            connector=connector,
            headers={"User-Agent": "CyberScanner/1.0"}
        ) as session:
            
            # Test HTTPS redirect
            await self._test_https_redirect(session)
            
            # Analyze security headers on HTTPS endpoint
            await self._analyze_security_headers(session)
            
            # Additional web security tests for full scans
            if not self.should_scan_quickly():
                await self._test_additional_security(session)
    
    async def _test_https_redirect(self, session: aiohttp.ClientSession) -> None:
        """
        Test if HTTP redirects to HTTPS.
        
        Args:
            session: aiohttp session
        """
        try:
            # Test HTTP endpoint
            http_url = f"http://{self.target}"
            
            self.log_scan_info("Testing HTTPS redirect")
            
            async with session.get(
                http_url,
                allow_redirects=False,
                ssl=False
            ) as response:
                
                self.results["response_details"]["http_status"] = response.status
                
                # Check if redirected to HTTPS
                if response.status in [301, 302, 303, 307, 308]:
                    location = response.headers.get('Location', '')
                    if location.startswith('https://'):
                        self.results["https_redirect"] = True
                        self.log_scan_info("HTTPS redirect detected")
                    else:
                        self.results["https_redirect"] = False
                        self.results["vulnerabilities"].append({
                            "type": "no_https_redirect",
                            "severity": "medium",
                            "description": "HTTP does not redirect to HTTPS",
                            "recommendation": "Configure HTTP to HTTPS redirect"
                        })
                else:
                    self.results["https_redirect"] = False
                    
        except Exception as e:
            self.log_scan_info(f"HTTPS redirect test failed: {e}")
            # Don't fail the entire scan for redirect test failure
    
    async def _analyze_security_headers(self, session: aiohttp.ClientSession) -> None:
        """
        Analyze security headers on HTTPS endpoint.
        
        Args:
            session: aiohttp session
        """
        try:
            # Test HTTPS endpoint
            https_url = f"https://{self.target}"
            
            self.log_scan_info("Analyzing security headers")
            
            async with session.get(https_url) as response:
                headers = response.headers
                self.results["response_details"]["https_status"] = response.status
                
                # Extract and analyze each security header
                for header_key, config in self.security_headers_config.items():
                    header_value = headers.get(header_key)
                    
                    if header_value:
                        self.results["security_headers"][config["name"]] = header_value
                        
                        # Analyze specific header configurations
                        self._analyze_header_configuration(header_key, header_value, config["name"])
                    else:
                        self.results["missing_headers"].append(config["name"])
                        
                        # Add vulnerability for missing critical headers
                        if config["weight"] >= 15:  # Critical headers
                            self.results["vulnerabilities"].append({
                                "type": "missing_security_header",
                                "severity": "medium" if config["weight"] >= 20 else "low",
                                "description": f"Missing {config['name']} header",
                                "header": config["name"],
                                "recommendation": f"Implement {config['name']} header for enhanced security"
                            })
                
                # Check for information disclosure headers
                self._check_information_disclosure(headers)
                
        except aiohttp.ClientSSLError as e:
            self.log_scan_info(f"SSL error during header analysis: {e}")
            raise ScanningNotPossibleError(f"SSL connection failed: {e}")
        except Exception as e:
            self.log_scan_info(f"Security headers analysis failed: {e}")
            raise
    
    def _analyze_header_configuration(self, header_key: str, header_value: str, header_name: str) -> None:
        """
        Analyze specific security header configurations for weaknesses.
        
        Args:
            header_key: Header key name
            header_value: Header value
            header_name: Friendly header name
        """
        header_value_lower = header_value.lower()
        
        if header_key == "content-security-policy":
            self._analyze_csp_policy(header_value)
        
        elif header_key == "x-frame-options":
            if header_value_lower not in ["deny", "sameorigin"]:
                self.results["vulnerabilities"].append({
                    "type": "weak_x_frame_options",
                    "severity": "low",
                    "description": f"Weak X-Frame-Options value: {header_value}",
                    "recommendation": "Use 'DENY' or 'SAMEORIGIN'"
                })
        
        elif header_key == "strict-transport-security":
            self._analyze_hsts_policy(header_value)
        
        elif header_key == "x-content-type-options":
            if header_value_lower != "nosniff":
                self.results["vulnerabilities"].append({
                    "type": "weak_content_type_options",
                    "severity": "low", 
                    "description": f"Unexpected X-Content-Type-Options value: {header_value}",
                    "recommendation": "Use 'nosniff'"
                })
    
    def _analyze_csp_policy(self, csp_value: str) -> None:
        """
        Analyze Content Security Policy for common weaknesses.
        
        Args:
            csp_value: CSP header value
        """
        csp_lower = csp_value.lower()
        
        # Check for unsafe directives
        unsafe_patterns = [
            "'unsafe-inline'",
            "'unsafe-eval'",
            "data:",
            "*"
        ]
        
        for pattern in unsafe_patterns:
            if pattern in csp_lower:
                severity = "high" if pattern in ["'unsafe-eval'", "*"] else "medium"
                self.results["vulnerabilities"].append({
                    "type": "weak_csp_directive",
                    "severity": severity,
                    "description": f"CSP contains unsafe directive: {pattern}",
                    "recommendation": "Remove unsafe CSP directives and use nonces or hashes"
                })
        
        # Check for missing important directives
        important_directives = ["default-src", "script-src", "object-src"]
        for directive in important_directives:
            if directive not in csp_lower:
                self.results["vulnerabilities"].append({
                    "type": "missing_csp_directive",
                    "severity": "low",
                    "description": f"CSP missing important directive: {directive}",
                    "recommendation": f"Add {directive} directive to CSP"
                })
    
    def _analyze_hsts_policy(self, hsts_value: str) -> None:
        """
        Analyze HSTS policy for weaknesses.
        
        Args:
            hsts_value: HSTS header value
        """
        # Extract max-age value
        max_age_match = re.search(r'max-age=(\d+)', hsts_value)
        if max_age_match:
            max_age = int(max_age_match.group(1))
            
            # Check if max-age is too low (less than 6 months)
            if max_age < 15768000:  # 6 months in seconds
                self.results["vulnerabilities"].append({
                    "type": "weak_hsts_max_age",
                    "severity": "low",
                    "description": f"HSTS max-age is too low: {max_age} seconds",
                    "recommendation": "Use HSTS max-age of at least 31536000 (1 year)"
                })
        
        # Check for includeSubDomains
        if "includesubdomains" not in hsts_value.lower():
            self.results["vulnerabilities"].append({
                "type": "hsts_missing_subdomains",
                "severity": "low",
                "description": "HSTS policy missing includeSubDomains directive",
                "recommendation": "Add includeSubDomains to HSTS policy"
            })
    
    def _check_information_disclosure(self, headers: Any) -> None:
        """
        Check for headers that might disclose sensitive information.
        
        Args:
            headers: Response headers
        """
        disclosure_headers = {
            "server": "Server software and version disclosure",
            "x-powered-by": "Technology stack disclosure",
            "x-aspnet-version": "ASP.NET version disclosure",
            "x-generator": "Content generator disclosure"
        }
        
        for header, description in disclosure_headers.items():
            if header in headers:
                self.results["vulnerabilities"].append({
                    "type": "information_disclosure",
                    "severity": "low",
                    "description": description,
                    "header": header,
                    "value": headers[header],
                    "recommendation": f"Remove or obfuscate {header} header"
                })
    
    async def _test_additional_security(self, session: aiohttp.ClientSession) -> None:
        """
        Perform additional web security tests for full scans.
        
        Args:
            session: aiohttp session
        """
        try:
            # Test for common security endpoints
            await self._test_security_endpoints(session)
            
            # Test for CORS configuration
            await self._test_cors_configuration(session)
            
        except Exception as e:
            self.log_scan_info(f"Additional security tests failed: {e}")
    
    async def _test_security_endpoints(self, session: aiohttp.ClientSession) -> None:
        """
        Test for common security-related endpoints.
        
        Args:
            session: aiohttp session
        """
        security_endpoints = [
            "/.well-known/security.txt",
            "/security.txt",
            "/robots.txt",
            "/.well-known/change-password"
        ]
        
        base_url = f"https://{self.target}"
        
        for endpoint in security_endpoints:
            try:
                url = urljoin(base_url, endpoint)
                async with session.get(url) as response:
                    if response.status == 200:
                        self.log_scan_info(f"Found security endpoint: {endpoint}")
                        # Note: This is positive (good security practice)
                        
            except Exception:
                continue  # Endpoint not found, continue checking
    
    async def _test_cors_configuration(self, session: aiohttp.ClientSession) -> None:
        """
        Test Cross-Origin Resource Sharing (CORS) configuration.
        
        Args:
            session: aiohttp session
        """
        try:
            base_url = f"https://{self.target}"
            
            # Send CORS preflight request
            headers = {
                "Origin": "https://evil.example.com",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "X-Custom-Header"
            }
            
            async with session.options(base_url, headers=headers) as response:
                cors_headers = response.headers
                
                # Check for overly permissive CORS
                access_control_origin = cors_headers.get("Access-Control-Allow-Origin")
                if access_control_origin == "*":
                    self.results["vulnerabilities"].append({
                        "type": "permissive_cors",
                        "severity": "medium",
                        "description": "CORS policy allows all origins (*)",
                        "recommendation": "Restrict CORS to specific trusted origins"
                    })
                
                # Check for credentials with wildcard origin
                if (access_control_origin == "*" and 
                    cors_headers.get("Access-Control-Allow-Credentials") == "true"):
                    self.results["vulnerabilities"].append({
                        "type": "dangerous_cors",
                        "severity": "high",
                        "description": "CORS allows credentials with wildcard origin",
                        "recommendation": "Never use wildcard origin with credentials"
                    })
                    
        except Exception as e:
            self.log_scan_info(f"CORS testing failed: {e}")
    
    def _calculate_security_score(self) -> None:
        """
        Calculate overall security score based on headers and vulnerabilities.
        """
        total_possible_score = sum(config["weight"] for config in self.security_headers_config.values())
        achieved_score = 0
        
        # Add points for present headers
        for header_name in self.results["security_headers"]:
            for config in self.security_headers_config.values():
                if config["name"] == header_name:
                    achieved_score += config["weight"]
                    break
        
        # Add bonus for HTTPS redirect
        if self.results["https_redirect"]:
            achieved_score += 10
            total_possible_score += 10
        
        # Subtract points for vulnerabilities
        vulnerability_penalty = 0
        for vuln in self.results["vulnerabilities"]:
            if vuln["severity"] == "high":
                vulnerability_penalty += 15
            elif vuln["severity"] == "medium":
                vulnerability_penalty += 8
            elif vuln["severity"] == "low":
                vulnerability_penalty += 3
        
        # Calculate final score (0-100)
        raw_score = ((achieved_score - vulnerability_penalty) / total_possible_score) * 100
        self.results["security_score"] = max(0, min(100, int(raw_score)))
        
        self.log_scan_info(f"Security score calculated: {self.results['security_score']}/100")
