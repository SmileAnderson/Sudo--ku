"""CVE Vulnerability Assessment Scanner - Known vulnerability detection."""

import asyncio
import aiohttp
import json
import re
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import hashlib

from app.scanners.base import BaseScanner, NetworkTimeoutError, ScanningNotPossibleError
from app.config import settings


class CVEVulnerabilityScanner(BaseScanner):
    """
    Scanner for detecting known vulnerabilities based on:
    - Service versions detected from port scans
    - CPE (Common Platform Enumeration) matching
    - CVSS score analysis and risk assessment
    - Integration with NVD (National Vulnerability Database)
    """
    
    def __init__(self, target: str, scan_type: str = "full"):
        super().__init__(target, scan_type)
        self.results = {
            "vulnerabilities": [],
            "risk_summary": {
                "critical": 0,
                "high": 0,
                "medium": 0,
                "low": 0
            },
            "services_analyzed": [],
            "cve_database_status": "unknown"
        }
        
        # Simulated service detection results (in real implementation, this would come from port scanner)
        self.detected_services = []
        
        # CVE severity mapping
        self.severity_mapping = {
            (9.0, 10.0): "critical",
            (7.0, 8.9): "high", 
            (4.0, 6.9): "medium",
            (0.0, 3.9): "low"
        }
    
    def scan(self) -> Dict[str, Any]:
        """
        Perform CVE vulnerability assessment.
        
        Returns:
            dict: Vulnerability assessment results
        """
        self.start_scan()
        
        try:
            # Get detected services (would normally come from previous scans)
            self._get_detected_services()
            
            if not self.detected_services:
                return self.create_result("completed", {
                    **self.results,
                    "note": "No services detected for vulnerability assessment"
                })
            
            # Analyze vulnerabilities for detected services
            asyncio.run(self._analyze_vulnerabilities())
            
            # Calculate risk summary
            self._calculate_risk_summary()
            
            return self.create_result("completed", self.results)
            
        except NetworkTimeoutError:
            return self.handle_timeout("CVE vulnerability analysis")
        except ScanningNotPossibleError as e:
            return self.handle_network_error("CVE vulnerability analysis", str(e))
        except Exception as e:
            return self.handle_network_error("CVE vulnerability analysis", str(e))
    
    def _get_detected_services(self) -> None:
        """
        Get services detected from previous scans.
        In a real implementation, this would integrate with the internet exposure scanner.
        For now, we'll simulate some common services for demonstration.
        """
        # Simulated service detection - in production this would come from port scanner results
        self.detected_services = [
            {
                "port": 80,
                "service": "http",
                "product": "Apache",
                "version": "2.4.41",
                "cpe": "cpe:2.3:a:apache:http_server:2.4.41:*:*:*:*:*:*:*"
            },
            {
                "port": 22,
                "service": "ssh",
                "product": "OpenSSH",
                "version": "7.4",
                "cpe": "cpe:2.3:a:openbsd:openssh:7.4:*:*:*:*:*:*:*"
            },
            {
                "port": 443,
                "service": "https",
                "product": "nginx",
                "version": "1.18.0",
                "cpe": "cpe:2.3:a:nginx:nginx:1.18.0:*:*:*:*:*:*:*"
            }
        ]
        
        self.log_scan_info(f"Analyzing {len(self.detected_services)} detected services for vulnerabilities")
    
    async def _analyze_vulnerabilities(self) -> None:
        """
        Analyze vulnerabilities for all detected services.
        """
        timeout = aiohttp.ClientTimeout(total=self.timeout)
        
        async with aiohttp.ClientSession(timeout=timeout) as session:
            # Check NVD API availability
            await self._check_nvd_availability(session)
            
            # Analyze each service
            for service in self.detected_services:
                try:
                    vulnerabilities = await self._check_service_vulnerabilities(session, service)
                    
                    for vuln in vulnerabilities:
                        vuln["service_info"] = {
                            "port": service["port"],
                            "service": service["service"],
                            "product": service["product"],
                            "version": service["version"]
                        }
                        self.results["vulnerabilities"].append(vuln)
                    
                    self.results["services_analyzed"].append({
                        "service": f"{service['product']} {service['version']}",
                        "port": service["port"],
                        "vulnerabilities_found": len(vulnerabilities)
                    })
                    
                except Exception as e:
                    self.log_scan_info(f"Failed to analyze {service['product']}: {e}")
                    continue
    
    async def _check_nvd_availability(self, session: aiohttp.ClientSession) -> None:
        """
        Check if NVD API is available.
        
        Args:
            session: aiohttp session
        """
        try:
            test_url = f"{settings.NVD_API_URL}?resultsPerPage=1"
            async with session.get(test_url) as response:
                if response.status == 200:
                    self.results["cve_database_status"] = "available"
                    self.log_scan_info("NVD API is available")
                else:
                    self.results["cve_database_status"] = "limited"
                    self.log_scan_info(f"NVD API returned status {response.status}")
        except Exception as e:
            self.results["cve_database_status"] = "unavailable"
            self.log_scan_info(f"NVD API unavailable: {e}")
    
    async def _check_service_vulnerabilities(self, session: aiohttp.ClientSession, service: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Check vulnerabilities for a specific service.
        
        Args:
            session: aiohttp session
            service: Service information dict
            
        Returns:
            list: List of vulnerabilities found
        """
        vulnerabilities = []
        
        try:
            # Use local vulnerability database if NVD is unavailable
            if self.results["cve_database_status"] == "unavailable":
                vulnerabilities = self._check_local_vulnerability_db(service)
            else:
                vulnerabilities = await self._query_nvd_api(session, service)
            
            self.log_scan_info(f"Found {len(vulnerabilities)} vulnerabilities for {service['product']} {service['version']}")
            
        except Exception as e:
            self.log_scan_info(f"Vulnerability check failed for {service['product']}: {e}")
        
        return vulnerabilities
    
    def _check_local_vulnerability_db(self, service: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Check against local vulnerability database (fallback when NVD unavailable).
        
        Args:
            service: Service information
            
        Returns:
            list: Known vulnerabilities
        """
        vulnerabilities = []
        
        # Local database of known vulnerabilities (simplified for demonstration)
        known_vulnerabilities = {
            "apache": {
                "2.4.41": [
                    {
                        "cve_id": "CVE-2021-44790",
                        "cvss_score": 9.8,
                        "description": "A carefully crafted request body can cause a buffer overflow in the mod_lua multipart parser",
                        "patch_available": True,
                        "exploit_available": False
                    }
                ]
            },
            "openssh": {
                "7.4": [
                    {
                        "cve_id": "CVE-2018-15473",
                        "cvss_score": 5.3,
                        "description": "Username enumeration vulnerability",
                        "patch_available": True,
                        "exploit_available": True
                    }
                ]
            },
            "nginx": {
                "1.18.0": [
                    {
                        "cve_id": "CVE-2021-23017",
                        "cvss_score": 8.1,
                        "description": "Resolver off-by-one heap write",
                        "patch_available": True,
                        "exploit_available": False
                    }
                ]
            }
        }
        
        product_lower = service["product"].lower()
        version = service["version"]
        
        if product_lower in known_vulnerabilities and version in known_vulnerabilities[product_lower]:
            for vuln_data in known_vulnerabilities[product_lower][version]:
                vulnerability = {
                    "cve_id": vuln_data["cve_id"],
                    "service": service["product"],
                    "version_affected": version,
                    "cvss_score": vuln_data["cvss_score"],
                    "severity": self._get_severity_from_score(vuln_data["cvss_score"]),
                    "description": vuln_data["description"],
                    "exploit_available": vuln_data["exploit_available"],
                    "patch_available": vuln_data["patch_available"],
                    "source": "local_database"
                }
                vulnerabilities.append(vulnerability)
        
        return vulnerabilities
    
    async def _query_nvd_api(self, session: aiohttp.ClientSession, service: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Query NVD API for vulnerabilities.
        
        Args:
            session: aiohttp session
            service: Service information
            
        Returns:
            list: Vulnerabilities from NVD
        """
        vulnerabilities = []
        
        try:
            # Build query parameters
            product = service["product"].lower()
            version = service["version"]
            
            # Construct search query
            keyword_query = f"{product} {version}"
            
            params = {
                "keywordSearch": keyword_query,
                "resultsPerPage": 20 if not self.should_scan_quickly() else 10,
                "startIndex": 0
            }
            
            url = settings.NVD_API_URL
            
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    # Parse NVD response
                    if "vulnerabilities" in data:
                        for vuln_item in data["vulnerabilities"]:
                            vuln = self._parse_nvd_vulnerability(vuln_item, service)
                            if vuln:
                                vulnerabilities.append(vuln)
                elif response.status == 429:
                    # Rate limited - use local database as fallback
                    self.log_scan_info("NVD API rate limited, using local database")
                    vulnerabilities = self._check_local_vulnerability_db(service)
                else:
                    self.log_scan_info(f"NVD API error: {response.status}")
                    
        except asyncio.TimeoutError:
            self.log_scan_info("NVD API timeout, using local database")
            vulnerabilities = self._check_local_vulnerability_db(service)
        except Exception as e:
            self.log_scan_info(f"NVD API query failed: {e}")
            vulnerabilities = self._check_local_vulnerability_db(service)
        
        return vulnerabilities
    
    def _parse_nvd_vulnerability(self, vuln_item: Dict[str, Any], service: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Parse NVD vulnerability item.
        
        Args:
            vuln_item: Vulnerability data from NVD
            service: Service information
            
        Returns:
            dict: Parsed vulnerability or None if not applicable
        """
        try:
            cve = vuln_item.get("cve", {})
            cve_id = cve.get("id", "Unknown")
            
            # Get CVSS score
            cvss_score = 0.0
            cvss_data = cve.get("metrics", {})
            
            if "cvssMetricV31" in cvss_data:
                cvss_score = cvss_data["cvssMetricV31"][0]["cvssData"]["baseScore"]
            elif "cvssMetricV30" in cvss_data:
                cvss_score = cvss_data["cvssMetricV30"][0]["cvssData"]["baseScore"]
            elif "cvssMetricV2" in cvss_data:
                cvss_score = cvss_data["cvssMetricV2"][0]["cvssData"]["baseScore"]
            
            # Get description
            descriptions = cve.get("descriptions", [])
            description = "No description available"
            for desc in descriptions:
                if desc.get("lang") == "en":
                    description = desc.get("value", description)
                    break
            
            # Check if vulnerability is relevant to this service version
            # This would require more sophisticated CPE matching in production
            if not self._is_vulnerability_relevant(cve, service):
                return None
            
            vulnerability = {
                "cve_id": cve_id,
                "service": service["product"],
                "version_affected": service["version"],
                "cvss_score": cvss_score,
                "severity": self._get_severity_from_score(cvss_score),
                "description": description[:200] + "..." if len(description) > 200 else description,
                "exploit_available": self._check_exploit_availability(cve_id),
                "patch_available": True,  # Assume patch is available for simplicity
                "source": "nvd_api",
                "published_date": cve.get("published", "Unknown")
            }
            
            return vulnerability
            
        except Exception as e:
            self.log_scan_info(f"Failed to parse NVD vulnerability: {e}")
            return None
    
    def _is_vulnerability_relevant(self, cve: Dict[str, Any], service: Dict[str, Any]) -> bool:
        """
        Check if CVE is relevant to the detected service.
        
        Args:
            cve: CVE data
            service: Service information
            
        Returns:
            bool: True if relevant
        """
        # Simplified relevance check - in production this would use proper CPE matching
        product_name = service["product"].lower()
        
        # Check if product name appears in CVE description or references
        cve_text = json.dumps(cve).lower()
        
        # Simple keyword matching
        if product_name in cve_text:
            return True
        
        # Additional product name variations
        product_variations = {
            "apache": ["httpd", "apache_http_server"],
            "nginx": ["nginx"],
            "openssh": ["openssh", "ssh"]
        }
        
        variations = product_variations.get(product_name, [])
        for variation in variations:
            if variation in cve_text:
                return True
        
        return False
    
    def _get_severity_from_score(self, cvss_score: float) -> str:
        """
        Get severity level from CVSS score.
        
        Args:
            cvss_score: CVSS score
            
        Returns:
            str: Severity level
        """
        for (min_score, max_score), severity in self.severity_mapping.items():
            if min_score <= cvss_score <= max_score:
                return severity
        return "unknown"
    
    def _check_exploit_availability(self, cve_id: str) -> bool:
        """
        Check if exploits are available for CVE (simplified).
        
        Args:
            cve_id: CVE identifier
            
        Returns:
            bool: True if exploits likely available
        """
        # Simplified exploit check - in production this would check exploit databases
        high_profile_cves = [
            "CVE-2021-44228",  # Log4j
            "CVE-2021-45046",  # Log4j
            "CVE-2020-1472",   # Zerologon
            "CVE-2019-0708",   # BlueKeep
            "CVE-2017-0144"    # EternalBlue
        ]
        
        return cve_id in high_profile_cves
    
    def _calculate_risk_summary(self) -> None:
        """
        Calculate risk summary based on found vulnerabilities.
        """
        for vulnerability in self.results["vulnerabilities"]:
            severity = vulnerability.get("severity", "unknown")
            if severity in self.results["risk_summary"]:
                self.results["risk_summary"][severity] += 1
        
        total_vulns = sum(self.results["risk_summary"].values())
        self.log_scan_info(f"Risk summary: {total_vulns} total vulnerabilities found")
