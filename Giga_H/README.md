# Cyber Hygiene Scanner

A comprehensive cybersecurity scanning service that provides cyber hygiene assessment for organizations. The system consists of a REST API that receives IP addresses or domains, performs comprehensive security scans, and returns summarized results with security scores, identified problems, and actionable recommendations.

## Features

### 🔍 Comprehensive Scanning
- **Internet Exposure Inventory**: Port scanning, service detection, OS fingerprinting
- **TLS/SSL Security Analysis**: Certificate validation, protocol testing, cipher analysis
- **Web Security Headers**: HTTP security headers assessment and configuration analysis
- **Email Authentication**: SPF, DKIM, DMARC policy analysis
- **CVE Vulnerability Assessment**: Known vulnerability detection with CVSS scoring
- **IAM Assessment**: Admin interface discovery and access control evaluation
- **Backup & DR Assessment**: Exposed backup detection and disaster recovery analysis
- **Security Monitoring Detection**: WAF, CDN, and security tool identification

### 🛡️ Security & Compliance
- **Data Encryption**: Sensitive data encryption at rest using Fernet encryption
- **Access Control**: Role-based access control with audit logging
- **Data Retention**: Automated data cleanup and anonymization for compliance
- **GDPR Compliance**: Data subject rights and privacy by design implementation
- **SOC 2 Compliance**: Security controls and monitoring metrics
- **ISO 27001 Compliance**: Information security management controls

### 🚀 Performance & Scalability
- **Asynchronous Processing**: Celery-based task queue for scan execution
- **Rate Limiting**: Redis-based rate limiting to prevent abuse
- **Horizontal Scaling**: Docker and Kubernetes-ready architecture
- **Resource Optimization**: Efficient scanning algorithms and memory management
- **Cost Efficiency**: Optimized for on-premises deployment with minimal hardware requirements

## Quick Start

### Prerequisites
- Python 3.11+
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd cyber-hygiene-scanner
```

2. **Build and start services**
```bash
docker-compose up -d
```

3. **The API will be available at:**
- Main API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Admin Interface: http://localhost:8000/redoc

### Basic Usage

1. **Submit a scan**
```bash
curl -X POST "http://localhost:8000/api/v1/scan" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "example.com",
    "scan_type": "full",
    "email": "admin@company.com"
  }'
```

2. **Check scan status**
```bash
curl "http://localhost:8000/api/v1/scan/{scan_id}/status"
```

3. **Get results**
```bash
curl "http://localhost:8000/api/v1/scan/{scan_id}/results"
```

## API Documentation

### Core Endpoints

#### `POST /api/v1/scan`
Submit a new security scan request.

**Request Body:**
```json
{
  "target": "example.com",
  "scan_type": "full",
  "email": "contact@company.com"
}
```

**Response:**
```json
{
  "scan_id": "uuid-string",
  "status": "queued",
  "estimated_duration": "5-10 minutes",
  "results_url": "/api/v1/scan/{scan_id}/results"
}
```

#### `GET /api/v1/scan/{scan_id}/results`
Retrieve comprehensive scan results.

**Response:**
```json
{
  "scan_id": "uuid",
  "target": "example.com",
  "status": "completed",
  "timestamp": "2024-03-15T10:30:00Z",
  "general_score": 75,
  "problems": [
    {
      "category": "tls_security",
      "issue": "Outdated TLS version supported",
      "severity": "high",
      "description": "TLS 1.0 is enabled, which is deprecated and vulnerable to attacks.",
      "impact": "Potential for man-in-the-middle attacks and data interception."
    }
  ],
  "recommendations": [
    {
      "problem_id": "tls_security_outdated",
      "recommendation": "Disable TLS 1.0 and 1.1; enable only TLS 1.2 and 1.3.",
      "effort_estimate": "Low (configuration change)",
      "steps": [
        "Access server configuration files (e.g., Apache/Nginx).",
        "Update SSL/TLS directives to restrict versions.",
        "Restart services and verify with tools like SSL Labs."
      ]
    }
  ],
  "summary": {
    "categories_scanned": 8,
    "categories_completed": 7,
    "categories_failed": 1,
    "total_issues_found": 15,
    "critical_issues": 2,
    "high_issues": 4,
    "medium_issues": 5,
    "low_issues": 4
  },
  "results": {
    "internet_exposure": {...},
    "tls_security": {...},
    "web_security": {...},
    "email_security": {...},
    "vulnerabilities": {...},
    "iam_assessment": {...},
    "backup_dr": {...},
    "logging_monitoring": {...}
  }
}
```

## Configuration

### Environment Variables

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@db:5432/cyber_scanner

# Redis Configuration  
REDIS_URL=redis://redis:6379/0

# Celery Configuration
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0

# Security Configuration
ENCRYPTION_KEY=<fernet-key>
SECRET_KEY=<secret-key>

# Rate Limiting
MAX_SCANS_PER_HOUR=10
MAX_CONCURRENT_SCANS=3

# Performance
MAX_WORKERS=4
WORKER_MEMORY_LIMIT=512

# Logging
LOG_LEVEL=INFO
LOG_DIR=./logs
```

### Scan Types

- **quick**: Fast scan covering essential security checks (~2-3 minutes)
- **full**: Comprehensive scan across all categories (~5-10 minutes)  
- **custom**: Configurable scan with specific categories

## Deployment

### Production Deployment

1. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your production settings
```

2. **Generate encryption key**
```python
from cryptography.fernet import Fernet
print(Fernet.generate_key().decode())
```

3. **Deploy with Docker Compose**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

```bash
kubectl apply -f k8s/
```

### Scaling Workers

```bash
# Scale Celery workers
docker-compose up -d --scale worker=5

# Or with Kubernetes
kubectl scale deployment worker --replicas=5
```

## Monitoring & Maintenance

### Health Checks
- API Health: `GET /health`
- Worker Health: Celery monitoring via Redis

### Data Retention
Automated cleanup runs daily based on configured retention policies:
- Scan results: 90 days (configurable)
- Customer data: 3 years (with anonymization after 6 months)
- Logs: 1 year

### Performance Monitoring
Monitor key metrics:
- Scan completion time
- Resource utilization (CPU, Memory)
- Queue depth and processing rate
- Error rates and failed scans

## Security Considerations

### Authentication & Authorization
- Implement API authentication for production use
- Use role-based access control for different user types
- Enable audit logging for all administrative actions

### Network Security
- Run scanners in isolated network segments
- Use VPN or dedicated scanning infrastructure
- Implement proper firewall rules

### Data Protection
- Enable encryption for sensitive scan data
- Implement data retention and anonymization policies
- Regular security assessments and penetration testing

## Cost Optimization

### Resource Efficiency
- Average resource utilization: <50% CPU/memory during peak loads
- Idle worker shutdown after 5 minutes of inactivity
- Efficient caching and connection pooling

### Hardware Requirements
**Minimum (Development):**
- 4 CPU cores
- 8GB RAM
- 50GB SSD storage

**Recommended (Production):**
- 8 CPU cores  
- 16GB RAM
- 200GB SSD storage
- Load balancer for HA

### Scaling Guidelines
- Handle 10x load increase with linear hardware addition
- Horizontal scaling via container orchestration
- Auto-scaling based on queue depth and resource utilization

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical support and questions:
- Documentation: Check the `/docs` endpoint
- Issues: Submit via GitHub issues
- Security: Email security@company.com for security-related concerns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality  
5. Submit a pull request

## Changelog

### v1.0.0
- Initial release with comprehensive scanning capabilities
- Full compliance framework (GDPR, SOC2, ISO 27001)
- Production-ready deployment configuration
- Performance optimizations and cost efficiency features
