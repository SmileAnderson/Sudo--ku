// src/components/IncidentTab.js - Fixed incident management component
import React, { useState } from 'react';
import { Send, FileText, Download } from 'lucide-react';
import { styles } from '../styles/styles';
import { useIncidents } from '../hooks/useData';

const IncidentForm = ({ onSubmit, isSubmitting }) => {
  const [incident, setIncident] = useState({
    type: 'initial',
    severity: 'medium',
    category: 'data-breach',
    description: '',
    impact: '',
    actions: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!incident.description.trim()) {
      alert('Please provide an incident description');
      return;
    }

    try {
      await onSubmit(incident);
      // Reset form after successful submission
      setIncident({
        type: 'initial',
        severity: 'medium',
        category: 'data-breach',
        description: '',
        impact: '',
        actions: ''
      });
    } catch (error) {
      console.error('Failed to submit incident:', error);
      alert('Failed to submit incident. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setIncident(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#0f172a' }}>
        Incident Reporting (Article 12)
      </h3>
      
      <div style={{
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '24px',
  lineHeight: 1.6
}}>
  <p style={{
    fontSize: '14px',
    color: '#475569',
    margin: 0
  }}>
    If something goes wrong with your business online — like your <strong>website gets hacked</strong> or <strong>customer information is stolen</strong> — you need to tell the authorities right away. This is called <strong>incident reporting</strong>. It helps experts act fast to fix the problem and stop more damage. Reporting <strong>serious problems quickly</strong> protects your business, your customers, and the whole community. It's a way of asking for help when you need it the most, and by doing it, you also <strong>follow the law</strong>.
  </p>
</div>
      <form onSubmit={handleSubmit}>
        <div style={{...styles.grid2, marginBottom: '20px'}}>
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
              Report Type
            </label>
            <select 
              style={styles.input}
              value={incident.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
            >
              <option value="initial">Initial Notification (24h)</option>
              <option value="update">Update Report (72h)</option>
              <option value="final">Final Report (30 days)</option>
            </select>
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
              Severity Level
            </label>
            <select 
              style={styles.input}
              value={incident.severity}
              onChange={(e) => handleInputChange('severity', e.target.value)}
            >
              <option value="low">Low Impact</option>
              <option value="medium">Medium Impact</option>
              <option value="high">High Impact (Significant)</option>
              <option value="critical">Critical Impact (Major)</option>
            </select>
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
              Incident Category
            </label>
            <select 
              style={styles.input}
              value={incident.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="data-breach">Personal Data Breach</option>
              <option value="malware">Malware/Ransomware</option>
              <option value="unauthorized-access">Unauthorized Access</option>
              <option value="service-disruption">Service Disruption</option>
              <option value="phishing">Phishing Attack</option>
              <option value="ddos">DDoS Attack</option>
              <option value="insider-threat">Insider Threat</option>
              <option value="other">Other Security Incident</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
            Incident Description *
          </label>
          <textarea 
            style={{...styles.input, height: '100px', resize: 'vertical', fontFamily: 'inherit'}}
            placeholder="Provide a detailed description of the security incident..."
            value={incident.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
            Business Impact Assessment
          </label>
          <textarea 
            style={{...styles.input, height: '100px', resize: 'vertical', fontFamily: 'inherit'}}
            placeholder="Describe impact on operations, affected systems, number of affected persons..."
            value={incident.impact}
            onChange={(e) => handleInputChange('impact', e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
            Remediation Actions Taken
          </label>
          <textarea 
            style={{...styles.input, height: '100px', resize: 'vertical', fontFamily: 'inherit'}}
            placeholder="Describe immediate containment and remediation actions..."
            value={incident.actions}
            onChange={(e) => handleInputChange('actions', e.target.value)}
          />
        </div>
        <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
        <button style={{...styles.btn, ...styles.btnSuccess}}>
          <Download size={16} />
          Export Incident Report (PDF)
        </button>

        <button 
          type="submit"
          disabled={isSubmitting}
          style={{
            ...styles.btn, 
            ...styles.btnPrimary,
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          <Send size={16} />
          {isSubmitting ? 'Submitting...' : 'Submit Incident Report to National Agency'}
        </button>
        </div>
      </form>
    </div>
  );
};

const IncidentTab = () => {
  const { incidents, loading, createIncident, error } = useIncidents();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIncidentSubmit = async (incidentData) => {
    setIsSubmitting(true);
    try {
      await createIncident(incidentData);
    } catch (error) {
      throw error; // Re-throw to be handled by the form
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.card}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px'}}>
          <div>Loading incident data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.card}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#dc2626'}}>
          <div>Error loading incidents: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <IncidentForm onSubmit={handleIncidentSubmit} isSubmitting={isSubmitting} />
      
      {incidents && incidents.length > 0 && (
        <div style={styles.card}>
          <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#0f172a'}}>
            Incident Report History
          </h3>
          <div>
            {incidents.map((incident) => (
              <div key={incident.id} style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '16px',
                backgroundColor: '#fefefe'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px'}}>
                  <div style={{flex: 1}}>
                    <h4 style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px', textTransform: 'capitalize', color: '#0f172a'}}>
                      {incident.category ? incident.category.replace('-', ' ') : 'Security Incident'}
                    </h4>
                    <p style={{fontSize: '14px', color: '#64748b', marginBottom: '8px', lineHeight: 1.5}}>
                      {incident.description || 'No description available'}
                    </p>
                    <div style={{display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap'}}>
                      <p style={{fontSize: '12px', color: '#94a3b8', margin: 0}}>
                        <strong>Type:</strong> {incident.type || 'initial'} report
                      </p>
                      <p style={{fontSize: '12px', color: '#94a3b8', margin: 0}}>
                        <strong>Submitted:</strong> {incident.reportDate || new Date().toLocaleString()}
                      </p>
                      <p style={{fontSize: '12px', color: '#94a3b8', margin: 0}}>
                        <strong>Status:</strong> {incident.status || 'open'}
                      </p>
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      ...(incident.severity === 'critical' ? {backgroundColor: '#fee2e2', color: '#991b1b'} :
                         incident.severity === 'high' ? {backgroundColor: '#fed7aa', color: '#9a3412'} :
                         incident.severity === 'medium' ? {backgroundColor: '#fef3c7', color: '#92400e'} :
                         {backgroundColor: '#dcfce7', color: '#166534'})
                    }}>
                      {incident.severity ? incident.severity.toUpperCase() : 'MEDIUM'}
                    </span>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                      padding: '4px'
                    }}>
                      <FileText size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {incidents && incidents.length === 0 && !loading && (
        <div style={styles.card}>
          <div style={{textAlign: 'center', padding: '40px', color: '#64748b'}}>
            <p>No incidents reported yet.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentTab;