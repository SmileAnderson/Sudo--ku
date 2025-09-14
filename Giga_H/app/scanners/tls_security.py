"""TLS/SSL Security Analysis Scanner - Certificate and protocol security assessment."""

import ssl
import socket
import asyncio
import aiohttp
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
from cryptography import x509
from cryptography.hazmat.backends import default_backend
import OpenSSL

from app.scanners.base import BaseScanner, NetworkTimeoutError, ScanningNotPossibleError
from app.config import settings


class TLSSecurityScanner(BaseScanner):
    """
    Scanner for TLS/SSL security analysis including:
    - Supported TLS versions
    - Certificate validation and chain verification
    - Cipher suites analysis
    - HSTS header checking
    """
    
    def __init__(self, target: str, scan_type: str = "full"):
        super().__init__(target, scan_type)
        self.tls_ports = [443, 993, 995, 465, 587, 636, 989, 990]
        self.results = {
            "tls_versions": [],
            "certificate": None,
            "cipher_suites": [],
            "hsts_enabled": False,
            "hsts_max_age": None,
            "certificate_chain": [],
            "vulnerabilities": []
        }
    
    def scan(self) -> Dict[str, Any]:
        """
        Perform TLS/SSL security scanning.
        
        Returns:
            dict: TLS security analysis results
        """
        self.start_scan()
        
        try:
            # Find TLS-enabled services
            tls_services = self._find_tls_services()
            
            if not tls_services:
                return self.handle_service_not_found("TLS/SSL services")
            
            # Test each TLS service found
            for service in tls_services:
                self._analyze_tls_service(service['port'])
            
            # Check HSTS if web service is available
            if any(port in [443, 8443] for port in [s['port'] for s in tls_services]):
                asyncio.run(self._check_hsts())
            
            return self.create_result("completed", self.results)
            
        except NetworkTimeoutError:
            return self.handle_timeout("TLS/SSL analysis")
        except ScanningNotPossibleError as e:
            return self.handle_network_error("TLS/SSL analysis", str(e))
        except Exception as e:
            return self.handle_network_error("TLS/SSL analysis", str(e))
    
    def _find_tls_services(self) -> List[Dict[str, Any]]:
        """
        Find TLS-enabled services on the target.
        
        Returns:
            list: List of TLS services with port and protocol info
        """
        tls_services = []
        
        # Check common TLS ports
        ports_to_check = self.tls_ports if not self.should_scan_quickly() else [443]
        
        for port in ports_to_check:
            if self._is_port_open_tls(port):
                service_info = {
                    "port": port,
                    "protocol": self._get_protocol_for_port(port)
                }
                tls_services.append(service_info)
                
                # For quick scan, just find first TLS service
                if self.should_scan_quickly():
                    break
        
        return tls_services
    
    def _is_port_open_tls(self, port: int, timeout: int = 5) -> bool:
        """
        Check if a port is open and supports TLS.
        
        Args:
            port: Port number to check
            timeout: Connection timeout
            
        Returns:
            bool: True if port supports TLS
        """
        try:
            # Create SSL context
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            with socket.create_connection((self.target, port), timeout) as sock:
                with context.wrap_socket(sock, server_hostname=self.target) as ssock:
                    return True
                    
        except (socket.timeout, socket.error, ssl.SSLError, ConnectionRefusedError):
            return False
        except Exception:
            return False
    
    def _get_protocol_for_port(self, port: int) -> str:
        """
        Get protocol name for common TLS ports.
        
        Args:
            port: Port number
            
        Returns:
            str: Protocol name
        """
        protocol_map = {
            443: "HTTPS",
            993: "IMAPS", 
            995: "POP3S",
            465: "SMTPS",
            587: "SMTP with STARTTLS",
            636: "LDAPS",
            989: "FTPS Data",
            990: "FTPS Control"
        }
        return protocol_map.get(port, f"TLS on port {port}")
    
    def _analyze_tls_service(self, port: int) -> None:
        """
        Analyze TLS configuration for a specific service.
        
        Args:
            port: Port number to analyze
        """
        try:
            self.log_scan_info(f"Analyzing TLS on port {port}")
            
            # Test TLS versions
            self._test_tls_versions(port)
            
            # Get certificate information
            self._get_certificate_info(port)
            
            # Test cipher suites (only for full scans)
            if not self.should_scan_quickly():
                self._test_cipher_suites(port)
            
        except Exception as e:
            self.log_scan_info(f"TLS analysis failed for port {port}: {e}")
    
    def _test_tls_versions(self, port: int) -> None:
        """
        Test which TLS versions are supported.
        
        Args:
            port: Port to test
        """
        tls_versions = [
            ("TLSv1.0", ssl.PROTOCOL_TLSv1),
            ("TLSv1.1", ssl.PROTOCOL_TLSv1_1), 
            ("TLSv1.2", ssl.PROTOCOL_TLSv1_2),
            ("TLSv1.3", ssl.PROTOCOL_TLS)  # TLS 1.3 uses the generic TLS protocol
        ]
        
        supported_versions = []
        
        for version_name, protocol in tls_versions:
            try:
                context = ssl.SSLContext(protocol)
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE
                
                # For TLS 1.3, we need to configure it specifically
                if version_name == "TLSv1.3":
                    context.minimum_version = ssl.TLSVersion.TLSv1_3
                    context.maximum_version = ssl.TLSVersion.TLSv1_3
                
                with socket.create_connection((self.target, port), timeout=self.timeout) as sock:
                    with context.wrap_socket(sock, server_hostname=self.target) as ssock:
                        supported_versions.append(version_name)
                        self.log_scan_info(f"TLS version {version_name} supported")
                        
            except (ssl.SSLError, socket.error, ConnectionRefusedError):
                # Version not supported
                continue
            except Exception as e:
                self.log_scan_info(f"Error testing {version_name}: {e}")
                continue
        
        self.results["tls_versions"] = supported_versions
        
        # Check for vulnerable versions
        vulnerable_versions = ["TLSv1.0", "TLSv1.1", "SSLv2", "SSLv3"]
        for vuln_version in vulnerable_versions:
            if vuln_version in supported_versions:
                self.results["vulnerabilities"].append({
                    "type": "weak_tls_version",
                    "version": vuln_version,
                    "severity": "high" if vuln_version in ["SSLv2", "SSLv3"] else "medium",
                    "description": f"{vuln_version} is deprecated and vulnerable to attacks"
                })
    
    def _get_certificate_info(self, port: int) -> None:
        """
        Get detailed certificate information.
        
        Args:
            port: Port to get certificate from
        """
        try:
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            with socket.create_connection((self.target, port), timeout=self.timeout) as sock:
                with context.wrap_socket(sock, server_hostname=self.target) as ssock:
                    # Get certificate in DER format
                    der_cert = ssock.getpeercert(binary_form=True)
                    
                    # Parse with cryptography library for detailed info
                    cert = x509.load_der_x509_certificate(der_cert, default_backend())
                    
                    # Extract certificate information
                    cert_info = {
                        "subject": self._format_name(cert.subject),
                        "issuer": self._format_name(cert.issuer),
                        "valid_from": cert.not_valid_before.isoformat(),
                        "valid_until": cert.not_valid_after.isoformat(),
                        "serial_number": str(cert.serial_number),
                        "version": cert.version.name,
                        "signature_algorithm": cert.signature_algorithm_oid._name,
                        "key_size": self._get_key_size(cert.public_key())
                    }
                    
                    # Calculate days until expiry
                    now = datetime.now(timezone.utc)
                    expires = cert.not_valid_after.replace(tzinfo=timezone.utc)
                    days_until_expiry = (expires - now).days
                    cert_info["days_until_expiry"] = days_until_expiry
                    
                    # Check for certificate issues
                    if days_until_expiry < 30:
                        self.results["vulnerabilities"].append({
                            "type": "certificate_expiry",
                            "severity": "high" if days_until_expiry < 0 else "medium",
                            "description": f"Certificate expires in {days_until_expiry} days",
                            "expires": cert.not_valid_after.isoformat()
                        })
                    
                    # Check key size
                    if cert_info["key_size"] < 2048:
                        self.results["vulnerabilities"].append({
                            "type": "weak_key_size",
                            "severity": "medium",
                            "description": f"Certificate uses weak key size: {cert_info['key_size']} bits",
                            "key_size": cert_info["key_size"]
                        })
                    
                    self.results["certificate"] = cert_info
                    
                    # Get certificate chain
                    self._get_certificate_chain(ssock)
                    
        except Exception as e:
            self.log_scan_info(f"Certificate analysis failed: {e}")
    
    def _format_name(self, name) -> str:
        """
        Format X.509 name to string.
        
        Args:
            name: X.509 Name object
            
        Returns:
            str: Formatted name string
        """
        try:
            components = []
            for attribute in name:
                components.append(f"{attribute.oid._name}={attribute.value}")
            return ", ".join(components)
        except:
            return str(name)
    
    def _get_key_size(self, public_key) -> int:
        """
        Get public key size in bits.
        
        Args:
            public_key: Certificate public key
            
        Returns:
            int: Key size in bits
        """
        try:
            if hasattr(public_key, 'key_size'):
                return public_key.key_size
            elif hasattr(public_key, 'curve'):
                # EC key
                return public_key.curve.key_size
            else:
                return 0
        except:
            return 0
    
    def _get_certificate_chain(self, ssl_sock) -> None:
        """
        Get certificate chain information.
        
        Args:
            ssl_sock: SSL socket connection
        """
        try:
            # Get peer certificate chain
            chain = ssl_sock.getpeercert_chain()
            
            if chain:
                chain_info = []
                for cert in chain:
                    # Convert to PEM and parse
                    pem_cert = ssl.DER_cert_to_PEM_cert(cert.to_der())
                    x509_cert = x509.load_pem_x509_certificate(pem_cert.encode(), default_backend())
                    
                    chain_info.append({
                        "subject": self._format_name(x509_cert.subject),
                        "issuer": self._format_name(x509_cert.issuer),
                        "valid_until": x509_cert.not_valid_after.isoformat()
                    })
                
                self.results["certificate_chain"] = chain_info
                
        except Exception as e:
            self.log_scan_info(f"Certificate chain analysis failed: {e}")
    
    def _test_cipher_suites(self, port: int) -> None:
        """
        Test supported cipher suites.
        
        Args:
            port: Port to test
        """
        try:
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            with socket.create_connection((self.target, port), timeout=self.timeout) as sock:
                with context.wrap_socket(sock, server_hostname=self.target) as ssock:
                    cipher = ssock.cipher()
                    if cipher:
                        cipher_info = {
                            "name": cipher[0],
                            "version": cipher[1], 
                            "bits": cipher[2]
                        }
                        self.results["cipher_suites"].append(cipher_info)
                        
                        # Check for weak ciphers
                        weak_ciphers = ["RC4", "DES", "3DES", "MD5"]
                        if any(weak in cipher[0] for weak in weak_ciphers):
                            self.results["vulnerabilities"].append({
                                "type": "weak_cipher",
                                "severity": "medium",
                                "description": f"Weak cipher suite supported: {cipher[0]}",
                                "cipher": cipher[0]
                            })
                        
        except Exception as e:
            self.log_scan_info(f"Cipher suite testing failed: {e}")
    
    async def _check_hsts(self) -> None:
        """
        Check for HSTS (HTTP Strict Transport Security) header.
        """
        try:
            async with aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=self.timeout),
                connector=aiohttp.TCPConnector(ssl=False)
            ) as session:
                
                # Try HTTPS first
                url = f"https://{self.target}"
                
                try:
                    async with session.get(url) as response:
                        hsts_header = response.headers.get('Strict-Transport-Security')
                        
                        if hsts_header:
                            self.results["hsts_enabled"] = True
                            
                            # Parse max-age
                            if "max-age=" in hsts_header:
                                max_age_str = hsts_header.split("max-age=")[1].split(";")[0]
                                try:
                                    self.results["hsts_max_age"] = int(max_age_str)
                                except ValueError:
                                    pass
                            
                            self.log_scan_info(f"HSTS enabled: {hsts_header}")
                        else:
                            self.results["hsts_enabled"] = False
                            self.results["vulnerabilities"].append({
                                "type": "missing_hsts",
                                "severity": "low",
                                "description": "HSTS header not configured",
                                "recommendation": "Enable HTTP Strict Transport Security"
                            })
                            
                except Exception as e:
                    self.log_scan_info(f"HSTS check failed: {e}")
                    
        except Exception as e:
            self.log_scan_info(f"HSTS analysis failed: {e}")
