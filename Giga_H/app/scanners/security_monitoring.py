"""Security Monitoring Detection Scanner - Security tools and monitoring detection."""

import asyncio
import aiohttp
from typing import Dict, List, Any, Optional
import re
import time

from app.scanners.base import BaseScanner, NetworkTimeoutError, ScanningNotPossibleError
from app.config import settings


class SecurityMonitoringScanner(BaseScanner):
    """
    Scanner for detecting security monitoring and protection mechanisms:
    - WAF (Web Application Firewall) detection
    - CDN and DDoS protection services
    - Rate limiting implementation
    - Security service headers
    - Monitoring tool indicators
    """
    
    def __init__(self, target: str, scan_type: str = "full"):
        super().__init__(target, scan_type)
        self.results = {
            "waf_detected": False,
            "waf_type": None,
            "cdn_services": [],
            "ddos_protection": False,
            "rate_limiting": False,
            "security_tools": [],
            "monitoring_indicators": [],
            "recommendations": []
        }
        
        # Known WAF signatures
        self.waf_signatures = {
            "cloudflare": ["cloudflare", "cf-ray", "__cfduid"],
            "aws_waf": ["aws", "x-amzn-requestid", "x-amz-cf-id"],
            "azure_waf": ["azure", "x-azure-ref"],
            "akamai": ["akamai", "x-akamai"],
            "imperva": ["imperva", "x-iinfo"],
            "sucuri": ["sucuri", "x-sucuri"],
            "barracuda": ["barracuda", "barra"],
            "f5_big_ip": ["f5", "bigip", "x-wa-info"],
            "fortinet": ["fortinet", "fortigate"]
        }
        
        # CDN service indicators
        self.cdn_indicators = {
            "cloudflare": ["cloudflare", "cf-cache-status"],
            "fastly": ["fastly", "x-served-by"],
            "amazon_cloudfront": ["cloudfront", "x-amz-cf-id"],
            "azure_cdn": ["azure", "x-azure-ref"],
            "maxcdn": ["maxcdn", "x-cache"],
            "keycdn": ["keycdn", "x-cache"],
            "bunnycdn": ["bunnycdn", "x-cache"]
        }
    
    def scan(self) -> Dict[str, Any]:
        """
        Perform security monitoring detection.
        
        Returns:
            dict: Security monitoring analysis results
        """
        self.start_scan()
        
        try:
            # Run async scanning operations
            asyncio.run(self._perform_security_scan())
            
            # Generate recommendations
            self._generate_recommendations()
            
            return self.create_result("completed", self.results)
            
        except NetworkTimeoutError:
            return self.handle_timeout("security monitoring detection")
        except ScanningNotPossibleError as e:
            return self.handle_network_error("security monitoring detection", str(e))
        except Exception as e:
            return self.handle_network_error("security monitoring detection", str(e))
    
    async def _perform_security_scan(self) -> None:
        """
        Perform the main security monitoring detection operations.
        """
        timeout = aiohttp.ClientTimeout(total=self.timeout)
        connector = aiohttp.TCPConnector(ssl=False, limit=10)
        
        async with aiohttp.ClientSession(
            timeout=timeout,
            connector=connector,
            headers={"User-Agent": "Security-Scanner/1.0"}
        ) as session:
            
            # Detect WAF and security services
            await self._detect_waf_and_security(session)
            
            # Test rate limiting
            await self._test_rate_limiting(session)
            
            # Check for monitoring tool indicators
            await self._check_monitoring_indicators(session)
    
    async def _detect_waf_and_security(self, session: aiohttp.ClientSession) -> None:
        """
        Detect WAF, CDN, and other security services.
        
        Args:
            session: aiohttp session
        """
        self.log_scan_info("Detecting WAF and security services")
        
        test_urls = [
            f"https://{self.target}",
            f"http://{self.target}",
            f"https://{self.target}/",
            f"https://{self.target}/index.html"
        ]
        
        for url in test_urls:
            try:
                async with session.get(url) as response:
                    await self._analyze_security_headers(response)
                    
                    # Test with a potentially malicious request to trigger WAF
                    await self._test_waf_detection(session, url)
                    
                    break  # Success, no need to try other URLs
                    
            except aiohttp.ClientSSLError:
                continue  # Try next URL
            except Exception:
                continue
    
    async def _analyze_security_headers(self, response: aiohttp.ClientResponse) -> None:
        """
        Analyze response headers for security service indicators.
        
        Args:
            response: HTTP response
        """
        headers = response.headers
        headers_lower = {k.lower(): v.lower() for k, v in headers.items()}
        
        # Check for WAF signatures
        for waf_name, signatures in self.waf_signatures.items():
            for signature in signatures:
                if any(signature in v for v in headers_lower.values()) or any(signature in k for k in headers_lower.keys()):
                    self.results["waf_detected"] = True
                    self.results["waf_type"] = waf_name.replace("_", " ").title()
                    self.results["security_tools"].append(f"WAF: {self.results['waf_type']}")
                    self.log_scan_info(f"WAF detected: {self.results['waf_type']}")
                    break
        
        # Check for CDN services
        for cdn_name, indicators in self.cdn_indicators.items():
            for indicator in indicators:
                if any(indicator in v for v in headers_lower.values()) or any(indicator in k for k in headers_lower.keys()):
                    cdn_service = cdn_name.replace("_", " ").title()
                    if cdn_service not in self.results["cdn_services"]:
                        self.results["cdn_services"].append(cdn_service)
                        self.log_scan_info(f"CDN detected: {cdn_service}")
        
        # Check for DDoS protection indicators
        ddos_indicators = ["ddos-guard", "x-cache", "x-varnish", "cf-ray"]
        if any(indicator in headers_lower for indicator in ddos_indicators):
            self.results["ddos_protection"] = True
            self.results["security_tools"].append("DDoS Protection")
        
        # Check for specific security headers that indicate monitoring
        security_monitoring_headers = [
            "x-frame-options", "x-xss-protection", "x-content-type-options",
            "strict-transport-security", "content-security-policy"
        ]
        
        monitoring_count = sum(1 for header in security_monitoring_headers if header in headers_lower)
        if monitoring_count >= 3:
            self.results["monitoring_indicators"].append("Comprehensive security headers implemented")
    
    async def _test_waf_detection(self, session: aiohttp.ClientSession, base_url: str) -> None:
        """
        Test WAF detection with potentially malicious requests.
        
        Args:
            session: aiohttp session
            base_url: Base URL to test
        """
        # WAF detection payloads (safe, commonly blocked patterns)
        waf_test_payloads = [
            "?test=<script>alert('xss')</script>",
            "?test=' OR 1=1--",
            "?test=../../../etc/passwd",
            "?test=<img src=x onerror=alert(1)>"
        ]
        
        normal_response = None
        
        try:
            # Get normal response first
            async with session.get(base_url) as response:
                normal_response = response.status
        except Exception:
            return
        
        for payload in waf_test_payloads:
            try:
                test_url = base_url + payload
                async with session.get(test_url) as response:
                    
                    # Common WAF response codes
                    if response.status in [403, 406, 418, 429, 503]:
                        if not self.results["waf_detected"]:
                            self.results["waf_detected"] = True
                            self.results["waf_type"] = "Generic WAF"
                            self.results["security_tools"].append("WAF: Generic")
                            self.log_scan_info("WAF detected through payload testing")
                        break
                    
                    # Check for WAF-specific error pages
                    if response.status == 200:
                        try:
                            content = await response.text()
                            waf_error_patterns = [
                                "access denied", "security violation", "blocked by policy",
                                "request rejected", "security filter", "protection rule"
                            ]
                            
                            content_lower = content.lower()
                            if any(pattern in content_lower for pattern in waf_error_patterns):
                                self.results["waf_detected"] = True
                                self.results["waf_type"] = "Custom WAF"
                                self.results["security_tools"].append("WAF: Custom")
                                break
                                
                        except Exception:
                            continue
                            
            except Exception:
                continue
                
            # Limit payload testing for quick scans
            if self.should_scan_quickly():
                break
    
    async def _test_rate_limiting(self, session: aiohttp.ClientSession) -> None:
        """
        Test for rate limiting implementation.
        
        Args:
            session: aiohttp session
        """
        if self.should_scan_quickly():
            return  # Skip rate limiting test for quick scans
        
        self.log_scan_info("Testing rate limiting")
        
        test_url = f"https://{self.target}/"
        request_count = 10
        rapid_requests = []
        
        try:
            # Make rapid requests
            start_time = time.time()
            
            for i in range(request_count):
                try:
                    async with session.get(test_url) as response:
                        rapid_requests.append({
                            "status": response.status,
                            "time": time.time() - start_time
                        })
                        
                        # Check for rate limiting responses
                        if response.status in [429, 503]:
                            self.results["rate_limiting"] = True
                            self.results["security_tools"].append("Rate Limiting")
                            self.log_scan_info("Rate limiting detected")
                            break
                            
                except Exception:
                    continue
                    
                # Small delay to avoid overwhelming the server
                await asyncio.sleep(0.1)
            
            # Analyze response patterns
            if len(rapid_requests) > 5:
                response_times = [req["time"] for req in rapid_requests]
                if len(response_times) > 1:
                    # Check if response times are increasing (potential throttling)
                    if response_times[-1] > response_times[0] * 2:
                        self.results["rate_limiting"] = True
                        self.results["monitoring_indicators"].append("Response time throttling detected")
        
        except Exception as e:
            self.log_scan_info(f"Rate limiting test failed: {e}")
    
    async def _check_monitoring_indicators(self, session: aiohttp.ClientSession) -> None:
        """
        Check for various monitoring tool indicators.
        
        Args:
            session: aiohttp session
        """
        self.log_scan_info("Checking for monitoring indicators")
        
        # Check for common monitoring endpoints
        monitoring_endpoints = [
            "/health", "/status", "/ping", "/metrics",
            "/monitor", "/check", "/heartbeat"
        ]
        
        base_url = f"https://{self.target}"
        
        for endpoint in monitoring_endpoints:
            try:
                url = base_url + endpoint
                async with session.get(url) as response:
                    if response.status == 200:
                        try:
                            content = await response.text()
                            
                            # Check for monitoring tool indicators in content
                            monitoring_patterns = [
                                "prometheus", "grafana", "nagios", "zabbix",
                                "newrelic", "datadog", "splunk", "elk"
                            ]
                            
                            content_lower = content.lower()
                            for pattern in monitoring_patterns:
                                if pattern in content_lower:
                                    tool_name = pattern.title()
                                    if tool_name not in self.results["security_tools"]:
                                        self.results["security_tools"].append(f"Monitoring: {tool_name}")
                                        self.results["monitoring_indicators"].append(f"{tool_name} monitoring detected")
                                        self.log_scan_info(f"Monitoring tool detected: {tool_name}")
                                    
                        except Exception:
                            continue
            
            except Exception:
                continue
                
            # Limit for quick scans
            if self.should_scan_quickly() and len(self.results["monitoring_indicators"]) >= 3:
                break
    
    def _generate_recommendations(self) -> None:
        """
        Generate security recommendations based on findings.
        """
        recommendations = []
        
        # WAF recommendations
        if not self.results["waf_detected"]:
            recommendations.append("Consider implementing a Web Application Firewall (WAF)")
        else:
            recommendations.append("Regularly update WAF rules and signatures")
            recommendations.append("Monitor WAF logs for attack patterns")
        
        # CDN and DDoS recommendations
        if not self.results["cdn_services"]:
            recommendations.append("Consider using a CDN service for performance and security")
        
        if not self.results["ddos_protection"]:
            recommendations.append("Implement DDoS protection mechanisms")
        
        # Rate limiting recommendations
        if not self.results["rate_limiting"]:
            recommendations.append("Implement rate limiting to prevent abuse")
        else:
            recommendations.append("Review and tune rate limiting thresholds")
        
        # Monitoring recommendations
        if not self.results["security_tools"]:
            recommendations.extend([
                "Implement comprehensive security monitoring",
                "Deploy intrusion detection systems (IDS)",
                "Set up security event logging and alerting"
            ])
        else:
            recommendations.extend([
                "Ensure monitoring covers all critical systems",
                "Implement automated incident response procedures",
                "Regularly review and update monitoring rules"
            ])
        
        # General security monitoring recommendations
        recommendations.extend([
            "Implement centralized log management",
            "Monitor for security events and anomalies",
            "Regular security assessment and penetration testing",
            "Maintain an incident response plan",
            "Implement security metrics and reporting"
        ])
        
        self.results["recommendations"] = recommendations
