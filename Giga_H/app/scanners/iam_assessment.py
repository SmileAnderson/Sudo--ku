"""IAM Assessment Scanner - Limited external IAM security assessment."""

import asyncio
import aiohttp
from typing import Dict, List, Any, Optional, TYPE_CHECKING
from urllib.parse import urljoin, urlparse
import re

from app.scanners.base import BaseScanner, NetworkTimeoutError, ScanningNotPossibleError
from app.config import settings

if TYPE_CHECKING:
    import requests


class IAMAssessmentScanner(BaseScanner):
    """
    Scanner for limited external IAM assessment including:
    - Common admin interface discovery
    - Authentication method detection
    - Public cloud service exposure detection
    - Basic access control assessment (ethical limits only)
    """
    
    def __init__(self, target: str, scan_type: str = "full"):
        super().__init__(target, scan_type)
        self.results = {
            "admin_interfaces": [],
            "cloud_services": {
                "aws_s3_buckets": [],
                "azure_blob_storage": [],
                "gcp_storage": []
            },
            "authentication_methods": [],
            "recommendations": [],
            "vulnerabilities": []
        }
        
        # Common admin interface paths
        self.admin_paths = [
            "/admin", "/admin/", "/administrator", "/wp-admin",
            "/login", "/signin", "/auth", "/dashboard",
            "/panel", "/control", "/manage", "/portal"
        ]
        
        # Extended paths for full scans
        if not self.should_scan_quickly():
            self.admin_paths.extend([
                "/admincp", "/modcp", "/adminpanel", "/cpanel",
                "/plesk", "/webmail", "/phpmyadmin", "/adminer",
                "/manager", "/host-manager", "/solr", "/jenkins"
            ])
    
    def scan(self) -> Dict[str, Any]:
        """
        Perform IAM assessment scanning.
        
        Returns:
            dict: IAM assessment results
        """
        self.start_scan()
        
        try:
            # Run async scanning operations with proper event loop handling
            self._run_async_scan()
            
            # Generate recommendations
            self._generate_recommendations()
            
            return self.create_result("completed", self.results)
            
        except NetworkTimeoutError:
            return self.handle_timeout("IAM assessment")
        except ScanningNotPossibleError as e:
            return self.handle_network_error("IAM assessment", str(e))
        except Exception as e:
            return self.handle_network_error("IAM assessment", str(e))
    
    def _run_async_scan(self) -> None:
        """
        Handle async scanning with proper event loop management.
        """
        # Always use sync implementation to avoid async complications
        # This is more reliable for comprehensive scans
        self.log_scan_info("Using reliable synchronous implementation")
        self._perform_sync_iam_scan()
    
    def _perform_sync_iam_scan(self) -> None:
        """
        Synchronous fallback implementation for IAM scanning.
        """
        import requests
        from requests.adapters import HTTPAdapter
        from urllib3.util.retry import Retry
        
        self.log_scan_info("Using synchronous fallback for IAM scanning")
        
        # Configure requests session with retries and timeout
        session = requests.Session()
        retry_strategy = Retry(
            total=2,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session.mount("http://", adapter)
        session.mount("https://", adapter)
        
        session.headers.update({"User-Agent": "Security-Scanner/1.0"})
        
        try:
            # Discover admin interfaces (sync version)
            self._discover_admin_interfaces_sync(session)
            
            # Quick cloud service check (basic)
            self._check_cloud_services_sync(session)
            
        except Exception as e:
            self.log_scan_info(f"Sync IAM scan error: {e}")
        finally:
            session.close()
    
    def _discover_admin_interfaces_sync(self, session) -> None:
        """
        Synchronous admin interface discovery.
        """
        base_url = f"https://{self.target}" if not self.target.startswith(('http://', 'https://')) else self.target
        
        # Limit paths based on scan type to avoid long scans
        paths_to_check = self.admin_paths[:8] if self.should_scan_quickly() else self.admin_paths[:15]
        
        for path in paths_to_check:
            try:
                url = urljoin(base_url, path)
                # Use shorter timeout for faster scanning
                response = session.get(url, timeout=3, allow_redirects=False)
                
                if response.status_code in [200, 401, 403]:
                    admin_interface = {
                        "path": path,
                        "url": url,
                        "status_code": response.status_code,
                        "title": self._extract_title_from_response(response.text) if response.status_code == 200 else None,
                        "authentication_required": response.status_code in [401, 403]
                    }
                    
                    self.results["admin_interfaces"].append(admin_interface)
                    self.log_scan_info(f"Found admin interface: {path} (status: {response.status_code})")
                    
            except Exception as e:
                # Don't log every timeout to reduce noise
                if "timeout" not in str(e).lower():
                    self.log_scan_info(f"Error checking {path}: {e}")
                continue
    
    def _check_cloud_services_sync(self, session) -> None:
        """
        Basic synchronous cloud service detection.
        """
        # Simple check for common cloud service indicators
        try:
            base_url = f"https://{self.target}" if not self.target.startswith(('http://', 'https://')) else self.target
            response = session.get(base_url, timeout=5)
            
            # Check response headers for cloud service indicators
            headers = response.headers
            server_header = headers.get('server', '').lower()
            
            if 'cloudflare' in server_header:
                self.results["cloud_services"]["cloudflare"] = True
            if 'amazon' in server_header or 'aws' in server_header:
                self.results["cloud_services"]["aws"] = True
            if 'microsoft' in server_header or 'azure' in server_header:
                self.results["cloud_services"]["azure"] = True
                
        except Exception as e:
            self.log_scan_info(f"Cloud service check error: {e}")
    
    def _extract_title_from_response(self, html_content: str) -> Optional[str]:
        """
        Extract page title from HTML content.
        """
        try:
            import re
            title_match = re.search(r'<title[^>]*>([^<]+)</title>', html_content, re.IGNORECASE)
            return title_match.group(1).strip() if title_match else None
        except:
            return None
    
    async def _perform_iam_scan(self) -> None:
        """
        Perform the main IAM assessment operations.
        """
        timeout = aiohttp.ClientTimeout(total=self.timeout)
        connector = aiohttp.TCPConnector(ssl=False, limit=10)
        
        async with aiohttp.ClientSession(
            timeout=timeout,
            connector=connector,
            headers={"User-Agent": "Security-Scanner/1.0"}
        ) as session:
            
            # Discover admin interfaces
            await self._discover_admin_interfaces(session)
            
            # Check for cloud service exposure
            await self._check_cloud_services(session)
            
            # Analyze authentication methods for found interfaces
            await self._analyze_authentication_methods(session)
    
    async def _discover_admin_interfaces(self, session: aiohttp.ClientSession) -> None:
        """
        Discover common admin interfaces.
        
        Args:
            session: aiohttp session
        """
        self.log_scan_info("Discovering admin interfaces")
        
        base_urls = [f"http://{self.target}", f"https://{self.target}"]
        
        for base_url in base_urls:
            for admin_path in self.admin_paths:
                try:
                    url = urljoin(base_url, admin_path)
                    
                    async with session.get(url, allow_redirects=True) as response:
                        if response.status in [200, 401, 403]:
                            interface_info = await self._analyze_admin_interface(response, url)
                            if interface_info:
                                self.results["admin_interfaces"].append(interface_info)
                                self.log_scan_info(f"Found admin interface: {url}")
                        
                except asyncio.TimeoutError:
                    continue  # Skip timeout endpoints
                except Exception:
                    continue  # Skip failed requests
    
    async def _analyze_admin_interface(self, response: aiohttp.ClientResponse, url: str) -> Optional[Dict[str, Any]]:
        """
        Analyze discovered admin interface.
        
        Args:
            response: HTTP response
            url: Interface URL
            
        Returns:
            dict: Interface analysis or None if not relevant
        """
        try:
            content = await response.text()
            content_lower = content.lower()
            
            # Check if this looks like an admin interface
            admin_indicators = [
                "login", "password", "username", "admin", "dashboard",
                "control panel", "administration", "management"
            ]
            
            if not any(indicator in content_lower for indicator in admin_indicators):
                return None
            
            interface_info = {
                "url": url,
                "status_code": response.status,
                "accessible": response.status == 200,
                "authentication_required": response.status in [401, 403],
                "mfa_detected": False,
                "login_form_present": False,
                "interface_type": self._identify_interface_type(content, url),
                "security_issues": []
            }
            
            # Check for login forms
            if re.search(r'<form[^>]*>', content_lower):
                interface_info["login_form_present"] = True
            
            # Check for MFA indicators
            mfa_indicators = ["two-factor", "2fa", "multi-factor", "authenticator", "totp"]
            if any(indicator in content_lower for indicator in mfa_indicators):
                interface_info["mfa_detected"] = True
            
            # Check for security issues
            await self._check_interface_security_issues(interface_info, content, response)
            
            return interface_info
            
        except Exception as e:
            self.log_scan_info(f"Failed to analyze interface {url}: {e}")
            return None
    
    def _identify_interface_type(self, content: str, url: str) -> str:
        """
        Identify the type of admin interface.
        
        Args:
            content: Page content
            url: Interface URL
            
        Returns:
            str: Interface type
        """
        content_lower = content.lower()
        url_lower = url.lower()
        
        # Common interface types
        if any(term in url_lower for term in ["wp-admin", "wordpress"]):
            return "WordPress Admin"
        elif any(term in content_lower for term in ["phpmyadmin", "mysql"]):
            return "phpMyAdmin"
        elif "jenkins" in content_lower or "jenkins" in url_lower:
            return "Jenkins"
        elif "plesk" in content_lower or "plesk" in url_lower:
            return "Plesk Control Panel"
        elif "cpanel" in content_lower or "cpanel" in url_lower:
            return "cPanel"
        elif any(term in content_lower for term in ["tomcat", "manager"]):
            return "Tomcat Manager"
        else:
            return "Generic Admin Interface"
    
    async def _check_interface_security_issues(self, interface_info: Dict[str, Any], content: str, response: aiohttp.ClientResponse) -> None:
        """
        Check for security issues in admin interface.
        
        Args:
            interface_info: Interface information
            content: Page content
            response: HTTP response
        """
        content_lower = content.lower()
        
        # Check for default credentials indicators
        if any(term in content_lower for term in ["admin/admin", "default password", "change default"]):
            interface_info["security_issues"].append("Default credentials may be in use")
            self.results["vulnerabilities"].append({
                "type": "default_credentials",
                "severity": "high",
                "description": f"Admin interface may use default credentials: {interface_info['url']}",
                "recommendation": "Change default credentials immediately"
            })
        
        # Check for exposed admin interface
        if interface_info["accessible"] and not interface_info["authentication_required"]:
            interface_info["security_issues"].append("Admin interface accessible without authentication")
            self.results["vulnerabilities"].append({
                "type": "exposed_admin_interface",
                "severity": "critical",
                "description": f"Admin interface accessible without authentication: {interface_info['url']}",
                "recommendation": "Implement authentication and restrict access by IP"
            })
        
        # Check for missing HTTPS
        if interface_info["url"].startswith("http://"):
            interface_info["security_issues"].append("Admin interface not using HTTPS")
            self.results["vulnerabilities"].append({
                "type": "admin_interface_no_https",
                "severity": "medium",
                "description": f"Admin interface not using HTTPS: {interface_info['url']}",
                "recommendation": "Enable HTTPS for admin interfaces"
            })
        
        # Check for missing MFA
        if not interface_info["mfa_detected"] and interface_info["login_form_present"]:
            interface_info["security_issues"].append("No multi-factor authentication detected")
    
    async def _check_cloud_services(self, session: aiohttp.ClientSession) -> None:
        """
        Check for exposed cloud services.
        
        Args:
            session: aiohttp session
        """
        self.log_scan_info("Checking for cloud service exposure")
        
        # Check for AWS S3 buckets
        await self._check_aws_s3_buckets(session)
        
        # Check for Azure Blob Storage (basic)
        await self._check_azure_storage(session)
        
        # Check for GCP Storage (basic)
        await self._check_gcp_storage(session)
    
    async def _check_aws_s3_buckets(self, session: aiohttp.ClientSession) -> None:
        """
        Check for publicly accessible S3 buckets.
        
        Args:
            session: aiohttp session
        """
        # Common S3 bucket naming patterns
        bucket_patterns = [
            self.target.replace(".", "-"),
            self.target.replace(".", ""),
            f"{self.target}-backup",
            f"{self.target}-assets",
            f"{self.target}-media",
            f"{self.target}-data"
        ]
        
        for bucket_name in bucket_patterns:
            try:
                # Clean bucket name
                bucket_name = re.sub(r'[^a-z0-9\-]', '', bucket_name.lower())
                if not bucket_name:
                    continue
                
                s3_url = f"https://{bucket_name}.s3.amazonaws.com"
                
                async with session.get(s3_url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        self.results["cloud_services"]["aws_s3_buckets"].append({
                            "bucket_name": bucket_name,
                            "url": s3_url,
                            "accessible": True,
                            "risk_level": "HIGH"
                        })
                        
                        self.results["vulnerabilities"].append({
                            "type": "exposed_s3_bucket",
                            "severity": "high",
                            "description": f"Publicly accessible S3 bucket found: {s3_url}",
                            "recommendation": "Restrict S3 bucket permissions and enable access logging"
                        })
                        
                        self.log_scan_info(f"Found accessible S3 bucket: {s3_url}")
                        
            except Exception:
                continue  # Bucket doesn't exist or not accessible
    
    async def _check_azure_storage(self, session: aiohttp.ClientSession) -> None:
        """
        Check for Azure Blob Storage exposure.
        
        Args:
            session: aiohttp session
        """
        # Basic Azure storage account naming patterns
        storage_patterns = [
            self.target.replace(".", "").replace("-", "")[:24],  # Azure storage names max 24 chars
        ]
        
        for storage_name in storage_patterns:
            if len(storage_name) < 3:  # Azure minimum
                continue
                
            try:
                azure_url = f"https://{storage_name}.blob.core.windows.net"
                
                async with session.get(azure_url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status in [200, 400]:  # 400 might indicate existence
                        self.results["cloud_services"]["azure_blob_storage"].append({
                            "storage_name": storage_name,
                            "url": azure_url,
                            "status": response.status
                        })
                        
            except Exception:
                continue
    
    async def _check_gcp_storage(self, session: aiohttp.ClientSession) -> None:
        """
        Check for Google Cloud Storage exposure.
        
        Args:
            session: aiohttp session
        """
        # Basic GCS bucket naming patterns
        bucket_patterns = [
            self.target.replace(".", "-"),
            f"{self.target}-backup"
        ]
        
        for bucket_name in bucket_patterns:
            try:
                gcs_url = f"https://storage.googleapis.com/{bucket_name}"
                
                async with session.get(gcs_url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        self.results["cloud_services"]["gcp_storage"].append({
                            "bucket_name": bucket_name,
                            "url": gcs_url,
                            "accessible": True
                        })
                        
            except Exception:
                continue
    
    async def _analyze_authentication_methods(self, session: aiohttp.ClientSession) -> None:
        """
        Analyze authentication methods for discovered interfaces.
        
        Args:
            session: aiohttp session
        """
        for interface in self.results["admin_interfaces"]:
            if interface["login_form_present"]:
                auth_methods = []
                
                # Basic authentication method detection
                if interface["mfa_detected"]:
                    auth_methods.append("Multi-Factor Authentication")
                
                if "login" in interface["url"].lower():
                    auth_methods.append("Form-based Authentication")
                
                if auth_methods:
                    self.results["authentication_methods"].extend(auth_methods)
    
    def _generate_recommendations(self) -> None:
        """
        Generate security recommendations based on findings.
        """
        recommendations = []
        
        # Admin interface recommendations
        if self.results["admin_interfaces"]:
            recommendations.append("Restrict admin interface access by IP whitelist")
            recommendations.append("Implement strong authentication for all admin interfaces")
            
            # Check if any interface lacks MFA
            if any(not iface["mfa_detected"] for iface in self.results["admin_interfaces"]):
                recommendations.append("Enable multi-factor authentication for admin interfaces")
        
        # Cloud service recommendations
        if any(self.results["cloud_services"].values()):
            recommendations.append("Review and restrict cloud storage permissions")
            recommendations.append("Enable access logging for cloud services")
        
        # General IAM recommendations
        recommendations.extend([
            "Implement principle of least privilege for all accounts",
            "Regular access review and cleanup of unused accounts",
            "Use centralized identity management where possible"
        ])
        
        self.results["recommendations"] = recommendations
