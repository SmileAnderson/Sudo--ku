// src/data/constants.js - Add this to your existing constants
export const COMPLIANCE_CHECKLIST = {
  'network-security': {
    title: 'Network Security (Article 11.1)',
    items: [
      { 
        id: 'firewall_implemented', 
        text: 'Next-generation firewall with IPS/IDS capabilities', 
        required: true,
        completed: false,
        resources: [
          { title: 'Moldova Firewall Requirements Guide', url: 'https://aboutmoldova.md/en/view_articles_post.php?id=467', type: 'Link' },
          { title: 'Firewall Configuration Template', url: 'https://documentero.com/templates/it-engineering/document/firewall-configuration/', type: 'Link' }
        ]
      },
      { 
        id: 'network_monitoring_system', 
        text: 'Network segmentation with VLAN isolation', 
        required: true,
        completed: false,
        resources: [
          { title: 'Network Segmentation Guide', url: 'https://www.upguard.com/blog/network-segmentation-best-practices', type: 'Link' }
        ]
      },
      { 
        id: 'access_control_lists', 
        text: 'Network access control lists (ACLs) configured', 
        required: true,
        completed: false,
        resources: [
          { title: 'ACL Configuration Examples', url: '#acl-examples', type: 'Examples' },
          { title: 'Access Control Policy Template', url: '#acl-policy', type: 'Template' }
        ]
      },
      { 
        id: 'vpn_security', 
        text: 'Secure VPN with strong encryption for remote access', 
        required: true,
        completed: false,
        resources: [
          { title: 'Remote Access Policy Template', url: '#vpn-policy', type: 'Template' }
        ]
      },
      { 
        id: 'wifi_security_configured', 
        text: 'WPA3 encryption on all wireless networks', 
        required: true,
        completed: false,
        resources: [
          { title: 'Wireless Security Configuration', url: '#wifi-security', type: 'Guide' },
          { title: 'WPA3 Implementation Checklist', url: '#wpa3-checklist', type: 'Checklist' }
        ]
      }
    ]
  },
  'access_management': {
    title: 'Identity & Access Management (Article 11.2)',
    items: [
      { 
        id: 'mfa_implemented', 
        text: 'Multi-factor authentication for all privileged accounts', 
        required: true,
        completed: false,
        resources: [
          { title: 'MFA Implementation Guide', url: '#mfa-guide', type: 'Guide' },
          { title: 'MFA Policy Template', url: '#mfa-policy', type: 'Template' }
        ]
      },
      { 
        id: 'password_policy_documented', 
        text: 'Strong password policy (min 12 chars, complexity)', 
        required: true,
        completed: false,
        resources: [
          { title: 'Password Policy Generator', url: '#password-policy', type: 'Tool' }
        ]
      }
    ]
  },
  'data_protection': {
    title: 'Data Protection & Encryption (Article 11.3)',
    items: [
      { 
        id: 'data_encryption_implemented', 
        text: 'AES-256 encryption for data at rest', 
        required: true,
        completed: false,
        resources: [
          { title: 'Encryption Implementation Guide', url: '#encryption-guide', type: 'Guide' },
          { title: 'Data Classification Framework', url: '#data-classification', type: 'Framework' }
        ]
      },
      { 
        id: 'backup_procedures_established', 
        text: 'TLS 1.3 encryption for data in transit', 
        required: true,
        completed: false,
        resources: [
          { title: 'Certificate Management Best Practices', url: '#cert-management', type: 'Guide' }
        ]
      }
    ]
  },
  'security_training': {
    title: 'Security Training & Awareness (Article 11.4)',
    items: [
      {
        id: 'phishing_training',
        text: 'Annual phishing awareness training for all employees',
        required: true,
        completed: false,
        resources: [
          { title: 'Phishing Training Materials', url: '#phishing-training', type: 'Training' }
        ]
      },
      {
        id: 'security_awareness_program',
        text: 'Comprehensive security awareness program',
        required: true,
        completed: false,
        resources: [
          { title: 'Security Awareness Framework', url: '#security-awareness', type: 'Framework' }
        ]
      }
    ]
  },
  'incident_management': {
    title: 'Incident Response (Article 12)',
    items: [
      {
        id: 'incident_response_plan_documented',
        text: 'Documented incident response plan',
        required: true,
        completed: false,
        resources: [
          { title: 'Incident Response Template', url: '#incident-response', type: 'Template' }
        ]
      },
      {
        id: 'emergency_contacts_defined',
        text: 'Emergency security contacts designated',
        required: true,
        completed: false,
        resources: [
          { title: 'Emergency Contact List Template', url: '#emergency-contacts', type: 'Template' }
        ]
      }
    ]
  },
  'governance': {
    title: 'Governance & Risk Management (Article 13)',
    items: [
      {
        id: 'security_policy_documented',
        text: 'Documented cybersecurity policies',
        required: true,
        completed: false,
        resources: [
          { title: 'Security Policy Template', url: '#security-policy', type: 'Template' }
        ]
      },
      {
        id: 'risk_assessment_conducted',
        text: 'Regular risk assessments conducted',
        required: true,
        completed: false,
        resources: [
          { title: 'Risk Assessment Framework', url: '#risk-assessment', type: 'Framework' }
        ]
      }
    ]
  }
};

export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com' 
  : 'http://localhost:3001';

export const TAB_CONFIG = [
  { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
  { id: 'compliance', label: 'Compliance', icon: 'CheckCircle' },
  { id: 'incidents', label: 'Incidents', icon: 'AlertTriangle' },
  { id: 'resources', label: 'Resources', icon: 'FileText' }
];

export const QA_QUESTIONS = [
  // Network Security Questions
  {
    id: 1,
    question: "Does your company have a next-generation firewall with intrusion prevention/detection capabilities?",
    category: 'network-security',
    item: 'firewall',
    complianceCategory: 'network-security',
    complianceItemId: 'firewall_implemented',
    type: 'yes-no',
    helpText: "A next-generation firewall with IPS/IDS is essential for blocking sophisticated network attacks and monitoring traffic."
  },
  {
    id: 2,
    question: "Is your network segmented using VLANs to isolate different systems?",
    category: 'network-security',
    item: 'network-segmentation',
    complianceCategory: 'network-security',
    complianceItemId: 'network_monitoring_system',
    type: 'yes-no',
    helpText: "Network segmentation limits the spread of attacks and reduces the impact of security breaches."
  },
  {
    id: 3,
    question: "Are network access control lists (ACLs) properly configured on your infrastructure?",
    category: 'network-security',
    item: 'access-control-lists',
    complianceCategory: 'network-security',
    complianceItemId: 'access_control_lists',
    type: 'yes-no',
    helpText: "ACLs control which users and systems can access specific network resources."
  },
  {
    id: 4,
    question: "Do you use secure VPN with strong encryption for remote access?",
    category: 'network-security',
    item: 'vpn-security',
    complianceCategory: 'network-security',
    complianceItemId: 'vpn_security',
    type: 'yes-no',
    helpText: "Secure VPNs protect remote connections from interception and unauthorized access."
  },
  {
    id: 5,
    question: "Are all wireless networks secured with WPA3 encryption?",
    category: 'network-security',
    item: 'wireless-security',
    complianceCategory: 'network-security',
    complianceItemId: 'wifi_security_configured',
    type: 'yes-no',
    helpText: "WPA3 provides the strongest wireless security protection against modern attack methods."
  },

  // Access Management Questions
  {
    id: 6,
    question: "Is multi-factor authentication (MFA) enabled for all privileged accounts?",
    category: 'access-control',
    item: 'mfa',
    complianceCategory: 'access_management',
    complianceItemId: 'mfa_implemented',
    type: 'yes-no',
    helpText: "MFA adds crucial security layers beyond passwords for administrative and sensitive accounts."
  },
  {
    id: 7,
    question: "Do you have a documented password policy requiring strong passwords?",
    category: 'access-control',
    item: 'password-policy',
    complianceCategory: 'access_management',
    complianceItemId: 'password_policy_documented',
    type: 'yes-no',
    helpText: "Strong password policies (minimum 12 characters, complexity) are fundamental security requirements."
  },
  {
    id: 8,
    question: "How do you manage access to sensitive company data?",
    category: 'access-control',
    item: 'privileged-access',
    complianceCategory: 'access_management',
    complianceItemId: 'mfa_implemented',
    type: 'multiple-choice',
    options: [
      { text: "Role-based access with regular reviews", value: 'yes', points: 1 },
      { text: "Basic access controls in place", value: 'partial', points: 0.5 },
      { text: "Most employees have broad access", value: 'no', points: 0 }
    ],
    helpText: "Access should follow the principle of least privilege with regular access reviews."
  },

  // Data Protection Questions
  {
    id: 9,
    question: "Is sensitive data encrypted at rest using AES-256 or equivalent?",
    category: 'data-protection',
    item: 'data-encryption',
    complianceCategory: 'data_protection',
    complianceItemId: 'data_encryption_implemented',
    type: 'yes-no',
    helpText: "Data encryption at rest protects against unauthorized access to stored information."
  },
  {
    id: 10,
    question: "Is data encrypted in transit using TLS 1.3 or equivalent?",
    category: 'data-protection',
    item: 'transit-encryption',
    complianceCategory: 'data_protection',
    complianceItemId: 'backup_procedures_established',
    type: 'yes-no',
    helpText: "Transit encryption protects data as it moves between systems and networks."
  },
  {
    id: 11,
    question: "Are regular automated backups performed and tested?",
    category: 'data-protection',
    item: 'backup-procedures',
    complianceCategory: 'data_protection',
    complianceItemId: 'backup_procedures_established',
    type: 'yes-no',
    helpText: "Regular, tested backups ensure business continuity and data recovery capabilities."
  },

  // Security Training Questions
  {
    id: 12,
    question: "Do employees receive annual cybersecurity awareness training?",
    category: 'security-training',
    item: 'employee-training',
    complianceCategory: 'security_training',
    complianceItemId: 'phishing_training',
    type: 'yes-no',
    helpText: "Regular security training keeps employees aware of current threats and best practices."
  },
  {
    id: 13,
    question: "How often do you conduct phishing simulation exercises?",
    category: 'security-training',
    item: 'phishing-training',
    complianceCategory: 'security_training',
    complianceItemId: 'phishing_training',
    type: 'multiple-choice',
    options: [
      { text: "Monthly or quarterly", value: 'yes', points: 1 },
      { text: "Annually", value: 'partial', points: 0.7 },
      { text: "Rarely or never", value: 'no', points: 0 }
    ],
    helpText: "Regular phishing simulations help employees recognize and report suspicious emails."
  },
  {
    id: 14,
    question: "Do you have a comprehensive security awareness program?",
    category: 'security-training',
    item: 'security-awareness',
    complianceCategory: 'security_training',
    complianceItemId: 'security_awareness_program',
    type: 'yes-no',
    helpText: "A structured awareness program covers various security topics beyond basic training."
  },

  // Incident Management Questions
  {
    id: 15,
    question: "Do you have a documented incident response plan?",
    category: 'incident-response',
    item: 'incident-plan',
    complianceCategory: 'incident_management',
    complianceItemId: 'incident_response_plan_documented',
    type: 'yes-no',
    helpText: "A documented plan helps your team respond quickly and effectively to security incidents."
  },
  {
    id: 16,
    question: "Are emergency security contacts and escalation procedures defined?",
    category: 'incident-response',
    item: 'emergency-contacts',
    complianceCategory: 'incident_management',
    complianceItemId: 'emergency_contacts_defined',
    type: 'yes-no',
    helpText: "Clear contact procedures ensure rapid response during security emergencies."
  },
  {
    id: 17,
    question: "How quickly can you detect and respond to security incidents?",
    category: 'incident-response',
    item: 'incident-detection',
    complianceCategory: 'incident_management',
    complianceItemId: 'incident_response_plan_documented',
    type: 'multiple-choice',
    options: [
      { text: "Real-time monitoring with automated alerts", value: 'yes', points: 1 },
      { text: "Daily monitoring with manual processes", value: 'partial', points: 0.6 },
      { text: "Reactive detection when problems are reported", value: 'no', points: 0 }
    ],
    helpText: "Faster detection and response minimize the impact of security incidents."
  },

  // Governance Questions
  {
    id: 18,
    question: "Do you have documented cybersecurity policies and procedures?",
    category: 'governance',
    item: 'security-policy',
    complianceCategory: 'governance',
    complianceItemId: 'security_policy_documented',
    type: 'yes-no',
    helpText: "Documented policies provide clear guidelines for security practices across the organization."
  },
  {
    id: 19,
    question: "Do you conduct regular cybersecurity risk assessments?",
    category: 'governance',
    item: 'risk-assessment',
    complianceCategory: 'governance',
    complianceItemId: 'risk_assessment_conducted',
    type: 'yes-no',
    helpText: "Regular risk assessments identify vulnerabilities and guide security improvements."
  },
  {
    id: 20,
    question: "How often do you review and update your security policies?",
    category: 'governance',
    item: 'policy-updates',
    complianceCategory: 'governance',
    complianceItemId: 'security_policy_documented',
    type: 'multiple-choice',
    options: [
      { text: "Annually with incident-driven updates", value: 'yes', points: 1 },
      { text: "Every 2-3 years", value: 'partial', points: 0.6 },
      { text: "Rarely or when problems occur", value: 'no', points: 0 }
    ],
    helpText: "Regular policy reviews ensure security measures stay current with evolving threats."
  },

  // Additional Coverage Questions
  {
    id: 21,
    question: "Do you use antivirus software on all computers and servers?",
    category: 'monitoring',
    item: 'threat-detection',
    complianceCategory: 'network-security',
    complianceItemId: 'firewall_implemented',
    type: 'yes-no',
    helpText: "Antivirus software provides essential protection against malware and known threats."
  },
  {
    id: 22,
    question: "How do you manage software updates and patches?",
    category: 'compliance-governance',
    item: 'change-management',
    complianceCategory: 'governance',
    complianceItemId: 'security_policy_documented',
    type: 'multiple-choice',
    options: [
      { text: "Automated patching with testing", value: 'yes', points: 1 },
      { text: "Manual patching within 30 days", value: 'partial', points: 0.7 },
      { text: "Irregular or delayed patching", value: 'no', points: 0 }
    ],
    helpText: "Timely patching closes security vulnerabilities and reduces attack risk."
  },
  {
    id: 23,
    question: "Do you monitor network traffic and system logs for security threats?",
    category: 'monitoring',
    item: 'security-monitoring',
    complianceCategory: 'network-security',
    complianceItemId: 'network_monitoring_system',
    type: 'yes-no',
    helpText: "Active monitoring helps detect suspicious activities and potential security breaches."
  },
  {
    id: 24,
    question: "Are critical systems backed up and recovery procedures tested?",
    category: 'data-protection',
    item: 'disaster-recovery',
    complianceCategory: 'data_protection',
    complianceItemId: 'backup_procedures_established',
    type: 'yes-no',
    helpText: "Tested backup and recovery procedures ensure business continuity during incidents."
  }
];