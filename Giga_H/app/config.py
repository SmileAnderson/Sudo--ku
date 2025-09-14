"""Configuration settings for the cyber hygiene scanner."""

import os
from typing import Dict, Any


class Settings:
    """Application settings and configuration."""
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Cyber Hygiene Scanner"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Comprehensive cybersecurity scanning service"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8001"))
    
    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./demo_scanner.db")
    
    # Redis Configuration
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Celery Configuration
    CELERY_BROKER_URL: str = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
    
    # Scanning Configuration
    MAX_SCANS_PER_HOUR: int = int(os.getenv("MAX_SCANS_PER_HOUR", "10"))
    MAX_CONCURRENT_SCANS: int = int(os.getenv("MAX_CONCURRENT_SCANS", "3"))
    DEFAULT_SCAN_TIMEOUT: int = int(os.getenv("DEFAULT_SCAN_TIMEOUT", "600"))  # 10 minutes
    
    # Security Configuration
    ENCRYPTION_KEY: str = os.getenv("ENCRYPTION_KEY", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
    RATE_LIMIT_WINDOW: int = int(os.getenv("RATE_LIMIT_WINDOW", "3600"))  # 1 hour
    
    # Data Retention (in days)
    RETENTION_POLICIES: Dict[str, int] = {
        'scan_results': 90,
        'customer_data': 1095,  # 3 years
        'vulnerability_data': 180,  # 6 months
        'logs': 365  # 1 year
    }
    
    # CVE Database Configuration
    NVD_API_URL: str = "https://services.nvd.nist.gov/rest/json/cves/2.0"
    CVE_CACHE_TTL: int = 3600 * 24  # 24 hours
    
    # Scanning Ports Configuration
    COMMON_PORTS: list = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3389, 8080, 8443]
    FULL_SCAN_PORTS: list = list(range(1, 1025))  # Top 1024 ports
    
    # Network Configuration
    SCAN_TIMEOUT: int = 30  # seconds
    DNS_TIMEOUT: int = 10   # seconds
    HTTP_TIMEOUT: int = 30  # seconds
    
    # Logging Configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_DIR: str = os.getenv("LOG_DIR", "./logs")
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Performance Configuration
    MAX_WORKERS: int = int(os.getenv("MAX_WORKERS", "4"))
    WORKER_MEMORY_LIMIT: int = int(os.getenv("WORKER_MEMORY_LIMIT", "512"))  # MB
    
    # Logging Configuration
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    LOG_DIR: str = os.getenv("LOG_DIR", "./logs")
    
    # Cost Efficiency Settings
    RESOURCE_OPTIMIZATION: bool = os.getenv("RESOURCE_OPTIMIZATION", "true").lower() == "true"
    IDLE_WORKER_SHUTDOWN: int = int(os.getenv("IDLE_WORKER_SHUTDOWN", "300"))  # 5 minutes
    
    class Config:
        case_sensitive = True


settings = Settings()
