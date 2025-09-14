"""Logging configuration and security logger implementation."""

import logging
import json
import os
from datetime import datetime
from logging.handlers import RotatingFileHandler
from app.config import settings


def setup_logging():
    """Configure application logging with rotation for cost efficiency."""
    # Create logs directory if it doesn't exist
    os.makedirs(settings.LOG_DIR, exist_ok=True)
    
    # Configure root logger
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL),
        format=settings.LOG_FORMAT,
        handlers=[
            logging.StreamHandler(),  # Console output
            RotatingFileHandler(
                os.path.join(settings.LOG_DIR, "app.log"),
                maxBytes=10*1024*1024,  # 10MB
                backupCount=5
            )
        ]
    )


class SecurityLogger:
    """Security-focused logger for audit trails and monitoring."""
    
    def __init__(self):
        self.logger = logging.getLogger('security_scanner')
        
        # Create security log file handler
        security_handler = RotatingFileHandler(
            os.path.join(settings.LOG_DIR, "security.log"),
            maxBytes=50*1024*1024,  # 50MB
            backupCount=10
        )
        
        security_handler.setFormatter(
            logging.Formatter('%(asctime)s - SECURITY - %(levelname)s - %(message)s')
        )
        
        self.logger.addHandler(security_handler)
        self.logger.setLevel(logging.INFO)
    
    def log_scan_start(self, target: str, client_ip: str, scan_id: str, scan_type: str):
        """Log when a scan starts."""
        self.logger.info(json.dumps({
            'event': 'scan_started',
            'scan_id': scan_id,
            'target': target,
            'client_ip': client_ip,
            'scan_type': scan_type,
            'timestamp': datetime.utcnow().isoformat()
        }))
    
    def log_scan_complete(self, scan_id: str, target: str, duration: float, issues_found: int):
        """Log when a scan completes."""
        self.logger.info(json.dumps({
            'event': 'scan_completed',
            'scan_id': scan_id,
            'target': target,
            'duration_seconds': duration,
            'issues_found': issues_found,
            'timestamp': datetime.utcnow().isoformat()
        }))
    
    def log_scan_failed(self, scan_id: str, target: str, error: str):
        """Log when a scan fails."""
        self.logger.error(json.dumps({
            'event': 'scan_failed',
            'scan_id': scan_id,
            'target': target,
            'error': error,
            'timestamp': datetime.utcnow().isoformat()
        }))
    
    def log_vulnerability_found(self, scan_id: str, target: str, vulnerability: dict):
        """Log when a vulnerability is detected."""
        self.logger.warning(json.dumps({
            'event': 'vulnerability_detected',
            'scan_id': scan_id,
            'target': target,
            'cve': vulnerability.get('cve_id'),
            'severity': vulnerability.get('severity'),
            'service': vulnerability.get('service'),
            'timestamp': datetime.utcnow().isoformat()
        }))
    
    def log_rate_limit_exceeded(self, client_ip: str, endpoint: str):
        """Log rate limiting events."""
        self.logger.warning(json.dumps({
            'event': 'rate_limit_exceeded',
            'client_ip': client_ip,
            'endpoint': endpoint,
            'timestamp': datetime.utcnow().isoformat()
        }))
    
    def log_security_incident(self, incident_type: str, details: dict):
        """Log security incidents."""
        self.logger.critical(json.dumps({
            'event': 'security_incident',
            'incident_type': incident_type,
            'details': details,
            'timestamp': datetime.utcnow().isoformat()
        }))


# Global security logger instance
security_logger = SecurityLogger()
