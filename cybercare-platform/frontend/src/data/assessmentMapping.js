// src/data/assessmentMapping.js - Comprehensive mapping for all questions
export const ASSESSMENT_TO_COMPLIANCE_MAPPING = {
  // Network Security Mappings
  1: {
    questionId: 1,
    questionText: 'Does your company have a next-generation firewall with intrusion prevention/detection capabilities?',
    complianceCategory: 'network-security',
    complianceItemId: 'firewall_implemented',
    answerType: 'boolean'
  },
  2: {
    questionId: 2,
    questionText: 'Is your network segmented using VLANs to isolate different systems?',
    complianceCategory: 'network-security',
    complianceItemId: 'network_monitoring_system',
    answerType: 'boolean'
  },
  3: {
    questionId: 3,
    questionText: 'Are network access control lists (ACLs) properly configured on your infrastructure?',
    complianceCategory: 'network-security',
    complianceItemId: 'access_control_lists',
    answerType: 'boolean'
  },
  4: {
    questionId: 4,
    questionText: 'Do you use secure VPN with strong encryption for remote access?',
    complianceCategory: 'network-security',
    complianceItemId: 'vpn_security',
    answerType: 'boolean'
  },
  5: {
    questionId: 5,
    questionText: 'Are all wireless networks secured with WPA3 encryption?',
    complianceCategory: 'network-security',
    complianceItemId: 'wifi_security_configured',
    answerType: 'boolean'
  },

  // Access Management Mappings
  6: {
    questionId: 6,
    questionText: 'Is multi-factor authentication (MFA) enabled for all privileged accounts?',
    complianceCategory: 'access_management',
    complianceItemId: 'mfa_implemented',
    answerType: 'boolean'
  },
  7: {
    questionId: 7,
    questionText: 'Do you have a documented password policy requiring strong passwords?',
    complianceCategory: 'access_management',
    complianceItemId: 'password_policy_documented',
    answerType: 'boolean'
  },
  8: {
    questionId: 8,
    questionText: 'How do you manage access to sensitive company data?',
    complianceCategory: 'access_management',
    complianceItemId: 'mfa_implemented', // Maps to access control
    answerType: 'multiple-choice'
  },

  // Data Protection Mappings
  9: {
    questionId: 9,
    questionText: 'Is sensitive data encrypted at rest using AES-256 or equivalent?',
    complianceCategory: 'data_protection',
    complianceItemId: 'data_encryption_implemented',
    answerType: 'boolean'
  },
  10: {
    questionId: 10,
    questionText: 'Is data encrypted in transit using TLS 1.3 or equivalent?',
    complianceCategory: 'data_protection',
    complianceItemId: 'backup_procedures_established',
    answerType: 'boolean'
  },
  11: {
    questionId: 11,
    questionText: 'Are regular automated backups performed and tested?',
    complianceCategory: 'data_protection',
    complianceItemId: 'backup_procedures_established',
    answerType: 'boolean'
  },

  // Security Training Mappings
  12: {
    questionId: 12,
    questionText: 'Do employees receive annual cybersecurity awareness training?',
    complianceCategory: 'security_training',
    complianceItemId: 'phishing_training',
    answerType: 'boolean'
  },
  13: {
    questionId: 13,
    questionText: 'How often do you conduct phishing simulation exercises?',
    complianceCategory: 'security_training',
    complianceItemId: 'phishing_training',
    answerType: 'multiple-choice'
  },
  14: {
    questionId: 14,
    questionText: 'Do you have a comprehensive security awareness program?',
    complianceCategory: 'security_training',
    complianceItemId: 'security_awareness_program',
    answerType: 'boolean'
  },

  // Incident Management Mappings
  15: {
    questionId: 15,
    questionText: 'Do you have a documented incident response plan?',
    complianceCategory: 'incident_management',
    complianceItemId: 'incident_response_plan_documented',
    answerType: 'boolean'
  },
  16: {
    questionId: 16,
    questionText: 'Are emergency security contacts and escalation procedures defined?',
    complianceCategory: 'incident_management',
    complianceItemId: 'emergency_contacts_defined',
    answerType: 'boolean'
  },
  17: {
    questionId: 17,
    questionText: 'How quickly can you detect and respond to security incidents?',
    complianceCategory: 'incident_management',
    complianceItemId: 'incident_response_plan_documented',
    answerType: 'multiple-choice'
  },

  // Governance Mappings
  18: {
    questionId: 18,
    questionText: 'Do you have documented cybersecurity policies and procedures?',
    complianceCategory: 'governance',
    complianceItemId: 'security_policy_documented',
    answerType: 'boolean'
  },
  19: {
    questionId: 19,
    questionText: 'Do you conduct regular cybersecurity risk assessments?',
    complianceCategory: 'governance',
    complianceItemId: 'risk_assessment_conducted',
    answerType: 'boolean'
  },
  20: {
    questionId: 20,
    questionText: 'How often do you review and update your security policies?',
    complianceCategory: 'governance',
    complianceItemId: 'security_policy_documented',
    answerType: 'multiple-choice'
  },

  // Additional Coverage Mappings
  21: {
    questionId: 21,
    questionText: 'Do you use antivirus software on all computers and servers?',
    complianceCategory: 'network-security',
    complianceItemId: 'firewall_implemented', // Groups with general security
    answerType: 'boolean'
  },
  22: {
    questionId: 22,
    questionText: 'How do you manage software updates and patches?',
    complianceCategory: 'governance',
    complianceItemId: 'security_policy_documented',
    answerType: 'multiple-choice'
  },
  23: {
    questionId: 23,
    questionText: 'Do you monitor network traffic and system logs for security threats?',
    complianceCategory: 'network-security',
    complianceItemId: 'network_monitoring_system',
    answerType: 'boolean'
  },
  24: {
    questionId: 24,
    questionText: 'Are critical systems backed up and recovery procedures tested?',
    complianceCategory: 'data_protection',
    complianceItemId: 'backup_procedures_established',
    answerType: 'boolean'
  }
};

// Helper function to get compliance item from assessment answer
export const getComplianceItemFromAssessment = (questionId) => {
  return ASSESSMENT_TO_COMPLIANCE_MAPPING[questionId] || null;
};