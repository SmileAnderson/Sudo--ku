"""Data encryption utilities for compliance and security."""

import os
import json
import base64
from typing import Dict, Any, Optional
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import logging

from app.config import settings

logger = logging.getLogger(__name__)


class DataEncryption:
    """
    Data encryption service for sensitive scan data and compliance.
    Uses Fernet symmetric encryption for efficient data protection.
    """
    
    def __init__(self, encryption_key: Optional[str] = None):
        """
        Initialize encryption service.
        
        Args:
            encryption_key: Base64 encoded encryption key, or None to generate
        """
        if encryption_key:
            self.key = encryption_key.encode()
        else:
            # Generate key from environment or create new one
            self.key = self._get_or_generate_key()
        
        self.cipher_suite = Fernet(self.key)
    
    def _get_or_generate_key(self) -> bytes:
        """
        Get encryption key from environment or generate new one.
        
        Returns:
            bytes: Encryption key
        """
        env_key = settings.ENCRYPTION_KEY
        
        if env_key:
            try:
                # Verify key format
                Fernet(env_key.encode())
                return env_key.encode()
            except Exception as e:
                logger.warning(f"Invalid encryption key in environment: {e}")
        
        # Generate new key
        logger.info("Generating new encryption key")
        new_key = Fernet.generate_key()
        
        # Log warning about key persistence
        logger.warning(
            "New encryption key generated. For production, store this key securely: "
            f"{new_key.decode()}"
        )
        
        return new_key
    
    def encrypt_scan_data(self, data: Dict[str, Any]) -> str:
        """
        Encrypt scan data for storage.
        
        Args:
            data: Scan data to encrypt
            
        Returns:
            str: Base64 encoded encrypted data
        """
        try:
            # Convert to JSON and encrypt
            json_data = json.dumps(data, default=str)
            encrypted_data = self.cipher_suite.encrypt(json_data.encode())
            
            # Return base64 encoded for database storage
            return base64.b64encode(encrypted_data).decode()
            
        except Exception as e:
            logger.error(f"Failed to encrypt scan data: {e}")
            raise EncryptionError(f"Encryption failed: {e}")
    
    def decrypt_scan_data(self, encrypted_data: str) -> Dict[str, Any]:
        """
        Decrypt scan data from storage.
        
        Args:
            encrypted_data: Base64 encoded encrypted data
            
        Returns:
            dict: Decrypted scan data
        """
        try:
            # Decode base64 and decrypt
            encrypted_bytes = base64.b64decode(encrypted_data.encode())
            decrypted_data = self.cipher_suite.decrypt(encrypted_bytes)
            
            # Parse JSON
            return json.loads(decrypted_data.decode())
            
        except Exception as e:
            logger.error(f"Failed to decrypt scan data: {e}")
            raise DecryptionError(f"Decryption failed: {e}")
    
    def encrypt_field(self, value: str) -> str:
        """
        Encrypt individual field value.
        
        Args:
            value: Value to encrypt
            
        Returns:
            str: Base64 encoded encrypted value
        """
        try:
            encrypted_data = self.cipher_suite.encrypt(value.encode())
            return base64.b64encode(encrypted_data).decode()
        except Exception as e:
            logger.error(f"Failed to encrypt field: {e}")
            raise EncryptionError(f"Field encryption failed: {e}")
    
    def decrypt_field(self, encrypted_value: str) -> str:
        """
        Decrypt individual field value.
        
        Args:
            encrypted_value: Base64 encoded encrypted value
            
        Returns:
            str: Decrypted value
        """
        try:
            encrypted_bytes = base64.b64decode(encrypted_value.encode())
            decrypted_data = self.cipher_suite.decrypt(encrypted_bytes)
            return decrypted_data.decode()
        except Exception as e:
            logger.error(f"Failed to decrypt field: {e}")
            raise DecryptionError(f"Field decryption failed: {e}")
    
    def generate_data_hash(self, data: str) -> str:
        """
        Generate SHA-256 hash for data integrity verification.
        
        Args:
            data: Data to hash
            
        Returns:
            str: Hex encoded hash
        """
        digest = hashes.Hash(hashes.SHA256())
        digest.update(data.encode())
        return digest.finalize().hex()
    
    def create_anonymized_data(self, scan_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create anonymized version of scan data for analytics.
        
        Args:
            scan_data: Original scan data
            
        Returns:
            dict: Anonymized scan data
        """
        anonymized = scan_data.copy()
        
        # Remove or hash personally identifiable information
        fields_to_anonymize = [
            "target", "email", "client_ip"
        ]
        
        for field in fields_to_anonymize:
            if field in anonymized:
                if field == "target":
                    # Keep domain structure but anonymize
                    anonymized[field] = self._anonymize_target(anonymized[field])
                elif field in ["email", "client_ip"]:
                    # Hash these fields
                    anonymized[field] = self.generate_data_hash(str(anonymized[field]))[:16]
        
        # Remove scan results that might contain sensitive data
        if "scan_results" in anonymized:
            anonymized["scan_results"] = self._anonymize_scan_results(anonymized["scan_results"])
        
        return anonymized
    
    def _anonymize_target(self, target: str) -> str:
        """
        Anonymize target while preserving useful structure.
        
        Args:
            target: Original target
            
        Returns:
            str: Anonymized target
        """
        # Hash the target but keep domain structure
        if "." in target:
            parts = target.split(".")
            if len(parts) >= 2:
                # Keep TLD, hash the rest
                domain_hash = self.generate_data_hash(target)[:8]
                return f"anonymous-{domain_hash}.{parts[-1]}"
        
        # For IPs or single words, just return a hash
        return f"target-{self.generate_data_hash(target)[:8]}"
    
    def _anonymize_scan_results(self, scan_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Anonymize scan results to remove sensitive details.
        
        Args:
            scan_results: Original scan results
            
        Returns:
            dict: Anonymized scan results
        """
        anonymized_results = {}
        
        for category, result in scan_results.items():
            if isinstance(result, dict):
                # Keep status and general statistics
                anonymized_result = {
                    "status": result.get("status", "unknown"),
                    "scan_duration": result.get("scan_duration"),
                    "issues_found": len(result.get("vulnerabilities", [])) if "vulnerabilities" in result else 0
                }
                
                # Add category-specific anonymized data
                if category == "vulnerabilities":
                    # Keep vulnerability types and severities but remove specifics
                    vulns = result.get("vulnerabilities", [])
                    anonymized_result["vulnerability_types"] = [
                        {"severity": v.get("severity"), "type": v.get("type", "unknown")}
                        for v in vulns
                    ]
                
                anonymized_results[category] = anonymized_result
        
        return anonymized_results


class EncryptionError(Exception):
    """Exception raised for encryption errors."""
    pass


class DecryptionError(Exception):
    """Exception raised for decryption errors."""
    pass


# Global encryption instance
encryption_service = DataEncryption()
