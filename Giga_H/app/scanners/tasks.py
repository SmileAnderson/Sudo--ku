"""Celery tasks for asynchronous scanning operations."""

import asyncio
import traceback
from datetime import datetime
from typing import Dict, List, Any
from celery import current_task

from app.celery_app import celery_app
from app.database import get_db_session
from app.models import ScanRecord, ScanStatus
from app.utils.logger import security_logger
from app.scanners.internet_exposure import InternetExposureScanner
from app.scanners.tls_security import TLSSecurityScanner
from app.scanners.web_security import WebSecurityScanner
from app.scanners.email_auth import EmailAuthScanner
from app.scanners.cve_vulnerabilities import CVEVulnerabilityScanner
from app.scanners.iam_assessment import IAMAssessmentScanner
from app.scanners.backup_dr import BackupDRScanner
from app.scanners.security_monitoring import SecurityMonitoringScanner
from app.scanners.scoring import ScoringEngine


@celery_app.task(bind=True, name="perform_scan")
def perform_scan(self, scan_id: str, target: str, scan_type: str):
    """
    Main task to perform comprehensive security scan.
    
    Args:
        scan_id: Unique scan identifier
        target: Target IP address or domain
        scan_type: Type of scan (quick, full, custom)
    """
    start_time = datetime.utcnow()
    
    try:
        # Update scan status to running
        with get_db_session() as db:
            scan_record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
            if not scan_record:
                raise Exception(f"Scan record not found: {scan_id}")
            
            scan_record.status = ScanStatus.RUNNING
            scan_record.started_at = start_time
            db.commit()
            
            client_ip = scan_record.client_ip
        
        # Log scan start
        security_logger.log_scan_start(target, client_ip, scan_id, scan_type)
        
        # Update task progress
        self.update_state(state='PROGRESS', meta={'current': 0, 'total': 8, 'status': 'Starting scan...'})
        
        # Run the actual scanning
        scan_results = run_comprehensive_scan(target, scan_type, self)
        
        # Calculate scoring and summary
        scoring_engine = ScoringEngine()
        score, problems, recommendations, summary = scoring_engine.calculate_score(scan_results)
        
        # Update scan record with results
        end_time = datetime.utcnow()
        duration = (end_time - start_time).total_seconds()
        
        with get_db_session() as db:
            scan_record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
            scan_record.status = ScanStatus.COMPLETED
            scan_record.completed_at = end_time
            scan_record.general_score = score
            scan_record.scan_results = scan_results
            scan_record.problems = problems
            scan_record.recommendations = recommendations
            scan_record.summary = summary
            db.commit()
        
        # Log successful completion
        security_logger.log_scan_complete(scan_id, target, duration, len(problems))
        
        # Log any vulnerabilities found
        for problem in problems:
            if problem.get('severity') in ['critical', 'high']:
                security_logger.log_vulnerability_found(scan_id, target, problem)
        
        return {
            'status': 'completed',
            'scan_id': scan_id,
            'duration': duration,
            'score': score,
            'issues_found': len(problems)
        }
        
    except Exception as e:
        # Handle scan failure
        error_message = str(e)
        traceback_str = traceback.format_exc()
        
        # Update scan record with error
        with get_db_session() as db:
            scan_record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
            if scan_record:
                scan_record.status = ScanStatus.FAILED
                scan_record.completed_at = datetime.utcnow()
                scan_record.error_message = error_message
                db.commit()
        
        # Log scan failure
        security_logger.log_scan_failed(scan_id, target, error_message)
        
        # Re-raise exception for Celery
        raise Exception(f"Scan failed: {error_message}")


def run_comprehensive_scan(target: str, scan_type: str, task=None) -> Dict[str, Any]:
    """
    Run comprehensive security scan across all categories.
    
    Args:
        target: Target to scan
        scan_type: Type of scan
        task: Celery task for progress updates
        
    Returns:
        dict: Complete scan results
    """
    results = {}
    
    # Define scan categories and their order
    scan_categories = [
        ("internet_exposure", InternetExposureScanner),
        ("tls_security", TLSSecurityScanner), 
        ("web_security", WebSecurityScanner),
        ("email_security", EmailAuthScanner),
        ("vulnerabilities", CVEVulnerabilityScanner),
        ("iam_assessment", IAMAssessmentScanner),
        ("backup_dr", BackupDRScanner),
        ("logging_monitoring", SecurityMonitoringScanner)
    ]
    
    total_categories = len(scan_categories)
    
    for i, (category, scanner_class) in enumerate(scan_categories):
        try:
            if task:
                task.update_state(
                    state='PROGRESS',
                    meta={
                        'current': i + 1,
                        'total': total_categories,
                        'status': f'Scanning {category.replace("_", " ").title()}...'
                    }
                )
            
            # Initialize and run scanner
            scanner = scanner_class(target, scan_type)
            category_result = scanner.scan()
            
            results[category] = category_result
            
        except Exception as e:
            # Handle individual category failures gracefully
            results[category] = {
                "status": "failed",
                "note": f"Scanning not possible: {str(e)}",
                "data": None
            }
    
    return results


# Individual scanner task wrappers for parallel execution (optional)
@celery_app.task(name="scan_internet_exposure")
def scan_internet_exposure(target: str, scan_type: str) -> Dict[str, Any]:
    """Internet exposure scanning task."""
    scanner = InternetExposureScanner(target, scan_type)
    return scanner.scan()


@celery_app.task(name="scan_tls_security")
def scan_tls_security(target: str, scan_type: str) -> Dict[str, Any]:
    """TLS security scanning task."""
    scanner = TLSSecurityScanner(target, scan_type)
    return scanner.scan()


@celery_app.task(name="scan_web_security")
def scan_web_security(target: str, scan_type: str) -> Dict[str, Any]:
    """Web security scanning task."""
    scanner = WebSecurityScanner(target, scan_type)
    return scanner.scan()


@celery_app.task(name="scan_email_auth")
def scan_email_auth(target: str, scan_type: str) -> Dict[str, Any]:
    """Email authentication scanning task."""
    scanner = EmailAuthScanner(target, scan_type)
    return scanner.scan()


@celery_app.task(name="scan_vulnerabilities")
def scan_vulnerabilities(target: str, scan_type: str) -> Dict[str, Any]:
    """Vulnerability scanning task."""
    scanner = CVEVulnerabilityScanner(target, scan_type)
    return scanner.scan()


@celery_app.task(name="scan_iam_assessment")
def scan_iam_assessment(target: str, scan_type: str) -> Dict[str, Any]:
    """IAM assessment scanning task."""
    scanner = IAMAssessmentScanner(target, scan_type)
    return scanner.scan()


@celery_app.task(name="scan_backup_dr")
def scan_backup_dr(target: str, scan_type: str) -> Dict[str, Any]:
    """Backup and DR scanning task."""
    scanner = BackupDRScanner(target, scan_type)
    return scanner.scan()


@celery_app.task(name="scan_security_monitoring")
def scan_security_monitoring(target: str, scan_type: str) -> Dict[str, Any]:
    """Security monitoring scanning task."""
    scanner = SecurityMonitoringScanner(target, scan_type)
    return scanner.scan()
