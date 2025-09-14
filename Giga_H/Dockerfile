# Docker container for consistent deployment; lightweight base image for efficiency
FROM python:3.11-slim

# Install system dependencies required for scanning
RUN apt-get update && apt-get install -y \
    nmap \
    dnsutils \
    openssl \
    curl \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user for security
RUN useradd -m -u 1000 scanner && chown -R scanner:scanner /app
USER scanner

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
