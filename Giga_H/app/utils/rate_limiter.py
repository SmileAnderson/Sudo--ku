"""Rate limiting implementation for cost efficiency and abuse prevention."""

import time
import os
from typing import Dict
from app.config import settings


class DemoRateLimiter:
    """In-memory rate limiter for demo mode."""
    
    def __init__(self):
        self.scan_counts = {}
        self.concurrent_scans = {}
        self.max_scans_per_hour = settings.MAX_SCANS_PER_HOUR
        self.max_concurrent_scans = settings.MAX_CONCURRENT_SCANS
        self.rate_limit_window = settings.RATE_LIMIT_WINDOW
    
    def can_start_scan(self, client_ip: str) -> bool:
        """Allow all scans in demo mode."""
        return True
    
    def record_scan_start(self, client_ip: str) -> None:
        """Record scan start (no-op in demo)."""
        pass
    
    def record_scan_end(self, client_ip: str) -> None:
        """Record scan end (no-op in demo)."""
        pass
    
    def is_rate_limited(self, client_ip: str, endpoint: str = "default") -> bool:
        """No rate limiting in demo mode."""
        return False


class RateLimiter:
    """Redis-based rate limiter for API endpoints and scanning requests."""
    
    def __init__(self):
        # Use demo rate limiter if in demo mode or Redis not available
        if os.getenv("DEMO_MODE", "false").lower() == "true":
            self._use_demo = True
            self._demo_limiter = DemoRateLimiter()
        else:
            try:
                import redis
                self.redis_client = redis.from_url(settings.REDIS_URL)
                self._use_demo = False
            except (ImportError, Exception):
                self._use_demo = True
                self._demo_limiter = DemoRateLimiter()
        
        self.max_scans_per_hour = settings.MAX_SCANS_PER_HOUR
        self.max_concurrent_scans = settings.MAX_CONCURRENT_SCANS
        self.rate_limit_window = settings.RATE_LIMIT_WINDOW
        
    def can_start_scan(self, client_ip: str) -> bool:
        """
        Check if client can start a new scan based on rate limits.
        
        Args:
            client_ip: Client IP address
            
        Returns:
            bool: True if scan can be started, False otherwise
        """
        if self._use_demo:
            return self._demo_limiter.can_start_scan(client_ip)
        
        current_time = int(time.time())
        
        # Check hourly scan limit
        hourly_key = f"scan_limit:{client_ip}:{current_time // 3600}"
        current_scans = self.redis_client.get(hourly_key)
        
        if current_scans and int(current_scans) >= self.max_scans_per_hour:
            return False
        
        # Check concurrent scan limit
        concurrent_key = f"concurrent_scans:{client_ip}"
        concurrent_scans = self.redis_client.get(concurrent_key)
        
        if concurrent_scans and int(concurrent_scans) >= self.max_concurrent_scans:
            return False
        
        return True
    
    def record_scan_start(self, client_ip: str) -> None:
        """
        Record that a scan has started for rate limiting.
        
        Args:
            client_ip: Client IP address
        """
        if self._use_demo:
            return self._demo_limiter.record_scan_start(client_ip)
        
        current_time = int(time.time())
        
        # Increment hourly counter
        hourly_key = f"scan_limit:{client_ip}:{current_time // 3600}"
        pipeline = self.redis_client.pipeline()
        pipeline.incr(hourly_key)
        pipeline.expire(hourly_key, 3600)  # Expire after 1 hour
        
        # Increment concurrent counter
        concurrent_key = f"concurrent_scans:{client_ip}"
        pipeline.incr(concurrent_key)
        pipeline.expire(concurrent_key, settings.DEFAULT_SCAN_TIMEOUT)  # Expire after scan timeout
        
        pipeline.execute()
    
    def record_scan_end(self, client_ip: str) -> None:
        """
        Record that a scan has ended for concurrent tracking.
        
        Args:
            client_ip: Client IP address
        """
        if self._use_demo:
            return self._demo_limiter.record_scan_end(client_ip)
        
        concurrent_key = f"concurrent_scans:{client_ip}"
        current_count = self.redis_client.get(concurrent_key)
        
        if current_count and int(current_count) > 0:
            self.redis_client.decr(concurrent_key)
    
    def is_rate_limited(self, client_ip: str, endpoint: str = "default") -> bool:
        """
        Check if client is rate limited for general API usage.
        
        Args:
            client_ip: Client IP address
            endpoint: API endpoint being accessed
            
        Returns:
            bool: True if rate limited, False otherwise
        """
        if self._use_demo:
            return self._demo_limiter.is_rate_limited(client_ip, endpoint)
        
        current_time = int(time.time())
        window_start = current_time - self.rate_limit_window
        
        # Create unique key for this IP and endpoint
        key = f"rate_limit:{client_ip}:{endpoint}"
        
        # Clean old entries and count current requests
        pipeline = self.redis_client.pipeline()
        pipeline.zremrangebyscore(key, 0, window_start)
        pipeline.zcard(key)
        pipeline.expire(key, self.rate_limit_window)
        
        results = pipeline.execute()
        current_requests = results[1]
        
        return current_requests >= settings.RATE_LIMIT_REQUESTS
    
    def record_request(self, client_ip: str, endpoint: str = "default") -> None:
        """
        Record an API request for rate limiting.
        
        Args:
            client_ip: Client IP address
            endpoint: API endpoint being accessed
        """
        current_time = int(time.time())
        key = f"rate_limit:{client_ip}:{endpoint}"
        
        # Add current timestamp to sorted set
        pipeline = self.redis_client.pipeline()
        pipeline.zadd(key, {str(current_time): current_time})
        pipeline.expire(key, self.rate_limit_window)
        pipeline.execute()
    
    def get_remaining_requests(self, client_ip: str, endpoint: str = "default") -> int:
        """
        Get number of remaining requests in current window.
        
        Args:
            client_ip: Client IP address
            endpoint: API endpoint
            
        Returns:
            int: Number of remaining requests
        """
        current_time = int(time.time())
        window_start = current_time - self.rate_limit_window
        key = f"rate_limit:{client_ip}:{endpoint}"
        
        # Clean old entries and count current requests
        pipeline = self.redis_client.pipeline()
        pipeline.zremrangebyscore(key, 0, window_start)
        pipeline.zcard(key)
        
        results = pipeline.execute()
        current_requests = results[1]
        
        return max(0, settings.RATE_LIMIT_REQUESTS - current_requests)
    
    def reset_rate_limit(self, client_ip: str, endpoint: str = "default") -> None:
        """
        Reset rate limit for a client (admin function).
        
        Args:
            client_ip: Client IP address
            endpoint: API endpoint
        """
        key = f"rate_limit:{client_ip}:{endpoint}"
        self.redis_client.delete(key)
    
    def get_scan_stats(self, client_ip: str) -> Dict[str, int]:
        """
        Get current scan statistics for a client.
        
        Args:
            client_ip: Client IP address
            
        Returns:
            dict: Scan statistics
        """
        current_time = int(time.time())
        
        # Get hourly scans
        hourly_key = f"scan_limit:{client_ip}:{current_time // 3600}"
        hourly_scans = self.redis_client.get(hourly_key) or 0
        
        # Get concurrent scans
        concurrent_key = f"concurrent_scans:{client_ip}"
        concurrent_scans = self.redis_client.get(concurrent_key) or 0
        
        return {
            "hourly_scans": int(hourly_scans),
            "max_hourly_scans": self.max_scans_per_hour,
            "concurrent_scans": int(concurrent_scans),
            "max_concurrent_scans": self.max_concurrent_scans,
            "remaining_hourly": max(0, self.max_scans_per_hour - int(hourly_scans)),
            "can_start_scan": self.can_start_scan(client_ip)
        }
