// src/components/Dashboard.js - Dashboard component
import React from 'react';
import { 
  Shield, 
  AlertTriangle, 
  BarChart3, 
  GraduationCap, 
  RefreshCw, 
  AlertCircle, 
  FileCheck, 
  Bell,
  HelpCircle 
} from 'lucide-react';
import { styles } from '../styles/styles';
import { useCompliance, useAudit, useNotifications } from '../hooks/useData';

const Dashboard = ({ setActiveTab }) => {
  const { complianceData } = useCompliance();
  const { auditResults, riskAssessment, isScanning, startAudit } = useAudit();
  const { notifications } = useNotifications();

  const getComplianceStatus = (score) => {
    if (score >= 80) return { 
      color: '#059669', 
      bg: '#dcfce7', 
      label: 'Good Compliance',
      badgeStyle: styles.badgeGood 
    };
    if (score >= 60) return { 
      color: '#d97706', 
      bg: '#fef3c7', 
      label: 'Needs Improvement',
      badgeStyle: styles.badgeWarning 
    };
    return { 
      color: '#dc2626', 
      bg: '#fee2e2', 
      label: 'Critical Issues',
      badgeStyle: styles.badgeCritical 
    };
  };

  const status = getComplianceStatus(complianceData.score);

  return (
    <div>
      {/* Key Metrics */}
      <div style={styles.grid3}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.metricLabel}>Compliance Score</p>
              <p style={{...styles.metric, color: status.color}}>{complianceData.score}%</p>
              <span style={{...styles.badge, ...status.badgeStyle}}>
                {status.label}
              </span>
            </div>
            <BarChart3 color={status.color} size={28} />
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.metricLabel}>Risk Score</p>
              <p style={{...styles.metric, color: '#ea580c'}}>
                {auditResults?.riskScore || '—'}/10
              </p>
              <p style={{...styles.metricLabel, marginTop: '8px'}}>Current risk level</p>
            </div>
            <AlertTriangle color="#ea580c" size={28} />
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.metricLabel}>Training Progress</p>
              <p style={{...styles.metric, color: '#8b5cf6'}}>
              </p>
              <p style={{...styles.metricLabel, marginTop: '8px'}}>Modules completed</p>
            </div>
            <GraduationCap color="#8b5cf6" size={28} />
          </div>
        </div>
      </div>

     /* Quick Actions */
<div style={styles.card}>
  <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#0f172a'}}>
    Quick Actions
  </h3>
  <div style={styles.grid4}>
    <button 
      onClick={startAudit}
      disabled={isScanning}
      style={{
        ...styles.btn, 
        ...styles.btnPrimary, 
        justifyContent: 'center', 
        padding: '16px',
        opacity: isScanning ? 0.6 : 1
      }}
    >
      <RefreshCw size={20} className={isScanning ? 'spinning' : ''} />
      <div>
        <div style={{fontWeight: '600'}}>
          {isScanning ? 'Scanning...' : 'Run Security Audit'}
        </div>
        <div style={{fontSize: '12px', opacity: 0.8}}>Full system scan</div>
      </div>
    </button>
    
    <button
      onClick={() => setActiveTab('qa')}
      style={{...styles.btn, ...styles.btnAccent, justifyContent: 'center', padding: '16px'}}
    >
      <HelpCircle size={20} />
      <div>
        <div style={{fontWeight: '600'}}>Quick Assessment</div>
        <div style={{fontSize: '12px', opacity: 0.8}}>Initial risk check</div>
      </div>
    </button>
    
    <button 
      onClick={() => setActiveTab('compliance')}
      style={{...styles.btn, ...styles.btnSecondary, justifyContent: 'center', padding: '16px'}}
    >
      <FileCheck size={20} />
      <div>
        <div style={{fontWeight: '600'}}>Review Compliance</div>
        <div style={{fontSize: '12px', opacity: 0.8}}>Check requirements</div>
      </div>
    </button>
    
    <button 
      onClick={() => setActiveTab('incidents')}
      style={{...styles.btn, ...styles.btnWarning, justifyContent: 'center', padding: '16px'}}
    >
      <AlertCircle size={20} />
      <div>
        <div style={{fontWeight: '600'}}>Report Incident</div>
        <div style={{fontSize: '12px', opacity: 0.8}}>Emergency response</div>
      </div>
    </button>
  </div>
</div>

      {/* Audit Results */}
      {auditResults && (
        <div style={styles.card}>
          <h3 style={{
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#0f172a'
          }}>
            <Shield size={24} />
            Security Audit Results
          </h3>
          
          {auditResults.loading ? (
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px'}}>
              <RefreshCw className="spinning" size={24} />
              <span style={{marginLeft: '12px'}}>Scanning infrastructure...</span>
            </div>
          ) : (
            <>
              {/* Security Metrics */}
              <div style={{...styles.grid4, marginBottom: '24px'}}>
                <div style={{...styles.riskCard, ...styles.riskLow}}>
                  <h4 style={{color: '#166534', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0'}}>
                    Network Security
                  </h4>
                  <p style={{fontSize: '14px', color: '#166534', margin: 0}}>
                    Firewall active, minimal exposure
                  </p>
                </div>
                
                <div style={{...styles.riskCard, ...styles.riskMedium}}>
                  <h4 style={{color: '#92400e', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0'}}>
                    Web Security
                  </h4>
                  <p style={{fontSize: '14px', color: '#92400e', margin: 0}}>
                    Missing security headers
                  </p>
                </div>
                
                <div style={{...styles.riskCard, ...styles.riskHigh}}>
                  <h4 style={{color: '#991b1b', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0'}}>
                    Vulnerabilities
                  </h4>
                  <p style={{fontSize: '14px', color: '#991b1b', margin: 0}}>
                    {auditResults.results?.vulnerabilities?.high || 0} high priority issues
                  </p>
                </div>
                
                <div style={{...styles.riskCard, ...styles.riskLow}}>
                  <h4 style={{color: '#166534', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0'}}>
                    Encryption
                  </h4>
                  <p style={{fontSize: '14px', color: '#166534', margin: 0}}>
                    TLS 1.3 properly configured
                  </p>
                </div>
              </div>

              {/* Risk Assessment */}
              {riskAssessment && (
                <div style={{marginBottom: '24px'}}>
                  <h4 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#0f172a'}}>
                    Risk Assessment & Recommendations
                  </h4>
                  {riskAssessment.map(risk => (
                    <div key={risk.id} style={{
                      ...styles.riskCard,
                      ...(risk.severity === 'High' ? styles.riskHigh : 
                         risk.severity === 'Medium' ? styles.riskMedium : styles.riskLow)
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                        <h5 style={{fontSize: '16px', fontWeight: '600', margin: 0}}>{risk.risk}</h5>
                        <span style={{
                          ...styles.badge,
                          ...(risk.severity === 'High' ? styles.badgeCritical : 
                             risk.severity === 'Medium' ? styles.badgeWarning : styles.badgeGood)
                        }}>
                          {risk.severity}
                        </span>
                      </div>
                      <p style={{fontSize: '14px', marginBottom: '8px', opacity: 0.8}}>
                        <strong>Impact:</strong> {risk.impact}
                      </p>
                      <p style={{fontSize: '14px', marginBottom: '8px', opacity: 0.8}}>
                        <strong>Likelihood:</strong> {risk.likelihood}
                      </p>
                      <p style={{fontSize: '14px', fontWeight: '500'}}>
                        <strong>Recommendation:</strong> {risk.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Recent Notifications */}
      <div style={styles.card}>
        <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#0f172a'}}>
          Recent Notifications
        </h3>
        {notifications.slice(0, 5).map(notification => (
          <div key={notification.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: notification.type === 'critical' ? '#fef2f2' : 
                           notification.type === 'warning' ? '#fffbeb' : '#f0f9ff',
            marginBottom: '8px'
          }}>
            <div style={{
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: notification.type === 'critical' ? '#dc2626' : 
                             notification.type === 'warning' ? '#f59e0b' : '#3b82f6'
            }}>
              <Bell size={14} color="white" />
            </div>
            <div style={{flex: 1}}>
              <p style={{fontSize: '14px', fontWeight: '500', margin: 0}}>{notification.message}</p>
              <p style={{fontSize: '12px', color: '#64748b', margin: 0}}>{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;