"""Backup & DR Assessment Scanner - Publicly accessible backup detection."""

import asyncio
import aiohttp
from typing import Dict, List, Any, Optional
from urllib.parse import urljoin
import re

from app.scanners.base import BaseScanner, NetworkTimeoutError, ScanningNotPossibleError
from app.config import settings


class BackupDRScanner(BaseScanner):
    """
    Scanner for backup and disaster recovery assessment including:
    - Publicly accessible backup files
    - Configuration file exposure
    - Database dump detection
    - DR site accessibility
    """
    
    def __init__(self, target: str, scan_type: str = "full"):
        super().__init__(target, scan_type)
        self.results = {
            "exposed_backups": [],
            "dr_sites": [],
            "config_files": [],
            "recommendations": [],
            "vulnerabilities": []
        }
        
        # Common backup file patterns
        self.backup_patterns = [
            "backup.zip", "backup.tar.gz", "backup.sql", "backup.bak",
            "database.sql", "db.sql", "dump.sql", "site-backup.zip",
            "www.tar.gz", "website.zip", "files.tar", "data.zip"
        ]
        
        # Configuration files that might be exposed
        self.config_patterns = [
            ".env", "config.php", "wp-config.php", "database.yml",
            "settings.py", "app.config", "web.config", ".htaccess"
        ]
        
        # DR site subdomain patterns
        self.dr_subdomains = [
            "dr", "disaster", "backup", "failover", "secondary",
            "mirror", "replica", "standby", "recovery"
        ]
    
    def scan(self) -> Dict[str, Any]:
        """
        Perform backup and DR assessment.
        
        Returns:
            dict: Backup and DR assessment results
        """
        self.start_scan()
        
        try:
            # Run async scanning operations
            asyncio.run(self._perform_backup_scan())
            
            # Generate recommendations
            self._generate_recommendations()
            
            return self.create_result("completed", self.results)
            
        except NetworkTimeoutError:
            return self.handle_timeout("backup and DR assessment")
        except ScanningNotPossibleError as e:
            return self.handle_network_error("backup and DR assessment", str(e))
        except Exception as e:
            return self.handle_network_error("backup and DR assessment", str(e))
    
    async def _perform_backup_scan(self) -> None:
        """
        Perform the main backup and DR scanning operations.
        """
        timeout = aiohttp.ClientTimeout(total=self.timeout)
        connector = aiohttp.TCPConnector(ssl=False, limit=10)
        
        async with aiohttp.ClientSession(
            timeout=timeout,
            connector=connector,
            headers={"User-Agent": "Security-Scanner/1.0"}
        ) as session:
            
            # Check for exposed backup files
            await self._check_exposed_backups(session)
            
            # Check for exposed configuration files
            await self._check_config_files(session)
            
            # Discover DR sites
            await self._discover_dr_sites(session)
    
    async def _check_exposed_backups(self, session: aiohttp.ClientSession) -> None:
        """
        Check for publicly accessible backup files.
        
        Args:
            session: aiohttp session
        """
        self.log_scan_info("Checking for exposed backup files")
        
        base_urls = [f"http://{self.target}", f"https://{self.target}"]
        
        # Common backup locations
        backup_paths = [
            "/", "/backup/", "/backups/", "/old/", "/tmp/",
            "/files/", "/download/", "/public/", "/assets/"
        ]
        
        for base_url in base_urls:
            for backup_path in backup_paths:
                for backup_file in self.backup_patterns:
                    try:
                        url = urljoin(base_url + backup_path, backup_file)
                        
                        async with session.head(url) as response:
                            if response.status == 200:
                                file_info = await self._analyze_backup_file(session, url, response)
                                if file_info:
                                    self.results["exposed_backups"].append(file_info)
                                    self.log_scan_info(f"Found exposed backup: {url}")
                        
                    except asyncio.TimeoutError:
                        continue
                    except Exception:
                        continue
                        
                # For quick scans, limit the number of files checked
                if self.should_scan_quickly() and len(self.results["exposed_backups"]) >= 3:
                    break
    
    async def _analyze_backup_file(self, session: aiohttp.ClientSession, url: str, response: aiohttp.ClientResponse) -> Optional[Dict[str, Any]]:
        """
        Analyze discovered backup file.
        
        Args:
            session: aiohttp session
            url: Backup file URL
            response: HTTP response
            
        Returns:
            dict: Backup file analysis
        """
        try:
            content_length = response.headers.get('Content-Length')
            content_type = response.headers.get('Content-Type', 'unknown')
            
            file_info = {
                "url": url,
                "accessible": True,
                "file_size": self._format_file_size(content_length) if content_length else "Unknown",
                "content_type": content_type,
                "risk_level": "HIGH",  # All exposed backups are high risk
                "last_modified": response.headers.get('Last-Modified'),
                "security_issues": []
            }
            
            # Determine risk level based on file type and size
            file_info["risk_level"] = self._assess_backup_risk(url, content_length)
            
            # Add vulnerability entry
            self.results["vulnerabilities"].append({
                "type": "exposed_backup_file",
                "severity": "critical" if file_info["risk_level"] == "CRITICAL" else "high",
                "description": f"Publicly accessible backup file: {url}",
                "file_size": file_info["file_size"],
                "recommendation": "Remove or secure backup files from public access"
            })
            
            return file_info
            
        except Exception as e:
            self.log_scan_info(f"Failed to analyze backup file {url}: {e}")
            return None
    
    def _format_file_size(self, size_str: str) -> str:
        """
        Format file size in human readable format.
        
        Args:
            size_str: File size in bytes as string
            
        Returns:
            str: Formatted file size
        """
        try:
            size = int(size_str)
            for unit in ['B', 'KB', 'MB', 'GB']:
                if size < 1024.0:
                    return f"{size:.1f}{unit}"
                size /= 1024.0
            return f"{size:.1f}TB"
        except (ValueError, TypeError):
            return "Unknown"
    
    def _assess_backup_risk(self, url: str, content_length: str) -> str:
        """
        Assess risk level of exposed backup.
        
        Args:
            url: Backup file URL
            content_length: File size in bytes
            
        Returns:
            str: Risk level (CRITICAL, HIGH, MEDIUM)
        """
        url_lower = url.lower()
        
        # Database dumps are critical
        if any(db_term in url_lower for db_term in ['.sql', 'database', 'dump', 'db.']):
            return "CRITICAL"
        
        # Large files are likely more critical
        try:
            if content_length and int(content_length) > 100 * 1024 * 1024:  # > 100MB
                return "CRITICAL"
            elif content_length and int(content_length) > 10 * 1024 * 1024:  # > 10MB
                return "HIGH"
        except (ValueError, TypeError):
            pass
        
        # Configuration backups
        if any(config_term in url_lower for config_term in ['config', 'settings', '.env']):
            return "CRITICAL"
        
        return "HIGH"  # Default for any exposed backup
    
    async def _check_config_files(self, session: aiohttp.ClientSession) -> None:
        """
        Check for exposed configuration files.
        
        Args:
            session: aiohttp session
        """
        self.log_scan_info("Checking for exposed configuration files")
        
        base_urls = [f"http://{self.target}", f"https://{self.target}"]
        
        for base_url in base_urls:
            for config_file in self.config_patterns:
                try:
                    url = urljoin(base_url + "/", config_file)
                    
                    async with session.head(url) as response:
                        if response.status == 200:
                            config_info = {
                                "url": url,
                                "accessible": True,
                                "file_type": config_file,
                                "risk_level": "CRITICAL"
                            }
                            
                            self.results["config_files"].append(config_info)
                            
                            self.results["vulnerabilities"].append({
                                "type": "exposed_config_file",
                                "severity": "critical",
                                "description": f"Configuration file publicly accessible: {url}",
                                "recommendation": "Remove configuration files from public directories"
                            })
                            
                            self.log_scan_info(f"Found exposed config file: {url}")
                    
                except asyncio.TimeoutError:
                    continue
                except Exception:
                    continue
                    
                # Limit for quick scans
                if self.should_scan_quickly() and len(self.results["config_files"]) >= 3:
                    break
    
    async def _discover_dr_sites(self, session: aiohttp.ClientSession) -> None:
        """
        Discover disaster recovery sites through subdomain enumeration.
        
        Args:
            session: aiohttp session
        """
        if self.is_ip:
            return  # Skip DR site discovery for IP addresses
        
        self.log_scan_info("Discovering DR sites")
        
        for subdomain in self.dr_subdomains:
            try:
                dr_domain = f"{subdomain}.{self.target}"
                dr_urls = [f"http://{dr_domain}", f"https://{dr_domain}"]
                
                for dr_url in dr_urls:
                    try:
                        async with session.get(dr_url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                            if response.status in [200, 301, 302, 403]:
                                self.results["dr_sites"].append(dr_domain)
                                self.log_scan_info(f"Found potential DR site: {dr_domain}")
                                break  # Found one protocol, skip the other
                    
                    except asyncio.TimeoutError:
                        continue
                    except Exception:
                        continue
                        
            except Exception:
                continue
                
            # Limit for quick scans
            if self.should_scan_quickly() and len(self.results["dr_sites"]) >= 2:
                break
    
    def _generate_recommendations(self) -> None:
        """
        Generate security recommendations based on findings.
        """
        recommendations = []
        
        # Backup security recommendations
        if self.results["exposed_backups"]:
            recommendations.extend([
                "Remove all backup files from publicly accessible directories",
                "Implement secure backup storage with proper access controls",
                "Use encrypted backup storage solutions",
                "Regularly audit backup file locations for exposure"
            ])
        
        if self.results["config_files"]:
            recommendations.extend([
                "Move configuration files outside web root directory",
                "Implement proper .htaccess or web server rules to block config file access",
                "Use environment variables for sensitive configuration"
            ])
        
        # DR site recommendations
        if self.results["dr_sites"]:
            recommendations.extend([
                "Ensure DR sites have same security controls as production",
                "Implement access restrictions for DR environments",
                "Regular security testing of DR infrastructure"
            ])
        
        # General backup recommendations
        recommendations.extend([
            "Implement automated backup verification and testing",
            "Use off-site backup storage with encryption",
            "Document and test disaster recovery procedures",
            "Implement backup retention policies",
            "Monitor backup processes for failures and security events"
        ])
        
        self.results["recommendations"] = recommendations
