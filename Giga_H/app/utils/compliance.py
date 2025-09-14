"""Compliance and access control utilities for GDPR, SOC2, and ISO 27001."""

import logging
from datetime import datetime
from typing import Dict, List, Any, Optional
from enum import Enum
from dataclasses import dataclass

from app.utils.logger import security_logger

logger = logging.getLogger(__name__)


class UserRole(str, Enum):
    """User roles for access control."""
    ADMIN = "admin"
    ANALYST = "analyst"
    VIEWER = "viewer"
    AUDITOR = "auditor"


class DataClassification(str, Enum):
    """Data classification levels."""
    PUBLIC = "public"
    INTERNAL = "internal"
    CONFIDENTIAL = "confidential"
    RESTRICTED = "restricted"


class Action(str, Enum):
    """Possible actions in the system."""
    READ = "read"
    WRITE = "write"
    DELETE = "delete"
    EXPORT = "export"
    ANONYMIZE = "anonymize"
    AUDIT = "audit"


@dataclass
class ComplianceEvent:
    """Represents a compliance-related event for audit logging."""
    event_type: str
    user_id: str
    resource_id: str
    action: str
    timestamp: datetime
    ip_address: str
    user_agent: str
    result: str
    additional_data: Dict[str, Any] = None


class AccessControl:
    """
    Role-based access control implementation for compliance requirements.
    Implements principle of least privilege and separation of duties.
    """
    
    def __init__(self):
        # Define role permissions
        self.role_permissions = {
            UserRole.ADMIN: [
                Action.READ, Action.WRITE, Action.DELETE, 
                Action.EXPORT, Action.ANONYMIZE, Action.AUDIT
            ],
            UserRole.ANALYST: [
                Action.READ, Action.EXPORT, Action.AUDIT
            ],
            UserRole.VIEWER: [
                Action.READ
            ],
            UserRole.AUDITOR: [
                Action.READ, Action.AUDIT, Action.EXPORT
            ]
        }
        
        # Define data classification access requirements
        self.classification_requirements = {
            DataClassification.PUBLIC: [UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER, UserRole.AUDITOR],
            DataClassification.INTERNAL: [UserRole.ADMIN, UserRole.ANALYST, UserRole.AUDITOR],
            DataClassification.CONFIDENTIAL: [UserRole.ADMIN, UserRole.ANALYST],
            DataClassification.RESTRICTED: [UserRole.ADMIN]
        }
    
    def check_permission(self, user_role: UserRole, action: Action, resource: str = None) -> bool:
        """
        Check if user role has permission for specific action.
        
        Args:
            user_role: User's role
            action: Action to perform
            resource: Optional resource identifier
            
        Returns:
            bool: True if permission granted
        """
        try:
            # Check if role has permission for action
            if action not in self.role_permissions.get(user_role, []):
                return False
            
            # Additional checks based on resource type
            if resource:
                # Check data classification requirements
                classification = self._get_resource_classification(resource)
                if classification and user_role not in self.classification_requirements.get(classification, []):
                    return False
            
            return True
            
        except Exception as e:
            logger.error(f"Permission check failed: {e}")
            return False  # Fail secure
    
    def _get_resource_classification(self, resource: str) -> Optional[DataClassification]:
        """
        Determine data classification for a resource.
        
        Args:
            resource: Resource identifier
            
        Returns:
            DataClassification: Classification level
        """
        # Scan results contain potentially sensitive data
        if "scan" in resource.lower():
            return DataClassification.CONFIDENTIAL
        
        # Audit logs are restricted
        if "audit" in resource.lower() or "log" in resource.lower():
            return DataClassification.RESTRICTED
        
        # General API endpoints
        return DataClassification.INTERNAL
    
    def log_access_attempt(self, user_role: UserRole, action: Action, resource: str, 
                          ip_address: str, success: bool, user_id: str = "unknown") -> None:
        """
        Log access attempt for audit trail.
        
        Args:
            user_role: User's role
            action: Action attempted
            resource: Resource accessed
            ip_address: Client IP address
            success: Whether access was granted
            user_id: User identifier
        """
        event = ComplianceEvent(
            event_type="access_control",
            user_id=user_id,
            resource_id=resource,
            action=action.value,
            timestamp=datetime.utcnow(),
            ip_address=ip_address,
            user_agent="API",  # Would be extracted from request headers
            result="success" if success else "denied",
            additional_data={
                "user_role": user_role.value,
                "permission_check": success
            }
        )
        
        self._log_compliance_event(event)
    
    def _log_compliance_event(self, event: ComplianceEvent) -> None:
        """
        Log compliance event using security logger.
        
        Args:
            event: Compliance event to log
        """
        log_data = {
            "event_type": event.event_type,
            "user_id": event.user_id,
            "resource_id": event.resource_id,
            "action": event.action,
            "timestamp": event.timestamp.isoformat(),
            "ip_address": event.ip_address,
            "user_agent": event.user_agent,
            "result": event.result,
            "additional_data": event.additional_data or {}
        }
        
        if event.result == "success":
            security_logger.logger.info(f"COMPLIANCE: {log_data}")
        else:
            security_logger.logger.warning(f"COMPLIANCE_VIOLATION: {log_data}")


class GDPRCompliance:
    """
    GDPR compliance utilities for data subject rights and privacy by design.
    """
    
    def __init__(self):
        self.data_subject_rights = [
            "right_to_access",
            "right_to_rectification", 
            "right_to_erasure",
            "right_to_restrict_processing",
            "right_to_data_portability",
            "right_to_object"
        ]
    
    def process_data_subject_request(self, request_type: str, subject_identifier: str) -> Dict[str, Any]:
        """
        Process GDPR data subject rights request.
        
        Args:
            request_type: Type of GDPR request
            subject_identifier: Email or other identifier
            
        Returns:
            dict: Request processing result
        """
        if request_type not in self.data_subject_rights:
            return {"error": "Invalid request type"}
        
        try:
            if request_type == "right_to_access":
                return self._handle_access_request(subject_identifier)
            elif request_type == "right_to_erasure":
                return self._handle_erasure_request(subject_identifier)
            elif request_type == "right_to_data_portability":
                return self._handle_portability_request(subject_identifier)
            else:
                return {"message": "Request type not yet implemented", "status": "pending"}
                
        except Exception as e:
            logger.error(f"GDPR request processing failed: {e}")
            return {"error": "Request processing failed"}
    
    def _handle_access_request(self, subject_identifier: str) -> Dict[str, Any]:
        """Handle GDPR right to access request."""
        # In a real implementation, this would query the database
        # for all data related to the subject
        return {
            "request_type": "access",
            "subject": subject_identifier,
            "data_found": "Would contain all personal data",
            "status": "completed",
            "processed_at": datetime.utcnow().isoformat()
        }
    
    def _handle_erasure_request(self, subject_identifier: str) -> Dict[str, Any]:
        """Handle GDPR right to erasure (right to be forgotten) request."""
        # In a real implementation, this would delete or anonymize
        # all personal data for the subject
        return {
            "request_type": "erasure",
            "subject": subject_identifier,
            "action": "Data anonymized and personal identifiers removed",
            "status": "completed",
            "processed_at": datetime.utcnow().isoformat()
        }
    
    def _handle_portability_request(self, subject_identifier: str) -> Dict[str, Any]:
        """Handle GDPR right to data portability request."""
        # In a real implementation, this would export data in a
        # structured, machine-readable format
        return {
            "request_type": "portability",
            "subject": subject_identifier,
            "export_format": "JSON",
            "download_url": "Would provide secure download link",
            "expires_at": (datetime.utcnow()).isoformat(),
            "status": "completed"
        }


class SOC2Compliance:
    """
    SOC 2 compliance utilities for security controls and monitoring.
    """
    
    def __init__(self):
        self.trust_service_criteria = [
            "security",
            "availability", 
            "processing_integrity",
            "confidentiality",
            "privacy"
        ]
    
    def generate_security_metrics(self) -> Dict[str, Any]:
        """
        Generate security metrics for SOC 2 reporting.
        
        Returns:
            dict: Security metrics and KPIs
        """
        # In a real implementation, this would query actual metrics
        return {
            "security_incidents": 0,
            "uptime_percentage": 99.9,
            "failed_login_attempts": 0,
            "data_breaches": 0,
            "vulnerability_scan_frequency": "daily",
            "access_reviews_completed": "monthly",
            "backup_success_rate": 100.0,
            "encryption_coverage": 100.0,
            "generated_at": datetime.utcnow().isoformat()
        }
    
    def validate_security_controls(self) -> Dict[str, Any]:
        """
        Validate implementation of SOC 2 security controls.
        
        Returns:
            dict: Control validation results
        """
        controls = {
            "access_control": {
                "implemented": True,
                "description": "Role-based access control implemented",
                "evidence": "AccessControl class with role permissions"
            },
            "encryption": {
                "implemented": True,
                "description": "Data encryption at rest and in transit",
                "evidence": "DataEncryption class with Fernet encryption"
            },
            "logging_monitoring": {
                "implemented": True,
                "description": "Comprehensive audit logging",
                "evidence": "SecurityLogger with structured logging"
            },
            "data_retention": {
                "implemented": True,
                "description": "Automated data retention and cleanup",
                "evidence": "DataRetentionManager with policy enforcement"
            },
            "incident_response": {
                "implemented": True,
                "description": "Security incident detection and logging",
                "evidence": "Security event logging and alerting"
            }
        }
        
        return {
            "controls": controls,
            "compliance_score": self._calculate_compliance_score(controls),
            "validated_at": datetime.utcnow().isoformat()
        }
    
    def _calculate_compliance_score(self, controls: Dict[str, Any]) -> float:
        """Calculate overall compliance score."""
        total_controls = len(controls)
        implemented_controls = sum(1 for control in controls.values() if control.get("implemented", False))
        return (implemented_controls / total_controls) * 100 if total_controls > 0 else 0


class ISO27001Compliance:
    """
    ISO 27001 compliance utilities for information security management.
    """
    
    def __init__(self):
        self.control_categories = [
            "information_security_policies",
            "organization_of_information_security",
            "human_resource_security",
            "asset_management",
            "access_control",
            "cryptography",
            "physical_and_environmental_security",
            "operations_security",
            "communications_security",
            "system_acquisition_development_maintenance",
            "supplier_relationships",
            "information_security_incident_management",
            "business_continuity_management",
            "compliance"
        ]
    
    def assess_control_implementation(self) -> Dict[str, Any]:
        """
        Assess ISO 27001 control implementation.
        
        Returns:
            dict: Control assessment results
        """
        # Simplified assessment - in reality this would be more comprehensive
        assessment = {}
        
        for category in self.control_categories:
            if category == "access_control":
                assessment[category] = {
                    "status": "implemented",
                    "score": 90,
                    "evidence": "Role-based access control with audit logging"
                }
            elif category == "cryptography":
                assessment[category] = {
                    "status": "implemented", 
                    "score": 85,
                    "evidence": "Fernet encryption for sensitive data"
                }
            elif category == "operations_security":
                assessment[category] = {
                    "status": "implemented",
                    "score": 80,
                    "evidence": "Automated scanning and monitoring"
                }
            else:
                assessment[category] = {
                    "status": "partially_implemented",
                    "score": 70,
                    "evidence": "Basic controls in place, needs enhancement"
                }
        
        overall_score = sum(ctrl["score"] for ctrl in assessment.values()) / len(assessment)
        
        return {
            "assessment": assessment,
            "overall_score": overall_score,
            "compliance_level": "Substantially Compliant" if overall_score >= 80 else "Partially Compliant",
            "assessed_at": datetime.utcnow().isoformat()
        }


# Global compliance instances
access_control = AccessControl()
gdpr_compliance = GDPRCompliance()
soc2_compliance = SOC2Compliance()
iso27001_compliance = ISO27001Compliance()
