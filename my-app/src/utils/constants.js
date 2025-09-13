// Application constants and enums
export const TABS = {
  DASHBOARD: 'dashboard',
  COMPLIANCE: 'compliance',
  TRAINING: 'training',
  INCIDENTS: 'incidents',
  RESOURCES: 'resources'
};

export const INCIDENT_TYPES = {
  INITIAL: 'initial',
  UPDATE: 'update',
  FINAL: 'final'
};

export const INCIDENT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

export const INCIDENT_CATEGORIES = {
  DATA_BREACH: 'data-breach',
  MALWARE: 'malware',
  UNAUTHORIZED_ACCESS: 'unauthorized-access',
  SERVICE_DISRUPTION: 'service-disruption',
  PHISHING: 'phishing',
  DDOS: 'ddos',
  INSIDER_THREAT: 'insider-threat',
  OTHER: 'other'
};

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  CRITICAL: 'critical'
};

export const TRAINING_DIFFICULTIES = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced'
};

export const COMPLIANCE_STATUS = {
  GOOD: 'Good Compliance',
  NEEDS_IMPROVEMENT: 'Needs Improvement',
  CRITICAL: 'Critical Issues'
};

export const RISK_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};

export const AUDIT_STATUS = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

// Application configuration
export const APP_CONFIG = {
  NAME: 'CyberCare',
  VERSION: '1.0.0',
  LAW_REFERENCE: 'Law No. 142/2023',
  ORGANIZATION: 'Orange Systems',
  SUPPORT_PHONE: '+373 (22) 123-456',
  MAX_INCIDENTS: 100,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  AUTO_SAVE_INTERVAL: 60 * 1000 // 1 minute
};

// Scoring thresholds
export const SCORING = {
  COMPLIANCE_GOOD: 80,
  COMPLIANCE_WARNING: 60,
  RISK_HIGH: 7,
  RISK_MEDIUM: 4,
  TRAINING_LEVEL_POINTS: 500
};

// API endpoints (for future implementation)
export const API_ENDPOINTS = {
  AUDIT: '/api/audit',
  COMPLIANCE: '/api/compliance',
  INCIDENTS: '/api/incidents',
  TRAINING: '/api/training',
  REPORTS: '/api/reports'
};

// Local storage keys
export const STORAGE_KEYS = {
  COMPLIANCE_DATA: 'cybercare_compliance',
  TRAINING_DATA: 'cybercare_training',
  INCIDENTS: 'cybercare_incidents',
  USER_PREFERENCES: 'cybercare_preferences'
};