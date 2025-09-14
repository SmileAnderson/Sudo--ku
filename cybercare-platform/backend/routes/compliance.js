// routes/compliance.js - Compliance data management
const express = require('express');
const { readData, writeData, updateData } = require('../middleware/dataStorage');
const router = express.Router();
const { authenticateToken } = require('./auth'); // or wherever your auth middleware is located
// src/data/constants.js - Add this to your existing constants
const COMPLIANCE_CHECKLIST = {
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

// Get compliance data
router.get('/', async (req, res) => {
  try {
    const data = await readData('compliance.json');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch compliance data' });
  }
});

// Update compliance check  
router.put('/check', async (req, res) => {
  try {
    const { category, itemId, checked } = req.body;
    
    if (!category || !itemId || typeof checked !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const data = await readData('compliance.json');
    
    if (!data.checks) {
      data.checks = {};
    }
    
    const checkKey = `${category}-${itemId}`;
    data.checks[checkKey] = checked;
    data.lastUpdated = new Date().toISOString();
    
    const totalPossibleChecks = Object.keys(COMPLIANCE_CHECKLIST).reduce((total, categoryKey) => {
      return total + COMPLIANCE_CHECKLIST[categoryKey].items.length;
    }, 0);
    
    const completedChecks = Object.values(data.checks).filter(Boolean).length;
    data.score = Math.round((completedChecks / totalPossibleChecks) * 100);
    
    await writeData('compliance.json', data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update compliance check' });
  }
});

// Export compliance report
router.get('/export', async (req, res) => {
  try {
    const data = await readData('compliance.json');
    
    const report = {
      generatedAt: new Date().toISOString(),
      complianceScore: data.score,
      totalChecks: Object.keys(data.checks).length,
      completedChecks: Object.values(data.checks).filter(Boolean).length,
      checks: data.checks,
      lastScan: data.lastScan,
      recommendations: generateRecommendations(data)
    };
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate compliance report' });
  }
});

// POST /api/compliance/sync-from-assessment
router.post('/sync-from-assessment', async (req, res) => {
  try {
    const { complianceUpdates } = req.body;
    
    const data = await readData('compliance.json');
    
    // Update individual checks in the flat format
    complianceUpdates.forEach(update => {
      const checkKey = `${update.category}-${update.itemId}`;
      data.checks[checkKey] = update.checked;
    });
    
    data.lastUpdated = new Date().toISOString();
    
    // Recalculate score
    const totalPossibleChecks = 24;
    const completedChecks = Object.values(data.checks).filter(Boolean).length;
    data.score = Math.round((completedChecks / totalPossibleChecks) * 100);
    
    await writeData('compliance.json', data);
    res.json({ success: true, updatedItems: complianceUpdates.length });
  } catch (error) {
    res.status(500).json({ error: 'Sync failed' });
  }
});

// Generate recommendations based on compliance data
function generateRecommendations(data) {
  const recommendations = [];
  const incompleteChecks = Object.entries(data.checks)
    .filter(([key, completed]) => !completed)
    .map(([key]) => key);
  
  if (incompleteChecks.length > 0) {
    recommendations.push({
      priority: 'high',
      category: 'Compliance Gaps',
      message: `Complete ${incompleteChecks.length} remaining compliance checks`,
      items: incompleteChecks
    });
  }
  
  if (data.score < 80) {
    recommendations.push({
      priority: 'medium',
      category: 'Score Improvement',
      message: 'Focus on high-impact security measures to improve compliance score'
    });
  }
  
  return recommendations;
}

module.exports = router;