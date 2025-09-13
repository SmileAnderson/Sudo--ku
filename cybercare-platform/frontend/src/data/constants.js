// src/data/constants.js - Static data constants
export const COMPLIANCE_CHECKLIST = {
  'network-security': {
    title: 'Network Security (Article 11.1)',
    items: [
      { id: 'firewall', text: 'Next-generation firewall with IPS/IDS capabilities', required: true },
      { id: 'network-segmentation', text: 'Network segmentation with VLAN isolation', required: true },
      { id: 'access-control-lists', text: 'Network access control lists (ACLs) configured', required: true },
      { id: 'vpn-security', text: 'Secure VPN with strong encryption for remote access', required: true },
      { id: 'wireless-security', text: 'WPA3 encryption on all wireless networks', required: true },
      { id: 'network-monitoring', text: '24/7 network traffic monitoring and analysis', required: true },
      { id: 'port-security', text: 'Unused network ports disabled and secured', required: true },
      { id: 'dns-security', text: 'DNS filtering and secure DNS configuration', required: false }
    ]
  },
  'access-control': {
    title: 'Identity & Access Management (Article 11.2)',
    items: [
      { id: 'mfa', text: 'Multi-factor authentication for all privileged accounts', required: true },
      { id: 'password-policy', text: 'Strong password policy (min 12 chars, complexity)', required: true },
      { id: 'privileged-access', text: 'Privileged Access Management (PAM) system', required: true },
      { id: 'access-review', text: 'Quarterly access rights reviews and recertification', required: true },
      { id: 'role-based-access', text: 'Role-based access control (RBAC) implementation', required: true },
      { id: 'session-management', text: 'Automated session timeout and management', required: true },
      { id: 'admin-accounts', text: 'Separate administrative accounts for IT staff', required: true },
      { id: 'guest-access', text: 'Controlled and monitored guest network access', required: false }
    ]
  },
  'data-protection': {
    title: 'Data Protection & Encryption (Article 11.3)',
    items: [
      { id: 'data-encryption', text: 'AES-256 encryption for data at rest', required: true },
      { id: 'transit-encryption', text: 'TLS 1.3 encryption for data in transit', required: true },
      { id: 'backup-encryption', text: 'Encrypted backups with offsite storage', required: true },
      { id: 'data-classification', text: 'Data classification and labeling system', required: true },
      { id: 'data-retention', text: 'Data retention and disposal policies', required: true },
      { id: 'database-security', text: 'Database encryption and access controls', required: true },
      { id: 'email-encryption', text: 'Email encryption for sensitive communications', required: true },
      { id: 'key-management', text: 'Centralized cryptographic key management', required: false }
    ]
  },
  'monitoring': {
    title: 'Security Monitoring & SIEM (Article 11.4)',
    items: [
      { id: 'siem-system', text: 'Security Information and Event Management (SIEM)', required: true },
      { id: 'log-management', text: 'Centralized log collection and retention (12 months)', required: true },
      { id: 'real-time-monitoring', text: '24/7 security operations center (SOC) monitoring', required: true },
      { id: 'threat-detection', text: 'Automated threat detection and response', required: true },
      { id: 'vulnerability-scanning', text: 'Weekly automated vulnerability scans', required: true },
      { id: 'penetration-testing', text: 'Annual penetration testing by certified experts', required: true },
      { id: 'security-metrics', text: 'Security KPIs and dashboard reporting', required: true },
      { id: 'threat-intelligence', text: 'Threat intelligence feeds integration', required: false }
    ]
  },
  'incident-response': {
    title: 'Incident Response (Article 11.5)',
    items: [
      { id: 'incident-plan', text: 'Documented incident response plan and procedures', required: true },
      { id: 'response-team', text: 'Designated incident response team members', required: true },
      { id: 'escalation-procedures', text: 'Clear escalation procedures and contacts', required: true },
      { id: 'forensic-capabilities', text: 'Digital forensics and evidence collection tools', required: true },
      { id: 'communication-plan', text: 'Crisis communication and notification procedures', required: true },
      { id: 'business-continuity', text: 'Business continuity and disaster recovery plans', required: true },
      { id: 'incident-training', text: 'Regular incident response training and drills', required: true },
      { id: 'lessons-learned', text: 'Post-incident review and lessons learned process', required: false }
    ]
  },
  'compliance-governance': {
    title: 'Compliance & Governance (Article 11.6)',
    items: [
      { id: 'security-policy', text: 'Comprehensive cybersecurity policy document', required: true },
      { id: 'risk-assessment', text: 'Annual cybersecurity risk assessments', required: true },
      { id: 'vendor-management', text: 'Third-party vendor security assessments', required: true },
      { id: 'employee-training', text: 'Mandatory cybersecurity awareness training', required: true },
      { id: 'compliance-reporting', text: 'Regular compliance reporting to management', required: true },
      { id: 'audit-trail', text: 'Comprehensive audit trails for all systems', required: true },
      { id: 'change-management', text: 'Formal change management processes', required: true },
      { id: 'privacy-protection', text: 'Personal data protection measures (GDPR)', required: false }
    ]
  }
};

export const TRAINING_QUESTIONS = {
  phishing: [
    {
      question: "You receive an urgent email from your 'bank' asking you to verify your account. What should you do?",
      options: [
        "Click the link immediately to secure your account",
        "Call your bank directly using their official number",
        "Forward the email to your IT department",
        "Reply with your account details"
      ],
      correct: 1,
      explanation: "Always verify requests independently through official channels."
    },
    {
      question: "Which of these is a red flag in a phishing email?",
      options: [
        "Proper company logo",
        "Urgent language with threats",
        "Your correct name in greeting",
        "Professional formatting"
      ],
      correct: 1,
      explanation: "Phishing emails often use urgency and threats to pressure quick action."
    }
  ],
  passwords: [
    {
      question: "What makes a password strong?",
      options: [
        "Using your birthday",
        "12+ characters with mixed types",
        "Your pet's name",
        "Simple words"
      ],
      correct: 1,
      explanation: "Strong passwords are long and use uppercase, lowercase, numbers, and symbols."
    }
  ]
};

export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com' 
  : 'http://localhost:3001';

export const TAB_CONFIG = [
  { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
  { id: 'compliance', label: 'Compliance', icon: 'CheckCircle' },
  { id: 'training', label: 'Training', icon: 'GraduationCap' },
  { id: 'incidents', label: 'Incidents', icon: 'AlertTriangle' },
  { id: 'resources', label: 'Resources', icon: 'FileText' }
];