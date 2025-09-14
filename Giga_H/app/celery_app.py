"""Celery configuration for asynchronous task processing."""

from celery import Celery
from app.config import settings

# Create Celery instance
celery_app = Celery(
    "cyber_scanner",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.scanners.tasks"]
)

# Configure Celery
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=settings.DEFAULT_SCAN_TIMEOUT,
    task_soft_time_limit=settings.DEFAULT_SCAN_TIMEOUT - 60,
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    worker_max_tasks_per_child=100,  # Cost efficiency: restart workers to prevent memory leaks
    task_routes={
        "app.scanners.tasks.*": {"queue": "scanner_queue"}
    },
    # Resource optimization
    worker_concurrency=settings.MAX_CONCURRENT_SCANS,
    worker_max_memory_per_child=settings.WORKER_MEMORY_LIMIT * 1024,  # Convert MB to KB
)

# Health check task
@celery_app.task
def health_check():
    """Simple health check task for monitoring."""
    return {"status": "healthy", "message": "Celery worker is running"}

if __name__ == "__main__":
    celery_app.start()
