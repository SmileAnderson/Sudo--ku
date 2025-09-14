"""Data retention and cleanup utilities for compliance."""

import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
import logging

from app.database import get_db_session
from app.models import ScanRecord
from app.config import settings
from app.utils.encryption import encryption_service

logger = logging.getLogger(__name__)


class DataRetentionManager:
    """
    Manages data retention policies and automated cleanup for compliance.
    Implements GDPR, SOC2, and ISO 27001 requirements.
    """
    
    def __init__(self):
        self.retention_policies = settings.RETENTION_POLICIES
        self.last_cleanup = None
        
    def schedule_data_cleanup(self) -> None:
        """
        Schedule automated data cleanup based on retention policies.
        This should be called periodically (e.g., daily via cron).
        """
        logger.info("Starting scheduled data cleanup")
        
        try:
            with get_db_session() as db:
                cleanup_stats = {
                    "scan_results_deleted": 0,
                    "anonymized_records": 0,
                    "errors": 0
                }
                
                # Clean up scan results based on retention policy
                scan_results_deleted = self._cleanup_scan_results(db)
                cleanup_stats["scan_results_deleted"] = scan_results_deleted
                
                # Anonymize old customer data while keeping analytics
                anonymized_count = self._anonymize_old_data(db)
                cleanup_stats["anonymized_records"] = anonymized_count
                
                # Clean up logs (would be implemented for actual log files)
                # self._cleanup_logs()
                
                self.last_cleanup = datetime.utcnow()
                
                logger.info(f"Data cleanup completed: {cleanup_stats}")
                return cleanup_stats
                
        except Exception as e:
            logger.error(f"Data cleanup failed: {e}")
            raise RetentionError(f"Cleanup operation failed: {e}")
    
    def _cleanup_scan_results(self, db: Session) -> int:
        """
        Clean up old scan results based on retention policy.
        
        Args:
            db: Database session
            
        Returns:
            int: Number of records deleted
        """
        retention_days = self.retention_policies.get("scan_results", 90)
        cutoff_date = datetime.utcnow() - timedelta(days=retention_days)
        
        # Find old scan records
        old_scans = db.query(ScanRecord).filter(
            ScanRecord.created_at < cutoff_date
        ).all()
        
        deleted_count = 0
        
        for scan in old_scans:
            try:
                # Log the deletion for audit trail
                logger.info(f"Deleting scan record {scan.id} (created: {scan.created_at})")
                
                db.delete(scan)
                deleted_count += 1
                
            except Exception as e:
                logger.error(f"Failed to delete scan {scan.id}: {e}")
                continue
        
        if deleted_count > 0:
            db.commit()
            logger.info(f"Deleted {deleted_count} old scan records")
        
        return deleted_count
    
    def _anonymize_old_data(self, db: Session) -> int:
        """
        Anonymize old customer data while preserving analytics value.
        
        Args:
            db: Database session
            
        Returns:
            int: Number of records anonymized
        """
        # Anonymize data after 6 months but keep for analytics
        anonymize_after_days = 180
        cutoff_date = datetime.utcnow() - timedelta(days=anonymize_after_days)
        
        # Find scans that need anonymization (not already anonymized)
        scans_to_anonymize = db.query(ScanRecord).filter(
            and_(
                ScanRecord.created_at < cutoff_date,
                ScanRecord.client_ip.isnot(None),  # Not already anonymized
                ScanRecord.target.notlike('anonymous-%')  # Not already anonymized
            )
        ).all()
        
        anonymized_count = 0
        
        for scan in scans_to_anonymize:
            try:
                # Create anonymized version of scan data
                original_data = {
                    "target": scan.target,
                    "email": scan.email,
                    "client_ip": scan.client_ip,
                    "scan_results": scan.scan_results,
                    "problems": scan.problems,
                    "recommendations": scan.recommendations
                }
                
                anonymized_data = encryption_service.create_anonymized_data(original_data)
                
                # Update scan record with anonymized data
                scan.target = anonymized_data.get("target", f"anonymized-{scan.id}")
                scan.email = None  # Remove email completely
                scan.client_ip = None  # Remove IP completely
                scan.scan_results = anonymized_data.get("scan_results", {})
                
                # Keep problems and recommendations but anonymize targets in descriptions
                if scan.problems:
                    scan.problems = self._anonymize_problems(scan.problems, anonymized_data["target"])
                
                if scan.recommendations:
                    scan.recommendations = self._anonymize_recommendations(scan.recommendations, anonymized_data["target"])
                
                anonymized_count += 1
                
                logger.debug(f"Anonymized scan record {scan.id}")
                
            except Exception as e:
                logger.error(f"Failed to anonymize scan {scan.id}: {e}")
                continue
        
        if anonymized_count > 0:
            db.commit()
            logger.info(f"Anonymized {anonymized_count} scan records")
        
        return anonymized_count
    
    def _anonymize_problems(self, problems: List[Dict[str, Any]], anonymized_target: str) -> List[Dict[str, Any]]:
        """
        Anonymize problem descriptions while keeping analytical value.
        
        Args:
            problems: List of problems
            anonymized_target: Anonymized target name
            
        Returns:
            list: Anonymized problems
        """
        anonymized_problems = []
        
        for problem in problems:
            anonymized_problem = problem.copy()
            
            # Remove specific URLs or IPs from descriptions
            if "description" in anonymized_problem:
                desc = anonymized_problem["description"]
                # Replace URLs and IPs with anonymized target
                import re
                desc = re.sub(r'https?://[^\s]+', f'https://{anonymized_target}', desc)
                desc = re.sub(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', anonymized_target, desc)
                anonymized_problem["description"] = desc
            
            anonymized_problems.append(anonymized_problem)
        
        return anonymized_problems
    
    def _anonymize_recommendations(self, recommendations: List[Dict[str, Any]], anonymized_target: str) -> List[Dict[str, Any]]:
        """
        Anonymize recommendation steps while keeping analytical value.
        
        Args:
            recommendations: List of recommendations
            anonymized_target: Anonymized target name
            
        Returns:
            list: Anonymized recommendations
        """
        anonymized_recommendations = []
        
        for rec in recommendations:
            anonymized_rec = rec.copy()
            
            # Anonymize steps if they contain specific targets
            if "steps" in anonymized_rec:
                anonymized_steps = []
                for step in anonymized_rec["steps"]:
                    # Replace specific references with generic ones
                    anonymized_step = step.replace(anonymized_target, "[target]")
                    anonymized_steps.append(anonymized_step)
                anonymized_rec["steps"] = anonymized_steps
            
            anonymized_recommendations.append(anonymized_rec)
        
        return anonymized_recommendations
    
    def save_scan_data(self, scan_id: str, data: Dict[str, Any]) -> None:
        """
        Save scan data with encryption and apply retention policy metadata.
        
        Args:
            scan_id: Scan identifier
            data: Scan data to save
        """
        try:
            with get_db_session() as db:
                scan_record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
                
                if not scan_record:
                    logger.error(f"Scan record not found: {scan_id}")
                    return
                
                # Encrypt sensitive data if configured
                if settings.ENCRYPTION_KEY:
                    if data.get("scan_results"):
                        encrypted_results = encryption_service.encrypt_scan_data(data["scan_results"])
                        scan_record.scan_results = {"encrypted": encrypted_results}
                    else:
                        scan_record.scan_results = data.get("scan_results")
                else:
                    scan_record.scan_results = data.get("scan_results")
                
                # Store other data normally (not highly sensitive)
                scan_record.problems = data.get("problems", [])
                scan_record.recommendations = data.get("recommendations", [])
                scan_record.general_score = data.get("general_score")
                scan_record.summary = data.get("summary")
                
                db.commit()
                
                logger.info(f"Scan data saved for {scan_id}")
                
        except Exception as e:
            logger.error(f"Failed to save scan data for {scan_id}: {e}")
            raise RetentionError(f"Data save failed: {e}")
    
    def get_scan_data(self, scan_id: str) -> Dict[str, Any]:
        """
        Retrieve and decrypt scan data.
        
        Args:
            scan_id: Scan identifier
            
        Returns:
            dict: Decrypted scan data
        """
        try:
            with get_db_session() as db:
                scan_record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
                
                if not scan_record:
                    raise RetentionError(f"Scan record not found: {scan_id}")
                
                data = {
                    "scan_results": scan_record.scan_results,
                    "problems": scan_record.problems or [],
                    "recommendations": scan_record.recommendations or [],
                    "general_score": scan_record.general_score,
                    "summary": scan_record.summary
                }
                
                # Decrypt scan results if they're encrypted
                if (isinstance(data["scan_results"], dict) and 
                    "encrypted" in data["scan_results"]):
                    try:
                        encrypted_data = data["scan_results"]["encrypted"]
                        data["scan_results"] = encryption_service.decrypt_scan_data(encrypted_data)
                    except Exception as e:
                        logger.error(f"Failed to decrypt scan results for {scan_id}: {e}")
                        # Return empty results rather than failing completely
                        data["scan_results"] = {}
                
                return data
                
        except Exception as e:
            logger.error(f"Failed to retrieve scan data for {scan_id}: {e}")
            raise RetentionError(f"Data retrieval failed: {e}")
    
    def get_retention_status(self) -> Dict[str, Any]:
        """
        Get current retention policy status and statistics.
        
        Returns:
            dict: Retention status information
        """
        try:
            with get_db_session() as db:
                total_scans = db.query(ScanRecord).count()
                
                # Count scans by age
                now = datetime.utcnow()
                recent_scans = db.query(ScanRecord).filter(
                    ScanRecord.created_at > now - timedelta(days=30)
                ).count()
                
                old_scans = db.query(ScanRecord).filter(
                    ScanRecord.created_at < now - timedelta(days=self.retention_policies["scan_results"])
                ).count()
                
                anonymized_scans = db.query(ScanRecord).filter(
                    or_(
                        ScanRecord.target.like('anonymous-%'),
                        ScanRecord.client_ip.is_(None)
                    )
                ).count()
                
                return {
                    "total_scans": total_scans,
                    "recent_scans_30_days": recent_scans,
                    "scans_eligible_for_deletion": old_scans,
                    "anonymized_scans": anonymized_scans,
                    "last_cleanup": self.last_cleanup.isoformat() if self.last_cleanup else None,
                    "retention_policies": self.retention_policies
                }
                
        except Exception as e:
            logger.error(f"Failed to get retention status: {e}")
            return {"error": str(e)}


class RetentionError(Exception):
    """Exception raised for data retention errors."""
    pass


# Global retention manager instance
retention_manager = DataRetentionManager()
