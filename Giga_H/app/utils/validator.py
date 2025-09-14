"""Input validation utilities for the cyber hygiene scanner."""

import re
import ipaddress
import validators
from typing import Union
from urllib.parse import urlparse


def validate_target(target: str) -> bool:
    """
    Validate if the target is a valid IP address or domain name.
    
    Args:
        target: The target string to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    if not target or not isinstance(target, str):
        return False
    
    target = target.strip().lower()
    
    # Remove common prefixes
    if target.startswith(('http://', 'https://')):
        parsed = urlparse(target)
        target = parsed.hostname or parsed.netloc
    
    # Validate IP address
    if is_valid_ip(target):
        return True
    
    # Validate domain name
    if is_valid_domain(target):
        return True
    
    return False


def is_valid_ip(ip_str: str) -> bool:
    """
    Check if string is a valid IP address (IPv4 or IPv6).
    
    Args:
        ip_str: String to validate as IP address
        
    Returns:
        bool: True if valid IP, False otherwise
    """
    try:
        ipaddress.ip_address(ip_str)
        return True
    except ValueError:
        return False


def is_valid_domain(domain: str) -> bool:
    """
    Check if string is a valid domain name.
    
    Args:
        domain: String to validate as domain name
        
    Returns:
        bool: True if valid domain, False otherwise
    """
    try:
        # Use validators library for domain validation
        return validators.domain(domain) is True
    except:
        return False


def is_private_ip(ip_str: str) -> bool:
    """
    Check if IP address is in private range.
    
    Args:
        ip_str: IP address string
        
    Returns:
        bool: True if private IP, False otherwise
    """
    try:
        ip = ipaddress.ip_address(ip_str)
        return ip.is_private
    except ValueError:
        return False


def is_public_ip(ip_str: str) -> bool:
    """
    Check if IP address is public (not private, loopback, or reserved).
    
    Args:
        ip_str: IP address string
        
    Returns:
        bool: True if public IP, False otherwise
    """
    try:
        ip = ipaddress.ip_address(ip_str)
        return not (ip.is_private or ip.is_loopback or ip.is_reserved or ip.is_multicast)
    except ValueError:
        return False


def sanitize_input(input_str: str, max_length: int = 255) -> str:
    """
    Sanitize user input to prevent injection attacks.
    
    Args:
        input_str: Input string to sanitize
        max_length: Maximum allowed length
        
    Returns:
        str: Sanitized string
    """
    if not input_str:
        return ""
    
    # Limit length
    sanitized = input_str[:max_length]
    
    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&', ';', '(', ')', '|', '`', '$']
    for char in dangerous_chars:
        sanitized = sanitized.replace(char, '')
    
    # Remove multiple spaces and newlines
    sanitized = re.sub(r'\s+', ' ', sanitized).strip()
    
    return sanitized


def validate_email(email: str) -> bool:
    """
    Validate email address format.
    
    Args:
        email: Email address to validate
        
    Returns:
        bool: True if valid email, False otherwise
    """
    try:
        return validators.email(email) is True
    except:
        return False


def validate_port(port: Union[str, int]) -> bool:
    """
    Validate if port number is valid (1-65535).
    
    Args:
        port: Port number to validate
        
    Returns:
        bool: True if valid port, False otherwise
    """
    try:
        port_num = int(port)
        return 1 <= port_num <= 65535
    except (ValueError, TypeError):
        return False


def get_domain_from_url(url: str) -> str:
    """
    Extract domain from URL.
    
    Args:
        url: URL to parse
        
    Returns:
        str: Domain name or empty string if invalid
    """
    try:
        parsed = urlparse(url if url.startswith(('http://', 'https://')) else f'http://{url}')
        return parsed.hostname or ''
    except:
        return ''


def is_localhost(target: str) -> bool:
    """
    Check if target is localhost or loopback address.
    
    Args:
        target: Target to check
        
    Returns:
        bool: True if localhost, False otherwise
    """
    localhost_patterns = [
        'localhost',
        '127.0.0.1',
        '::1',
        '0.0.0.0'
    ]
    
    target = target.lower().strip()
    
    # Check exact matches
    if target in localhost_patterns:
        return True
    
    # Check if it's an IP in loopback range
    try:
        ip = ipaddress.ip_address(target)
        return ip.is_loopback
    except ValueError:
        pass
    
    return False
