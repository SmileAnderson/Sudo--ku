# Data Directory

This directory is used by the Cyber Hygiene Scanner for:

## 📁 Purpose
- **Application Data Storage**: Runtime data and temporary files
- **CVE Database Cache**: Local vulnerability database for offline scanning
- **Backup Detection**: Reference data for backup file detection
- **Compliance Data**: Encrypted scan data storage (when not using external database)

## 🔒 Security
- All sensitive data stored here is encrypted using Fernet encryption
- Data retention policies automatically clean up old files
- Access is controlled through the application's security framework

## 📋 Subdirectories (created as needed)
- `cache/` - Cached CVE and DNS data
- `exports/` - GDPR data export files (temporary)
- `backups/` - Application backup files
- `temp/` - Temporary scan data

## ⚠️ Important
- Do not manually edit files in this directory
- Ensure proper permissions (readable/writable by application only)
- Include this directory in your backup strategy
- Exclude from version control (contains runtime data)
