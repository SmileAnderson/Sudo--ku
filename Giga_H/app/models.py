"""Database models for the cyber hygiene scanner."""

from datetime import datetime
from enum import Enum
from typing import Optional, Dict, Any
from uuid import uuid4

from sqlalchemy import Column, String, DateTime, Integer, Text, JSON, Boolean, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String as SQLString
from pydantic import BaseModel
import os

Base = declarative_base()


class ScanStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class ScanType(str, Enum):
    QUICK = "quick"
    FULL = "full"
    CUSTOM = "custom"


class Severity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


# Database Models
class ScanRecord(Base):
    __tablename__ = "scan_records"
    
    # Use String for SQLite compatibility, UUID for PostgreSQL
    DATABASE_URL = os.getenv("DATABASE_URL", "")
    if "sqlite" in DATABASE_URL.lower():
        id = Column(String(36), primary_key=True)
    else:
        id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    target = Column(String(255), nullable=False, index=True)
    scan_type = Column(String(20), nullable=False)
    status = Column(String(20), nullable=False, default=ScanStatus.QUEUED)
    email = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    general_score = Column(Integer, nullable=True)
    scan_results = Column(JSON, nullable=True)
    problems = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)
    summary = Column(JSON, nullable=True)
    error_message = Column(Text, nullable=True)
    client_ip = Column(String(45), nullable=True)


# Pydantic Models for API
class ScanRequest(BaseModel):
    target: str
    scan_type: ScanType = ScanType.FULL
    email: Optional[str] = None


class ScanResponse(BaseModel):
    scan_id: str
    status: ScanStatus
    estimated_duration: str
    results_url: str


class Problem(BaseModel):
    category: str
    issue: str
    severity: Severity
    description: str
    impact: str


class Recommendation(BaseModel):
    problem_id: str
    recommendation: str
    effort_estimate: str
    steps: list[str]


class ScanSummary(BaseModel):
    categories_scanned: int
    categories_completed: int
    categories_failed: int
    total_issues_found: int
    critical_issues: int
    high_issues: int
    medium_issues: int
    low_issues: int


class ScanResults(BaseModel):
    scan_id: str
    target: str
    status: ScanStatus
    timestamp: datetime
    general_score: Optional[int] = None
    problems: list[Problem] = []
    recommendations: list[Recommendation] = []
    summary: Optional[ScanSummary] = None
    results: Dict[str, Any] = {}


class CategoryResult(BaseModel):
    status: str
    note: Optional[str] = None
    data: Optional[Dict[str, Any]] = None


class InternetExposureResult(CategoryResult):
    open_ports: list[Dict[str, Any]] = []
    os_fingerprint: Optional[str] = None
    total_ports_scanned: int = 0
    scan_duration: Optional[str] = None


class TLSSecurityResult(CategoryResult):
    tls_versions: list[str] = []
    certificate: Optional[Dict[str, Any]] = None
    cipher_suites: list[str] = []
    hsts_enabled: bool = False
    hsts_max_age: Optional[int] = None


class WebSecurityResult(CategoryResult):
    https_redirect: bool = False
    security_headers: Dict[str, Any] = {}
    missing_headers: list[str] = []
    security_score: int = 0


class EmailAuthResult(CategoryResult):
    spf: Optional[Dict[str, Any]] = None
    dkim: Optional[Dict[str, Any]] = None
    dmarc: Optional[Dict[str, Any]] = None


class VulnerabilityResult(CategoryResult):
    vulnerabilities: list[Dict[str, Any]] = []
    risk_summary: Dict[str, int] = {}


class IAMAssessmentResult(CategoryResult):
    admin_interfaces: list[Dict[str, Any]] = []
    cloud_services: Dict[str, list] = {}
    recommendations: list[str] = []


class BackupDRResult(CategoryResult):
    exposed_backups: list[Dict[str, Any]] = []
    dr_sites: list[str] = []
    recommendations: list[str] = []


class SecurityMonitoringResult(CategoryResult):
    security_tools: list[str] = []
    rate_limiting: bool = False
    waf_detected: bool = False
    cdn_services: list[str] = []
