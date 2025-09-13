// src/components/ComplianceTab.js - Enhanced compliance checklist with resources
import React from 'react';
import { CheckCircle, XCircle, Download, Send, Calendar, ExternalLink, FileText, Shield } from 'lucide-react';
import { styles } from '../styles/styles';
import { useCompliance } from '../hooks/useData';

const COMPLIANCE_CHECKLIST = {
  'network-security': {
    title: 'Network Security (Article 11.1)',
    items: [
      { 
        id: 'firewall', 
        text: 'Next-generation firewall with IPS/IDS capabilities', 
        required: true,
        resources: [
          { title: 'Moldova Firewall Requirements Guide', url: 'https://aboutmoldova.md/en/view_articles_post.php?id=467', type: 'Link' },
          { title: 'Firewall Configuration Template', url: 'https://documentero.com/templates/it-engineering/document/firewall-configuration/', type: 'Link' }
        ]
      },
      { 
        id: 'network-segmentation', 
        text: 'Network segmentation with VLAN isolation', 
        required: true,
        resources: [
          { title: 'Network Segmentation Guide', url: 'https://www.upguard.com/blog/network-segmentation-best-practices', type: 'Link' },
        ]
      },
      { 
        id: 'access-control-lists', 
        text: 'Network access control lists (ACLs) configured', 
        required: true,
        resources: [
          { title: 'ACL Configuration Examples', url: '#acl-examples', type: 'Examples' },
          { title: 'Access Control Policy Template', url: '#acl-policy', type: 'Template' }
        ]
      },
      { 
        id: 'vpn-security', 
        text: 'Secure VPN with strong encryption for remote access', 
        required: true,
        resources: [
          { title: 'Remote Access Policy Template', url: '#vpn-policy', type: 'Template' }
        ]
      },
      { 
        id: 'wireless-security', 
        text: 'WPA3 encryption on all wireless networks', 
        required: true,
        resources: [
          { title: 'Wireless Security Configuration', url: '#wifi-security', type: 'Guide' },
          { title: 'WPA3 Implementation Checklist', url: '#wpa3-checklist', type: 'Checklist' }
        ]
      }
    ]
  },
  'access-control': {
    title: 'Identity & Access Management (Article 11.2)',
    items: [
      { 
        id: 'mfa', 
        text: 'Multi-factor authentication for all privileged accounts', 
        required: true,
        resources: [
          { title: 'MFA Implementation Guide', url: '#mfa-guide', type: 'Guide' },
          { title: 'MFA Policy Template', url: '#mfa-policy', type: 'Template' }
        ]
      },
      { 
        id: 'password-policy', 
        text: 'Strong password policy (min 12 chars, complexity)', 
        required: true,
        resources: [
          { title: 'Password Policy Generator', url: '#password-policy', type: 'Tool' },
        ]
      }
    ]
  },
  'data-protection': {
    title: 'Data Protection & Encryption (Article 11.3)',
    items: [
      { 
        id: 'data-encryption', 
        text: 'AES-256 encryption for data at rest', 
        required: true,
        resources: [
          { title: 'Encryption Implementation Guide', url: '#encryption-guide', type: 'Guide' },
          { title: 'Data Classification Framework', url: '#data-classification', type: 'Framework' }
        ]
      },
      { 
        id: 'transit-encryption', 
        text: 'TLS 1.3 encryption for data in transit', 
        required: true,
        resources: [
          { title: 'Certificate Management Best Practices', url: '#cert-management', type: 'Guide' }
        ]
      }
    ]
  }
};

const ResourceItem = ({ resource }) => (
  <a
    href={resource.url}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      textDecoration: 'none',
      color: '#3b82f6',
      fontSize: '12px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      marginBottom: '4px'
    }}
    onMouseEnter={(e) => {
      e.target.style.backgroundColor = '#f0f9ff';
      e.target.style.borderColor = '#bae6fd';
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = '#f8fafc';
      e.target.style.borderColor = '#e2e8f0';
    }}
  >
    {resource.type === 'PDF' && <FileText size={14} />}
    {resource.type === 'Guide' && <Shield size={14} />}
    {resource.type === 'Template' && <Download size={14} />}
    {!['PDF', 'Guide', 'Template'].includes(resource.type) && <ExternalLink size={14} />}
    <span>{resource.title}</span>
    <span style={{
      backgroundColor: '#e0f2fe',
      color: '#0369a1',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '600'
    }}>
      {resource.type}
    </span>
  </a>
);

const ComplianceTab = () => {
  const { complianceData, loading, updateComplianceCheck } = useCompliance();

  const completedChecks = Object.values(complianceData.checks).filter(Boolean).length;
  const totalChecks = Object.values(COMPLIANCE_CHECKLIST).reduce((sum, category) => sum + category.items.length, 0);
  const completionPercentage = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

  const handleCheckChange = async (category, itemId, checked) => {
    try {
      await updateComplianceCheck(category, itemId, checked);
    } catch (error) {
      console.error('Failed to update compliance check:', error);
    }
  };

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px'}}>
          <div>Loading compliance data...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'}}>
        <div>
          <h3 style={{fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0}}>
            Moldova Cybersecurity Law Compliance
          </h3>
          <p style={{color: '#64748b', margin: '4px 0 0 0'}}>
            Complete checklist based on Law No. 48/2023 requirements
          </p>
        </div>
        <div style={{textAlign: 'right'}}>
          <p style={{fontSize: '14px', color: '#64748b', margin: 0}}>Overall Progress</p>
          <p style={{fontSize: '24px', fontWeight: '700', color: '#3b82f6', margin: '4px 0 0 0'}}>
            {completedChecks}/{totalChecks} ({completionPercentage}%)
          </p>
        </div>
      </div>
      
      {Object.entries(COMPLIANCE_CHECKLIST).map(([categoryKey, category]) => {
        const categoryChecks = category.items.filter(item => 
          complianceData.checks[`${categoryKey}-${item.id}`]
        ).length;
        const categoryProgress = Math.round((categoryChecks / category.items.length) * 100);
        
        return (
          <div key={categoryKey} style={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h4 style={{fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: 0}}>
                {category.title}
              </h4>
              <div style={{textAlign: 'right'}}>
                <span style={{
                  fontSize: '14px',
                  color: categoryProgress === 100 ? '#059669' : categoryProgress >= 50 ? '#d97706' : '#dc2626',
                  fontWeight: '600'
                }}>
                  {categoryChecks}/{category.items.length} completed ({categoryProgress}%)
                </span>
                <div style={{...styles.progressBar, width: '120px', marginTop: '4px'}}>
                  <div style={{...styles.progressFill, width: `${categoryProgress}%`}} />
                </div>
              </div>
            </div>
            <div>
              {category.items.map((item) => {
                const checkKey = `${categoryKey}-${item.id}`;
                const isChecked = complianceData.checks[checkKey] || false;
                
                return (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '20px',
                    padding: '20px',
                    borderRadius: '8px',
                    backgroundColor: isChecked ? '#f0fdf4' : '#fefefe',
                    border: `1px solid ${isChecked ? '#bbf7d0' : '#f1f5f9'}`,
                    transition: 'all 0.2s ease'
                  }}>
                    <input
                      type="checkbox"
                      id={checkKey}
                      checked={isChecked}
                      onChange={(e) => handleCheckChange(categoryKey, item.id, e.target.checked)}
                      style={{marginTop: '2px', transform: 'scale(1.2)'}}
                    />
                    <div style={{flex: 1}}>
                      <label 
                        htmlFor={checkKey} 
                        style={{
                          fontSize: '15px',
                          fontWeight: item.required ? '600' : '500',
                          cursor: 'pointer',
                          color: isChecked ? '#0f172a' : '#374151',
                          display: 'block',
                          marginBottom: '12px'
                        }}
                      >
                        {item.text}
                        {item.required && <span style={{color: '#dc2626', marginLeft: '4px'}}>*</span>}
                      </label>
                      
                      {/* Resources Section */}
                      {item.resources && (
                        <div style={{marginTop: '12px'}}>
                          <p style={{fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px'}}>
                            Implementation Resources:
                          </p>
                          <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                            {item.resources.map((resource, index) => (
                              <ResourceItem key={index} resource={resource} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {isChecked ? (
                      <CheckCircle color="#059669" size={20} />
                    ) : (
                      <XCircle color="#dc2626" size={20} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
        <button style={{...styles.btn, ...styles.btnSuccess}}>
          <Download size={16} />
          Export Compliance Report (PDF)
        </button>
        <button style={{...styles.btn, ...styles.btnPrimary}}>
          <Send size={16} />
          Submit to National Cybersecurity Agency
        </button>
        <button style={{...styles.btn, ...styles.btnSecondary}}>
          <Calendar size={16} />
          Schedule Compliance Review
        </button>
      </div>
    </div>
  );
};

export default ComplianceTab;