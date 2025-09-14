#!/usr/bin/env python3
"""Celery worker runner for development."""

import os
import sys
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

def main():
    """Run Celery worker for development."""
    # Ensure logs directory exists
    os.makedirs("logs", exist_ok=True)
    
    # Set development environment variables
    os.environ.setdefault("LOG_LEVEL", "DEBUG")
    os.environ.setdefault("DATABASE_URL", "postgresql://postgres:password@localhost:5432/cyber_scanner")
    os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")
    os.environ.setdefault("CELERY_BROKER_URL", "redis://localhost:6379/0")
    os.environ.setdefault("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
    
    print("🔧 Starting Celery worker for scan processing...")
    print("📊 Worker will process scan tasks asynchronously")
    print("🚀 Make sure Redis is running on localhost:6379")
    print("\n💡 To stop the worker, press Ctrl+C")
    print("=" * 60)
    
    # Import and start Celery worker
    from app.celery_app import celery_app
    
    # Run worker with development settings
    celery_app.worker_main([
        'worker',
        '--loglevel=debug',
        '--concurrency=2',  # Limited concurrency for development
        '--pool=solo',      # Use solo pool for debugging
        '--without-gossip',
        '--without-mingle',
        '--without-heartbeat'
    ])

if __name__ == "__main__":
    main()
