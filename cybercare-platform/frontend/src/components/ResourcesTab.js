// src/components/ResourcesTab.js - Resources and documentation component
import React from 'react';
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  Briefcase, 
  Settings, 
  Download, 
  Brain, 
  Activity, 
  AlertCircle, 
  Calendar, 
  Mail, 
  Smartphone 
} from 'lucide-react';
import { styles } from '../styles/styles';

const ResourcesTab = () => {
  return (
    <div>
      {/* Essential Resources */}
      <div style={styles.card}>
        <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#0f172a'}}>
          Essential Resources & Documentation
        </h3>
        
        <div style={styles.grid2}>
          <div style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#fefefe'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
              <div style={{padding: '8px', backgroundColor: '#dbeafe', borderRadius: '8px'}}>
                <FileText color="#3b82f6" size={20} />
              </div>
              <h4 style={{fontSize: '18px', fontWeight: '600', margin: 0, color: '#0f172a'}}>
                Moldova Cybersecurity Law
              </h4>
            </div>
            <p style={{fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: 1.6}}>
              Complete text of Law No. 142/2023 and official implementation guidelines from the National Cybersecurity Agency
            </p>
            <a href="#" style={{color: '#3b82f6', textDecoration: 'none', fontWeight: '500', fontSize: '14px'}}>
              View on legis.md →
            </a>
          </div>
          
          <div style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#fefefe'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
              <div style={{padding: '8px', backgroundColor: '#fef3c7', borderRadius: '8px'}}>
                <Shield color="#f59e0b" size={20} />
              </div>
              <h4 style={{fontSize: '18px', fontWeight: '600', margin: 0, color: '#0f172a'}}>
                Article 11: Security Measures
              </h4>
            </div>
            <p style={{fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: 1.6}}>
              Detailed breakdown of mandatory cybersecurity measures that businesses must implement for compliance
            </p>
            <a href="#" style={{color: '#3b82f6', textDecoration: 'none', fontWeight: '500', fontSize: '14px'}}>
              Download Implementation Guide →
            </a>
          </div>

          <div style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#fefefe'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
              <div style={{padding: '8px', backgroundColor: '#fee2e2', borderRadius: '8px'}}>
                <AlertTriangle color="#dc2626" size={20} />
              </div>
              <h4 style={{fontSize: '18px', fontWeight: '600', margin: 0, color: '#0f172a'}}>
                Article 12: Incident Notification
              </h4>
            </div>
            <p style={{fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: 1.6}}>
              Step-by-step process for reporting cybersecurity incidents, including timelines and required information
            </p>
            <a href="#" style={{color: '#3b82f6', textDecoration: 'none', fontWeight: '500', fontSize: '14px'}}>
              View Reporting Templates →
            </a>
          </div>

          <div style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#fefefe'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
              <div style={{padding: '8px', backgroundColor: '#dcfce7', borderRadius: '8px'}}>
                <Briefcase color="#059669" size={20} />
              </div>
              <h4 style={{fontSize: '18px', fontWeight: '600', margin: 0, color: '#0f172a'}}>
                SME Best Practices Guide
              </h4>
            </div>
            <p style={{fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: 1.6}}>
              Plain-language cybersecurity recommendations specifically designed for small and medium enterprises
            </p>
            <a href="#" style={{color: '#3b82f6', textDecoration: 'none', fontWeight: '500', fontSize: '14px'}}>
              Download PDF Guide →
            </a>
          </div>

          <div style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#fefefe'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
              <div style={{padding: '8px', backgroundColor: '#f3e8ff', borderRadius: '8px'}}>
                <Settings color="#8b5cf6" size={20} />
              </div>
              <h4 style={{fontSize: '18px', fontWeight: '600', margin: 0, color: '#0f172a'}}>
                Technical Implementation
              </h4>
            </div>
            <p style={{fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: 1.6}}>
              Technical documentation for IT professionals on implementing required security controls and monitoring
            </p>
            <a href="#" style={{color: '#3b82f6', textDecoration: 'none', fontWeight: '500', fontSize: '14px'}}>
              Access Technical Docs →
            </a>
          </div>

          <div style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', backgroundColor: '#fefefe'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
              <div style={{padding: '8px', backgroundColor: '#f0fdf4', borderRadius: '8px'}}>
                <Download color="#059669" size={20} />
              </div>
              <h4 style={{fontSize: '18px', fontWeight: '600', margin: 0, color: '#0f172a'}}>
                Compliance Templates
              </h4>
            </div>
            <p style={{fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: 1.6}}>
              Ready-to-use templates for policies, incident response plans, and compliance documentation
            </p>
            <a href="#" style={{color: '#3b82f6', textDecoration: 'none', fontWeight: '500', fontSize: '14px'}}>
              Browse Template Library →
            </a>
          </div>
        </div>
      </div>

      {/* Industry-Specific Guidance */}
      <div style={styles.card}>
        <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#0f172a'}}>
          Industry-Specific Compliance Guidance
        </h3>
        
        <div style={styles.grid4}>
          {[
            { icon: '🏦', title: 'Financial Services', desc: 'Banking & financial compliance requirements' },
            { icon: '🏥', title: 'Healthcare', desc: 'Medical data protection & HIPAA alignment' },
            { icon: '🏭', title: 'Manufacturing', desc: 'Industrial IoT & OT security guidelines' },
            { icon: '🛒', title: 'E-Commerce', desc: 'Online retail & payment security standards' },
            { icon: '📚', title: 'Education', desc: 'Educational institution data protection' },
            { icon: '🏛️', title: 'Government', desc: 'Public sector cybersecurity frameworks' }
          ].map((industry, index) => (
            <div key={index} style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#fefefe',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              <div style={{fontSize: '24px', marginBottom: '8px'}}>{industry.icon}</div>
              <h4 style={{fontSize: '14px', fontWeight: '600', marginBottom: '4px', color: '#0f172a'}}>
                {industry.title}
              </h4>
              <p style={{fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.4}}>
                {industry.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Powered Features */}
      <div style={styles.card}>
        <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#0f172a'}}>
          AI-Powered Compliance Assistant
        </h3>
        
        <div style={styles.grid2}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h4 style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'white'}}>
              Smart Risk Assessment
            </h4>
            <p style={{fontSize: '14px', marginBottom: '16px', color: 'rgba(255,255,255,0.9)'}}>
              AI analyzes your infrastructure and provides personalized compliance recommendations
            </p>
            <button style={{
              ...styles.btn,
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <Brain size={16} />
              Start AI Assessment
            </button>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h4 style={{fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: 'white'}}>
              Automated Monitoring
            </h4>
            <p style={{fontSize: '14px', marginBottom: '16px', color: 'rgba(255,255,255,0.9)'}}>
              Continuous compliance monitoring with intelligent alerting and reporting
            </p>
            <button style={{
              ...styles.btn,
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <Activity size={16} />
              Enable Monitoring
            </button>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h4 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#0c4a6e',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertCircle size={24} />
          Need Expert Assistance?
        </h4>
        <p style={{
          fontSize: '16px',
          color: '#0369a1',
          marginBottom: '20px',
          lineHeight: 1.6
        }}>
          Our certified cybersecurity experts provide comprehensive support to help your business achieve and maintain full compliance with Moldova's cybersecurity requirements.
        </p>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px'}}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '24px', marginBottom: '8px'}}>🎯</div>
            <h5 style={{fontSize: '14px', fontWeight: '600', color: '#0c4a6e', margin: '0 0 4px 0'}}>
              Free Consultation
            </h5>
            <p style={{fontSize: '12px', color: '#0369a1', margin: 0}}>
              Initial compliance assessment
            </p>
          </div>
          
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '24px', marginBottom: '8px'}}>📊</div>
            <h5 style={{fontSize: '14px', fontWeight: '600', color: '#0c4a6e', margin: '0 0 4px 0'}}>
              Gap Analysis
            </h5>
            <p style={{fontSize: '12px', color: '#0369a1', margin: 0}}>
              Detailed compliance review
            </p>
          </div>
          
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '24px', marginBottom: '8px'}}>⚡</div>
            <h5 style={{fontSize: '14px', fontWeight: '600', color: '#0c4a6e', margin: '0 0 4px 0'}}>
              Implementation
            </h5>
            <p style={{fontSize: '12px', color: '#0369a1', margin: 0}}>
              Complete solution deployment
            </p>
          </div>
          
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '24px', marginBottom: '8px'}}>🛡️</div>
            <h5 style={{fontSize: '14px', fontWeight: '600', color: '#0c4a6e', margin: '0 0 4px 0'}}>
              Ongoing Support
            </h5>
            <p style={{fontSize: '12px', color: '#0369a1', margin: 0}}>
              24/7 monitoring & updates
            </p>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
          <button style={{...styles.btn, ...styles.btnPrimary}}>
            <Calendar size={16} />
            Schedule Free Consultation
          </button>
          <button style={{...styles.btn, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}>
            <Mail size={16} />
            Contact Expert Team
          </button>
          <button style={{...styles.btn, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}>
            <Smartphone size={16} />
            Call: +373 (22) 123-456
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourcesTab;