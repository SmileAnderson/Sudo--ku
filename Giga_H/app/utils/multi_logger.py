"""
Comprehensive Multi-Logger System for Cyber Hygiene Scanner
==========================================================

This module provides multiple specialized loggers for different aspects
of the cybersecurity scanning system.
"""

import logging
import json
import os
from datetime import datetime
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import Dict, Any

from app.config import settings


class MultiLoggerSystem:
    """
    Comprehensive logging system with multiple specialized loggers
    for different aspects of the cybersecurity scanner.
    """
    
    def __init__(self):
        self.log_dir = Path(settings.LOG_DIR)
        self.log_dir.mkdir(exist_ok=True)
        
        # Initialize all loggers
        self.security_logger = self._setup_security_logger()
        self.application_logger = self._setup_application_logger()
        self.scan_logger = self._setup_scan_logger()
        self.api_logger = self._setup_api_logger()
        self.audit_logger = self._setup_audit_logger()
        self.performance_logger = self._setup_performance_logger()
        self.error_logger = self._setup_error_logger()
    
    def _create_rotating_handler(self, filename: str, max_bytes: int = 10*1024*1024, backup_count: int = 5):
        """Create a rotating file handler."""
        return RotatingFileHandler(
            self.log_dir / filename,
            maxBytes=max_bytes,
            backupCount=backup_count
        )
    
    def _setup_security_logger(self):
        """Security events, access control, authentication."""
        logger = logging.getLogger('security')
        logger.setLevel(logging.INFO)
        
        handler = self._create_rotating_handler('security.log', 50*1024*1024, 10)
        handler.setFormatter(logging.Formatter(
            '%(asctime)s | SECURITY | %(levelname)s | %(message)s'
        ))
        
        logger.addHandler(handler)
        return logger
    
    def _setup_application_logger(self):
        """General application operations, startup, shutdown."""
        logger = logging.getLogger('application')
        logger.setLevel(logging.INFO)
        
        handler = self._create_rotating_handler('application.log')
        handler.setFormatter(logging.Formatter(
            '%(asctime)s | APP | %(levelname)s | %(message)s'
        ))
        
        logger.addHandler(handler)
        return logger
    
    def _setup_scan_logger(self):
        """Detailed scanning activities and results."""
        logger = logging.getLogger('scan')
        logger.setLevel(logging.DEBUG)
        
        handler = self._create_rotating_handler('scan.log', 100*1024*1024, 20)
        handler.setFormatter(logging.Formatter(
            '%(asctime)s | SCAN | %(levelname)s | %(message)s'
        ))
        
        logger.addHandler(handler)
        return logger
    
    def _setup_api_logger(self):
        """HTTP requests, responses, API usage."""
        logger = logging.getLogger('api')
        logger.setLevel(logging.INFO)
        
        handler = self._create_rotating_handler('api.log', 30*1024*1024, 15)
        handler.setFormatter(logging.Formatter(
            '%(asctime)s | API | %(levelname)s | %(message)s'
        ))
        
        logger.addHandler(handler)
        return logger
    
    def _setup_audit_logger(self):
        """Compliance, user actions, data access."""
        logger = logging.getLogger('audit')
        logger.setLevel(logging.INFO)
        
        handler = self._create_rotating_handler('audit.log', 50*1024*1024, 10)
        handler.setFormatter(logging.Formatter(
            '%(asctime)s | AUDIT | %(levelname)s | %(message)s'
        ))
        
        logger.addHandler(handler)
        return logger
    
    def _setup_performance_logger(self):
        """System metrics, timing, resource usage."""
        logger = logging.getLogger('performance')
        logger.setLevel(logging.INFO)
        
        handler = self._create_rotating_handler('performance.log')
        handler.setFormatter(logging.Formatter(
            '%(asctime)s | PERF | %(levelname)s | %(message)s'
        ))
        
        logger.addHandler(handler)
        return logger
    
    def _setup_error_logger(self):
        """Errors, exceptions, failures."""
        logger = logging.getLogger('error')
        logger.setLevel(logging.ERROR)
        
        handler = self._create_rotating_handler('error.log', 20*1024*1024, 10)
        handler.setFormatter(logging.Formatter(
            '%(asctime)s | ERROR | %(levelname)s | %(message)s | %(pathname)s:%(lineno)d'
        ))
        
        logger.addHandler(handler)
        return logger
    
    # Security Logging Methods
    def log_security_event(self, event_type: str, details: Dict[str, Any]):
        """Log security-related events."""
        log_entry = {
            'event': event_type,
            'timestamp': datetime.utcnow().isoformat(),
            'details': details
        }
        self.security_logger.info(json.dumps(log_entry))
    
    def log_scan_started(self, target: str, scan_id: str, client_ip: str, scan_type: str):
        """Log when a scan starts."""
        self.log_security_event('scan_started', {
            'scan_id': scan_id,
            'target': target,
            'client_ip': client_ip,
            'scan_type': scan_type
        })
    
    def log_scan_completed(self, scan_id: str, target: str, duration: float, issues_found: int):
        """Log when a scan completes."""
        self.log_security_event('scan_completed', {
            'scan_id': scan_id,
            'target': target,
            'duration_seconds': duration,
            'issues_found': issues_found
        })
    
    def log_vulnerability_detected(self, scan_id: str, target: str, vulnerability: Dict[str, Any]):
        """Log vulnerability detection."""
        self.log_security_event('vulnerability_detected', {
            'scan_id': scan_id,
            'target': target,
            'vulnerability': vulnerability
        })
    
    # Application Logging Methods
    def log_app_startup(self, version: str, config: Dict[str, Any]):
        """Log application startup."""
        log_entry = {
            'event': 'app_startup',
            'version': version,
            'config': config,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.application_logger.info(json.dumps(log_entry))
    
    def log_app_shutdown(self, reason: str = "normal"):
        """Log application shutdown."""
        log_entry = {
            'event': 'app_shutdown',
            'reason': reason,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.application_logger.info(json.dumps(log_entry))
    
    def log_component_status(self, component: str, status: str, details: str = ""):
        """Log component status changes."""
        log_entry = {
            'event': 'component_status',
            'component': component,
            'status': status,
            'details': details,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.application_logger.info(json.dumps(log_entry))
    
    # Scan Logging Methods
    def log_scan_detail(self, scan_id: str, scanner: str, target: str, action: str, result: Any):
        """Log detailed scan activities."""
        log_entry = {
            'scan_id': scan_id,
            'scanner': scanner,
            'target': target,
            'action': action,
            'result': result,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.scan_logger.debug(json.dumps(log_entry))
    
    def log_port_scan_result(self, scan_id: str, target: str, port: int, service: str, status: str):
        """Log port scan results."""
        log_entry = {
            'scan_id': scan_id,
            'target': target,
            'port': port,
            'service': service,
            'status': status,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.scan_logger.info(json.dumps(log_entry))
    
    # API Logging Methods
    def log_api_request(self, method: str, endpoint: str, client_ip: str, user_agent: str, status_code: int = None):
        """Log API requests."""
        log_entry = {
            'method': method,
            'endpoint': endpoint,
            'client_ip': client_ip,
            'user_agent': user_agent,
            'status_code': status_code,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.api_logger.info(json.dumps(log_entry))
    
    def log_rate_limit_hit(self, client_ip: str, endpoint: str, limit: int):
        """Log rate limiting events."""
        log_entry = {
            'event': 'rate_limit_exceeded',
            'client_ip': client_ip,
            'endpoint': endpoint,
            'limit': limit,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.api_logger.warning(json.dumps(log_entry))
    
    # Audit Logging Methods
    def log_data_access(self, user_id: str, action: str, resource: str, client_ip: str):
        """Log data access for compliance."""
        log_entry = {
            'event': 'data_access',
            'user_id': user_id,
            'action': action,
            'resource': resource,
            'client_ip': client_ip,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.audit_logger.info(json.dumps(log_entry))
    
    def log_configuration_change(self, user_id: str, setting: str, old_value: str, new_value: str):
        """Log configuration changes."""
        log_entry = {
            'event': 'config_change',
            'user_id': user_id,
            'setting': setting,
            'old_value': old_value,
            'new_value': new_value,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.audit_logger.warning(json.dumps(log_entry))
    
    # Performance Logging Methods
    def log_performance_metric(self, metric_name: str, value: float, unit: str = ""):
        """Log performance metrics."""
        log_entry = {
            'metric': metric_name,
            'value': value,
            'unit': unit,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.performance_logger.info(json.dumps(log_entry))
    
    def log_scan_timing(self, scan_id: str, scanner: str, duration: float):
        """Log scan timing information."""
        log_entry = {
            'scan_id': scan_id,
            'scanner': scanner,
            'duration_seconds': duration,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.performance_logger.info(json.dumps(log_entry))
    
    # Error Logging Methods
    def log_error(self, error_type: str, message: str, details: Dict[str, Any] = None):
        """Log errors and exceptions."""
        log_entry = {
            'error_type': error_type,
            'message': message,
            'details': details or {},
            'timestamp': datetime.utcnow().isoformat()
        }
        self.error_logger.error(json.dumps(log_entry))
    
    def log_scan_error(self, scan_id: str, scanner: str, target: str, error: str):
        """Log scan-specific errors."""
        self.log_error('scan_error', f"Scanner {scanner} failed for target {target}", {
            'scan_id': scan_id,
            'scanner': scanner,
            'target': target,
            'error': error
        })


# Global multi-logger instance
multi_logger = MultiLoggerSystem()
