"""Base scanner class with common functionality."""

import time
import asyncio
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.config import settings
from app.utils.validator import validate_target, is_valid_ip, get_domain_from_url


class BaseScannerError(Exception):
    """Base exception for scanner errors."""
    pass


class NetworkTimeoutError(BaseScannerError):
    """Network timeout during scanning."""
    pass


class InvalidTargetError(BaseScannerError):
    """Invalid target provided for scanning."""
    pass


class ScanningNotPossibleError(BaseScannerError):
    """Scanning not possible for this target/service."""
    pass


class BaseScanner(ABC):
    """
    Base scanner class providing common functionality for all scanners.
    """
    
    def __init__(self, target: str, scan_type: str = "full"):
        """
        Initialize base scanner.
        
        Args:
            target: Target to scan (IP or domain)
            scan_type: Type of scan (quick, full, custom)
        """
        self.target = target.strip()
        self.scan_type = scan_type
        self.timeout = settings.SCAN_TIMEOUT
        self.start_time = None
        self.is_ip = is_valid_ip(self.target)
        self.domain = self.target if not self.is_ip else None
        
        # Validate target
        if not validate_target(self.target):
            raise InvalidTargetError(f"Invalid target: {self.target}")
    
    @abstractmethod
    def scan(self) -> Dict[str, Any]:
        """
        Perform the actual scanning operation.
        
        Returns:
            dict: Scan results with status, data, and optional note
        """
        pass
    
    def start_scan(self) -> None:
        """Mark scan start time."""
        self.start_time = time.time()
    
    def get_scan_duration(self) -> Optional[str]:
        """
        Get formatted scan duration.
        
        Returns:
            str: Duration in human readable format
        """
        if self.start_time is None:
            return None
        
        duration = time.time() - self.start_time
        
        if duration < 60:
            return f"{duration:.1f} seconds"
        elif duration < 3600:
            return f"{duration/60:.1f} minutes"
        else:
            return f"{duration/3600:.1f} hours"
    
    def create_result(self, status: str, data: Any = None, note: str = None) -> Dict[str, Any]:
        """
        Create standardized result structure.
        
        Args:
            status: Scan status (completed, failed)
            data: Scan data
            note: Optional note for failed scans
            
        Returns:
            dict: Standardized result structure
        """
        result = {
            "status": status,
            "scan_duration": self.get_scan_duration()
        }
        
        if data is not None:
            result.update(data)
        
        if note:
            result["note"] = note
            
        return result
    
    def handle_timeout(self, operation: str) -> Dict[str, Any]:
        """
        Handle timeout scenarios with standard response.
        
        Args:
            operation: Description of operation that timed out
            
        Returns:
            dict: Standardized timeout result
        """
        return self.create_result(
            "failed",
            note=f"Data not obtained; {operation} timed out after {self.timeout} seconds"
        )
    
    def handle_network_error(self, operation: str, error: str = None) -> Dict[str, Any]:
        """
        Handle network errors with standard response.
        
        Args:
            operation: Description of operation that failed
            error: Optional error details
            
        Returns:
            dict: Standardized network error result
        """
        note = f"Data not obtained; {operation} failed"
        if error:
            note += f": {error}"
            
        return self.create_result("failed", note=note)
    
    def handle_access_denied(self, service: str) -> Dict[str, Any]:
        """
        Handle access denied scenarios.
        
        Args:
            service: Service that denied access
            
        Returns:
            dict: Standardized access denied result
        """
        return self.create_result(
            "failed",
            note=f"Scanning not possible; {service} access denied or blocked"
        )
    
    def handle_service_not_found(self, service: str) -> Dict[str, Any]:
        """
        Handle service not found scenarios.
        
        Args:
            service: Service that was not found
            
        Returns:
            dict: Standardized service not found result
        """
        return self.create_result(
            "failed",
            note=f"Scanning not possible; {service} not detected or available"
        )
    
    def should_scan_quickly(self) -> bool:
        """
        Check if this is a quick scan for resource optimization.
        
        Returns:
            bool: True if quick scan mode
        """
        return self.scan_type == "quick"
    
    def get_ports_to_scan(self, default_ports: list) -> list:
        """
        Get list of ports to scan based on scan type.
        
        Args:
            default_ports: Default ports for this scanner
            
        Returns:
            list: Ports to scan
        """
        if self.scan_type == "quick":
            return settings.COMMON_PORTS
        elif self.scan_type == "full":
            return settings.FULL_SCAN_PORTS if hasattr(settings, 'FULL_SCAN_PORTS') else default_ports
        else:
            return default_ports
    
    async def async_timeout_wrapper(self, coro, timeout: int = None):
        """
        Wrap async operations with timeout handling.
        
        Args:
            coro: Coroutine to execute
            timeout: Timeout in seconds
            
        Returns:
            Result of coroutine or raises TimeoutError
        """
        timeout = timeout or self.timeout
        try:
            return await asyncio.wait_for(coro, timeout=timeout)
        except asyncio.TimeoutError:
            raise NetworkTimeoutError(f"Operation timed out after {timeout} seconds")
    
    def log_scan_info(self, message: str) -> None:
        """
        Log scan information (can be overridden by subclasses).
        
        Args:
            message: Message to log
        """
        # Simple print for now, can be enhanced with proper logging
        print(f"[{self.__class__.__name__}] {self.target}: {message}")
    
    def is_scannable_port(self, port: int) -> bool:
        """
        Check if port is in scannable range and not restricted.
        
        Args:
            port: Port number to check
            
        Returns:
            bool: True if port can be scanned
        """
        # Avoid scanning certain system/restricted ports
        restricted_ports = [0]  # Can add more if needed
        return 1 <= port <= 65535 and port not in restricted_ports
