"""Main FastAPI application entry point."""

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import logging
import os
from datetime import datetime
from uuid import uuid4

from app.config import settings
from app.database import get_db, create_tables
from app.models import ScanRequest, ScanResponse, ScanResults, ScanRecord, ScanStatus
from app.scanners.tasks import perform_scan
from app.scanners.demo_scanner import DemoScanner
from app.utils.rate_limiter import RateLimiter
from app.utils.validator import validate_target
from app.utils.multi_logger import multi_logger
from app.utils.logger import setup_logging

# Setup logging (keep basic setup for FastAPI)
setup_logging()
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for the web interface
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize rate limiter
rate_limiter = RateLimiter()

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info("Starting Cyber Hygiene Scanner API")
    create_tables()
    logger.info("Database tables created/verified")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown."""
    logger.info("Shutting down Cyber Hygiene Scanner API")


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all HTTP requests for monitoring."""
    start_time = datetime.utcnow()
    client_ip = request.client.host
    
    response = await call_next(request)
    
    process_time = (datetime.utcnow() - start_time).total_seconds()
    
    # Log API request using multi-logger
    multi_logger.log_api_request(
        method=request.method,
        endpoint=request.url.path,
        client_ip=client_ip,
        user_agent=request.headers.get("user-agent", ""),
        status_code=response.status_code
    )
    
    # Log performance if slow request
    if process_time > 1.0:
        multi_logger.log_performance_metric(
            metric_name=f"slow_request_{request.method}_{request.url.path}",
            value=process_time,
            unit="seconds"
        )
    
    return response


@app.get("/", response_class=HTMLResponse)
async def root():
    """Serve the main web interface."""
    try:
        with open("static/index.html", "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    except FileNotFoundError:
        return HTMLResponse(content="""
        <html>
            <body>
                <h1>Cyber Hygiene Scanner API</h1>
                <p>Web interface not found. Please check if static/index.html exists.</p>
                <p><a href="/docs">API Documentation</a></p>
            </body>
        </html>
        """)

@app.get("/api")
async def api_root():
    """API endpoint with basic information."""
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "description": settings.DESCRIPTION,
        "docs_url": "/docs",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.VERSION
    }


@app.post(f"{settings.API_V1_PREFIX}/scan", response_model=ScanResponse)
async def create_scan(
    scan_request: ScanRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Submit a new security scan request.
    
    - **target**: IP address or domain name to scan
    - **scan_type**: Type of scan (quick, full, custom)
    - **email**: Optional email for notifications
    """
    try:
        client_ip = request.client.host
        
        # Log scan request for security monitoring
        multi_logger.log_scan_started(
            target=scan_request.target,
            scan_id="pending",
            client_ip=client_ip,
            scan_type=scan_request.scan_type.value
        )
        
        # Rate limiting check
        if not rate_limiter.can_start_scan(client_ip):
            multi_logger.log_rate_limit_hit(
                client_ip=client_ip,
                endpoint="/api/v1/scan",
                limit=10  # Assuming default limit
            )
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please try again later."
            )
        
        # Validate target
        if not validate_target(scan_request.target):
            raise HTTPException(
                status_code=400,
                detail="Invalid target. Please provide a valid IP address or domain name."
            )
        
        # Create scan record
        scan_id = str(uuid4())
        scan_record = ScanRecord(
            id=scan_id,
            target=scan_request.target,
            scan_type=scan_request.scan_type.value,
            email=scan_request.email,
            client_ip=client_ip,
            status=ScanStatus.QUEUED
        )
        
        db.add(scan_record)
        db.commit()
        
        # Check if we're in demo mode (no Redis/Celery)
        demo_mode = os.getenv("DEMO_MODE", "false").lower() == "true"
        
        if demo_mode:
            # Run demo scan immediately
            try:
                demo_scanner = DemoScanner(scan_request.target, scan_request.scan_type.value)
                scan_results = demo_scanner.scan()
                
                # Update scan record with results
                scan_record.status = ScanStatus.COMPLETED
                scan_record.general_score = scan_results["general_score"]
                scan_record.problems = scan_results["problems"]
                scan_record.recommendations = scan_results["recommendations"]
                scan_record.summary = scan_results["summary"]
                scan_record.scan_results = scan_results["results"]
                scan_record.completed_at = datetime.utcnow()
                
                db.commit()
                
                # Log scan completion
                duration = (datetime.utcnow() - scan_record.created_at).total_seconds()
                multi_logger.log_scan_completed(
                    scan_id=scan_id,
                    target=scan_request.target,
                    duration=duration,
                    issues_found=len(scan_results['problems'])
                )
                
            except Exception as e:
                multi_logger.log_scan_error(
                    scan_id=scan_id,
                    scanner="DemoScanner",
                    target=scan_request.target,
                    error=str(e)
                )
                logger.error(f"Demo scan failed: {str(e)}")
                scan_record.status = ScanStatus.FAILED
                scan_record.error_message = str(e)
                db.commit()
        else:
            # Queue the scan task (production mode)
            task = perform_scan.delay(scan_id, scan_request.target, scan_request.scan_type.value)
        
        # Estimate duration based on scan type
        duration_estimates = {
            "quick": "2-3 minutes",
            "full": "5-10 minutes",
            "comprehensive": "5-10 minutes",  # Support both for compatibility
            "custom": "3-7 minutes"
        }
        
        logger.info(f"Scan queued: {scan_id} for target {scan_request.target}")
        
        return ScanResponse(
            scan_id=scan_id,
            status=ScanStatus.QUEUED,
            estimated_duration=duration_estimates.get(scan_request.scan_type.value, "5-10 minutes"),
            results_url=f"{settings.API_V1_PREFIX}/scan/{scan_id}/results"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating scan: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while creating scan"
        )


@app.get(f"{settings.API_V1_PREFIX}/scan/{{scan_id}}/results")
async def get_scan_results(scan_id: str, db: Session = Depends(get_db)):
    """
    Retrieve scan results by scan ID.
    
    - **scan_id**: UUID of the scan to retrieve
    """
    try:
        # Get scan record from database
        scan_record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
        
        if not scan_record:
            raise HTTPException(
                status_code=404,
                detail="Scan not found"
            )
        
        # Convert problems and recommendations to proper format for JSON response
        problems_data = scan_record.problems or []
        recommendations_data = scan_record.recommendations or []
        
        # For demo mode, return as simple JSON response instead of using Pydantic model
        if os.getenv("DEMO_MODE", "false").lower() == "true":
            response_data = {
                "scan_id": scan_id,
                "target": scan_record.target,
                "status": scan_record.status,
                "timestamp": scan_record.created_at.isoformat() if scan_record.created_at else None,
                "general_score": scan_record.general_score,
                "problems": problems_data,
                "recommendations": recommendations_data,
                "summary": scan_record.summary,
                "results": scan_record.scan_results or {}
            }
            
            # Log audit event
            multi_logger.log_data_access(
                user_id="anonymous",  # In demo mode, no user auth
                action="scan_results_retrieved",
                resource=f"scan_{scan_id}",
                client_ip="127.0.0.1"  # Demo mode
            )
            
            logger.info(f"Retrieved scan results for: {scan_id}")
            return response_data
        
        # For production mode, use proper Pydantic models
        response = ScanResults(
            scan_id=scan_id,
            target=scan_record.target,
            status=ScanStatus(scan_record.status),
            timestamp=scan_record.created_at,
            general_score=scan_record.general_score,
            problems=problems_data,  # This might need conversion
            recommendations=recommendations_data,  # This might need conversion
            summary=scan_record.summary,
            results=scan_record.scan_results or {}
        )
        
        logger.info(f"Retrieved scan results for: {scan_id}")
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving scan results: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while retrieving scan results"
        )


@app.get(f"{settings.API_V1_PREFIX}/scan/{{scan_id}}/status")
async def get_scan_status(scan_id: str, db: Session = Depends(get_db)):
    """
    Get current status of a scan.
    
    - **scan_id**: UUID of the scan to check
    """
    try:
        scan_record = db.query(ScanRecord).filter(ScanRecord.id == scan_id).first()
        
        if not scan_record:
            raise HTTPException(
                status_code=404,
                detail="Scan not found"
            )
        
        response = {
            "scan_id": scan_id,
            "status": scan_record.status,
            "target": scan_record.target,
            "created_at": scan_record.created_at.isoformat(),
            "started_at": scan_record.started_at.isoformat() if scan_record.started_at else None,
            "completed_at": scan_record.completed_at.isoformat() if scan_record.completed_at else None
        }
        
        if scan_record.status == ScanStatus.FAILED and scan_record.error_message:
            response["error"] = scan_record.error_message
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving scan status: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while retrieving scan status"
        )


@app.exception_handler(404)
async def not_found_handler(request: Request, exc: HTTPException):
    """Custom 404 handler."""
    return JSONResponse(
        status_code=404,
        content={
            "detail": "Endpoint not found",
            "path": str(request.url.path),
            "method": request.method
        }
    )


@app.exception_handler(500)
async def internal_error_handler(request: Request, exc: Exception):
    """Custom 500 handler."""
    logger.error(f"Internal server error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error_id": str(uuid4())  # For tracking in logs
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
