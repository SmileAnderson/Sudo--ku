"""Internet Exposure Inventory Scanner - Port scanning and service detection."""

import socket
import asyncio
from typing import Dict, List, Any, Optional
from concurrent.futures import ThreadPoolExecutor
import time
import subprocess
import platform

from app.scanners.base import BaseScanner, NetworkTimeoutError, ScanningNotPossibleError
from app.config import settings

# Try to import nmap, but don't fail if it's not available
try:
    import nmap
    NMAP_AVAILABLE = True
except ImportError:
    NMAP_AVAILABLE = False
    nmap = None


class InternetExposureScanner(BaseScanner):
    """
    Scanner for detecting open ports, services, and OS fingerprinting.
    Uses nmap when available, falls back to native Python port scanning.
    """
    
    def __init__(self, target: str, scan_type: str = "full"):
        super().__init__(target, scan_type)
        self.nm = None
        self.use_nmap = False
        self.open_ports = []
        self.os_fingerprint = None
        
        # Try to initialize nmap if available
        if NMAP_AVAILABLE:
            try:
                self.nm = nmap.PortScanner()
                self.use_nmap = True
                self.log_scan_info("Using nmap for advanced scanning")
            except Exception as e:
                self.log_scan_info(f"Nmap initialization failed: {e}")
                self.use_nmap = False
        
        if not self.use_nmap:
            self.log_scan_info("Using fallback Python socket scanning")
        
    def scan(self) -> Dict[str, Any]:
        """
        Perform internet exposure scanning.
        
        Returns:
            dict: Scan results with open ports, services, and OS detection
        """
        self.start_scan()
        
        try:
            # Determine ports to scan based on scan type
            ports_to_scan = self._get_scan_ports()
            
            self.log_scan_info(f"Scanning {len(ports_to_scan)} ports using {'nmap' if self.use_nmap else 'Python sockets'}")
            
            # Perform port scan using appropriate method
            if self.use_nmap:
                scan_results = self._perform_nmap_scan(ports_to_scan)
                if scan_results:
                    self._extract_nmap_port_info(scan_results)
            else:
                self._perform_socket_scan(ports_to_scan)
            
            # Perform OS detection if ports are open and using nmap
            if self.open_ports and not self.should_scan_quickly() and self.use_nmap:
                self._perform_os_detection()
            
            # Banner grabbing for additional service info
            if self.open_ports:
                self._perform_banner_grabbing()
            
            return self.create_result("completed", {
                "open_ports": self.open_ports,
                "os_fingerprint": self.os_fingerprint,
                "total_ports_scanned": len(ports_to_scan),
                "scan_duration": self.get_scan_duration(),
                "scan_method": "nmap" if self.use_nmap else "socket"
            })
            
        except NetworkTimeoutError:
            return self.handle_timeout("port scanning")
        except ScanningNotPossibleError as e:
            return self.handle_network_error("port scanning", str(e))
        except Exception as e:
            return self.handle_network_error("port scanning", str(e))
    
    def _get_scan_ports(self) -> List[int]:
        """
        Get list of ports to scan based on scan type.
        
        Returns:
            list: Port numbers to scan
        """
        if self.scan_type == "quick":
            return settings.COMMON_PORTS
        elif self.scan_type == "full":
            # For full scan, use top 1000 ports for efficiency
            return list(range(1, 1001))
        else:
            # Custom scan - use common ports
            return settings.COMMON_PORTS
    
    def _perform_nmap_scan(self, ports: List[int]) -> Optional[Dict]:
        """
        Perform the actual port scan using nmap.
        
        Args:
            ports: List of ports to scan
            
        Returns:
            dict: Nmap scan results
        """
        try:
            # Convert ports list to nmap format
            port_range = ','.join(map(str, ports))
            
            # Configure scan arguments for efficiency and stealth
            scan_args = [
                '-sS',  # SYN scan
                '-T4',  # Aggressive timing
                f'--max-retries=1',  # Limit retries for speed
                f'--host-timeout={self.timeout}s',
                '--max-rtt-timeout=2s',
                '--initial-rtt-timeout=500ms'
            ]
            
            # Add version detection for non-quick scans
            if not self.should_scan_quickly():
                scan_args.extend(['-sV', '--version-intensity=5'])
            
            self.log_scan_info(f"Running nmap scan: {' '.join(scan_args)}")
            
            # Perform scan with timeout
            try:
                self.nm.scan(
                    hosts=self.target,
                    ports=port_range,
                    arguments=' '.join(scan_args)
                )
                return self.nm.all_hosts()
            except Exception as e:
                if "timed out" in str(e).lower():
                    raise NetworkTimeoutError(f"Nmap scan timed out: {e}")
                else:
                    raise ScanningNotPossibleError(f"Nmap scan failed: {e}")
                    
        except Exception as e:
            self.log_scan_info(f"Port scan error: {e}")
            raise
    
    def _perform_socket_scan(self, ports: List[int]) -> None:
        """
        Perform port scanning using Python sockets as fallback.
        
        Args:
            ports: List of ports to scan
        """
        self.open_ports = []
        max_threads = min(50, len(ports))  # Limit concurrent connections
        
        def scan_port(port):
            """Scan a single port using socket connection."""
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(3)  # 3 second timeout per port
                
                result = sock.connect_ex((self.target, port))
                sock.close()
                
                if result == 0:  # Port is open
                    service_name = self._guess_service_name(port)
                    return {
                        "port": port,
                        "protocol": "tcp",
                        "service": service_name,
                        "state": "open",
                        "method": "socket_connect"
                    }
                    
            except Exception as e:
                self.log_scan_info(f"Error scanning port {port}: {e}")
            
            return None
        
        # Use thread pool for concurrent scanning
        with ThreadPoolExecutor(max_workers=max_threads) as executor:
            results = list(executor.map(scan_port, ports))
        
        # Filter out None results and store open ports
        self.open_ports = [result for result in results if result is not None]
        
        self.log_scan_info(f"Socket scan found {len(self.open_ports)} open ports")
    
    def _guess_service_name(self, port: int) -> str:
        """
        Guess service name based on common port numbers.
        
        Args:
            port: Port number
            
        Returns:
            str: Guessed service name
        """
        common_services = {
            21: "ftp",
            22: "ssh", 
            23: "telnet",
            25: "smtp",
            53: "dns",
            80: "http",
            110: "pop3",
            143: "imap",
            443: "https",
            993: "imaps",
            995: "pop3s",
            465: "smtps",
            587: "submission",
            8080: "http-proxy",
            8443: "https-alt",
            3389: "rdp",
            1433: "mssql",
            3306: "mysql",
            5432: "postgresql",
            6379: "redis",
            27017: "mongodb"
        }
        
        return common_services.get(port, "unknown")
    
    def _extract_nmap_port_info(self, hosts: List[str]) -> None:
        """
        Extract port and service information from nmap results.
        
        Args:
            hosts: List of scanned hosts
        """
        self.open_ports = []
        
        for host in hosts:
            if self.target in host or host in self.target:
                host_info = self.nm[host]
                
                # Check if host is up
                if host_info.state() != "up":
                    continue
                
                # Extract port information
                for protocol in host_info.all_protocols():
                    ports = host_info[protocol].keys()
                    
                    for port in ports:
                        port_info = host_info[protocol][port]
                        
                        # Only include open ports
                        if port_info['state'] == 'open':
                            port_data = {
                                "port": port,
                                "protocol": protocol,
                                "service": port_info.get('name', 'unknown'),
                                "state": port_info['state'],
                                "method": "nmap"
                            }
                            
                            # Add version information if available
                            if 'version' in port_info:
                                port_data['version'] = port_info['version']
                            
                            if 'product' in port_info:
                                port_data['product'] = port_info['product']
                            
                            if 'extrainfo' in port_info:
                                port_data['extra_info'] = port_info['extrainfo']
                            
                            self.open_ports.append(port_data)
    
    def _perform_os_detection(self) -> None:
        """
        Perform OS detection using nmap.
        Only runs if open ports are found.
        """
        try:
            self.log_scan_info("Performing OS detection")
            
            # Run OS detection scan
            self.nm.scan(
                hosts=self.target,
                arguments=f'-O --osscan-limit --max-os-tries=1 --host-timeout={self.timeout}s'
            )
            
            for host in self.nm.all_hosts():
                if self.target in host or host in self.target:
                    host_info = self.nm[host]
                    
                    if 'osmatch' in host_info:
                        os_matches = host_info['osmatch']
                        if os_matches:
                            # Get the best match
                            best_match = max(os_matches, key=lambda x: int(x.get('accuracy', 0)))
                            self.os_fingerprint = best_match.get('name', 'Unknown')
                            break
                            
        except Exception as e:
            self.log_scan_info(f"OS detection failed: {e}")
            # OS detection failure is not critical, continue without it
    
    def _perform_banner_grabbing(self) -> None:
        """
        Perform banner grabbing on open ports for additional service information.
        """
        if self.should_scan_quickly():
            return  # Skip banner grabbing for quick scans
        
        for port_info in self.open_ports:
            try:
                port = port_info['port']
                protocol = port_info['protocol']
                
                # Only grab banners for TCP ports
                if protocol.lower() != 'tcp':
                    continue
                
                banner = self._grab_banner(port)
                if banner:
                    port_info['banner'] = banner
                    
            except Exception as e:
                self.log_scan_info(f"Banner grab failed for port {port_info['port']}: {e}")
                continue
    
    def _grab_banner(self, port: int, timeout: int = 5) -> Optional[str]:
        """
        Grab banner from a specific port.
        
        Args:
            port: Port number to connect to
            timeout: Connection timeout
            
        Returns:
            str: Banner text or None if failed
        """
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(timeout)
            
            result = sock.connect_ex((self.target, port))
            if result == 0:
                # Send a simple request for common services
                try:
                    if port in [80, 8080]:
                        sock.send(b"GET / HTTP/1.0\r\n\r\n")
                    elif port in [21, 22, 23, 25, 110, 143]:
                        sock.send(b"\r\n")
                    else:
                        sock.send(b"\r\n")
                    
                    banner = sock.recv(1024).decode('utf-8', errors='ignore').strip()
                    if banner:
                        # Clean up the banner (remove excessive whitespace, limit length)
                        banner = ' '.join(banner.split())[:200]
                        return banner
                        
                except:
                    pass
            
            sock.close()
            return None
            
        except Exception:
            return None
    
    def _is_port_filtered(self, port: int) -> bool:
        """
        Check if a port appears to be filtered by firewall.
        
        Args:
            port: Port number to check
            
        Returns:
            bool: True if port appears filtered
        """
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)  # Short timeout for filtered check
            
            result = sock.connect_ex((self.target, port))
            sock.close()
            
            # Connection refused = port closed but reachable
            # Timeout = likely filtered
            return result != 0 and result != 111  # 111 = connection refused
            
        except:
            return True
