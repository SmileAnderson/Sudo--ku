#!/usr/bin/env python3
"""Development server runner with auto-reload and debugging."""

import uvicorn
import os
import sys
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

def main():
    """Run the development server."""
    # Ensure logs directory exists
    os.makedirs("logs", exist_ok=True)
    
    # Set development environment variables
    os.environ.setdefault("LOG_LEVEL", "DEBUG")
    os.environ.setdefault("DATABASE_URL", "postgresql://postgres:password@localhost:5432/cyber_scanner")
    os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")
    
    print("🚀 Starting Cyber Hygiene Scanner API in development mode...")
    print("📡 API will be available at: http://localhost:8001")
    print("📚 API Documentation: http://localhost:8001/docs")
    print("🔍 Interactive docs: http://localhost:8001/redoc")
    print("\n💡 To stop the server, press Ctrl+C")
    print("=" * 60)
    
    # Run with auto-reload for development
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        reload_dirs=["app", "."],
        log_level="debug",
        access_log=True,
        workers=1  # Single worker for development
    )

if __name__ == "__main__":
    main()
