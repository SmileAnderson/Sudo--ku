// src/data/assessmentMapping.js - Maps assessment questions to compliance items
export const ASSESSMENT_TO_COMPLIANCE_MAPPING = {
  // Network Security Questions
  'network_firewall': {
    questionId: 'network_firewall',
    questionText: 'Do you have a firewall protecting your network?',
    complianceCategory: 'network_security',
    complianceItemId: 'firewall_implemented',
    answerType: 'boolean' // yes/no maps directly to checked/unchecked
  },
  
  'network_monitoring': {
    questionId: 'network_monitoring',
    questionText: 'Do you have network monitoring systems in place?',
    complianceCategory: 'network_security',
    complianceItemId: 'network_monitoring_system',
    answerType: 'boolean'
  },
  
  'wifi_security': {
    questionId: 'wifi_security',
    questionText: 'Is your WiFi network secured with WPA3 or WPA2?',
    complianceCategory: 'network_security',
    complianceItemId: 'wifi_security_configured',
    answerType: 'boolean'
  },

  // Data Protection Questions
  'data_encryption': {
    questionId: 'data_encryption',
    questionText: 'Is sensitive data encrypted at rest and in transit?',
    complianceCategory: 'data_protection',
    complianceItemId: 'data_encryption_implemented',
    answerType: 'boolean'
  },
  
  'data_backup': {
    questionId: 'data_backup',
    questionText: 'Do you have regular automated backups?',
    complianceCategory: 'data_protection',
    complianceItemId: 'backup_procedures_established',
    answerType: 'boolean'
  },
  
  'access_controls': {
    questionId: 'access_controls',
    questionText: 'Are access controls implemented for sensitive data?',
    complianceCategory: 'data_protection',
    complianceItemId: 'access_control_matrix',
    answerType: 'boolean'
  },

  // Employee Security Questions
  'security_training_completed': {
    questionId: 'security_training_completed',
    questionText: 'Have employees completed cybersecurity training?',
    complianceCategory: 'security_training',
    complianceItemId: 'phishing_training',
    answerType: 'boolean'
  },
  
  'password_policy': {
    questionId: 'password_policy',
    questionText: 'Do you have a strong password policy in place?',
    complianceCategory: 'access_management',
    complianceItemId: 'password_policy_documented',
    answerType: 'boolean'
  },
  
  'mfa_enabled': {
    questionId: 'mfa_enabled',
    questionText: 'Is multi-factor authentication enabled for critical systems?',
    complianceCategory: 'access_management',
    complianceItemId: 'mfa_implemented',
    answerType: 'boolean'
  },

  // Incident Response Questions
  'incident_response_plan': {
    questionId: 'incident_response_plan',
    questionText: 'Do you have a documented incident response plan?',
    complianceCategory: 'incident_management',
    complianceItemId: 'incident_response_plan_documented',
    answerType: 'boolean'
  },
  
  'security_contacts': {
    questionId: 'security_contacts',
    questionText: 'Are emergency security contacts designated?',
    complianceCategory: 'incident_management',
    complianceItemId: 'emergency_contacts_defined',
    answerType: 'boolean'
  },

  // Governance Questions
  'security_policy': {
    questionId: 'security_policy',
    questionText: 'Do you have documented cybersecurity policies?',
    complianceCategory: 'governance',
    complianceItemId: 'security_policy_documented',
    answerType: 'boolean'
  },
  
  'risk_assessment': {
    questionId: 'risk_assessment',
    questionText: 'Do you conduct regular risk assessments?',
    complianceCategory: 'governance',
    complianceItemId: 'risk_assessment_conducted',
    answerType: 'boolean'
  }
};

// Helper function to get compliance item from assessment answer
export const getComplianceItemFromAssessment = (questionId) => {
  return ASSESSMENT_TO_COMPLIANCE_MAPPING[questionId] || null;
};