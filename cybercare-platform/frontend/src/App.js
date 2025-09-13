// src/App.js - Complete modified application with authentication
import React, { useState, useEffect } from 'react';
import { HelpCircle, LogOut } from 'lucide-react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ComplianceTab from './components/ComplianceTab';
import TrainingTab from './components/TrainingTab';
import IncidentTab from './components/IncidentTab';
import ResourcesTab from './components/ResourcesTab';
import QAPage from './components/QAPage';
import Login from './components/Login';
import { styles } from './styles/styles';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Invalid stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
      setIsAuthenticated(false);
      setActiveTab('dashboard');
    }
  };

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .spinning { animation: spin 1s linear infinite; }
      
      @media (max-width: 768px) {
        .nav-responsive {
          flex-direction: column !important;
        }
        .nav-btn-responsive {
          min-width: auto !important;
          flex: none !important;
        }
        .grid-responsive {
          grid-template-columns: 1fr !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Enhanced navigation with Q&A tab
  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { id: 'compliance', label: 'Compliance', icon: 'CheckCircle' },
    { id: 'qa', label: 'Quick Assessment', icon: 'HelpCircle' },
    { id: 'training', label: 'Training', icon: 'GraduationCap' },
    { id: 'incidents', label: 'Incidents', icon: 'AlertTriangle' },
    { id: 'resources', label: 'Resources', icon: 'FileText' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'compliance':
        return <ComplianceTab />;
      case 'qa':
        return <QAPage />;
      case 'training':
        return <TrainingTab />;
      case 'incidents':
        return <IncidentTab />;
      case 'resources':
        return <ResourcesTab />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  // Enhanced Header component with logout
  const EnhancedHeader = () => (
    <header style={styles.header}>
      <div style={styles.headerContent}>
        <div style={styles.logo}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#3b82f6',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{color: 'white', fontWeight: 'bold', fontSize: '18px'}}>C</span>
          </div>
          <div>
            <h1 style={styles.logoText}>CyberCare</h1>
            <p style={styles.logoSubtext}>Moldova Cybersecurity Law Compliance Platform</p>
          </div>
        </div>
        
        <div style={styles.headerRight}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            {user && (
              <div style={{textAlign: 'right', marginRight: '12px'}}>
                <p style={{fontSize: '14px', fontWeight: '600', margin: 0, color: '#0f172a'}}>
                  {user.companyName}
                </p>
                <p style={{fontSize: '12px', color: '#64748b', margin: 0}}>
                  {user.email}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              style={{
                ...styles.btn,
                ...styles.btnSecondary,
                padding: '8px 12px',
                fontSize: '12px'
              }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
          <span style={styles.lawText}>Law No. 142/2023</span>
          <button style={styles.supportBtn}>
            Contact Support
          </button>
        </div>
      </div>
    </header>
  );

  // Enhanced Navigation with Q&A tab
  const EnhancedNavigation = ({ activeTab, setActiveTab }) => {
    const iconMap = {
      BarChart3: () => <span>📊</span>,
      CheckCircle: () => <span>✅</span>,
      HelpCircle: () => <HelpCircle size={18} />,
      GraduationCap: () => <span>🎓</span>,
      AlertTriangle: () => <span>⚠️</span>,
      FileText: () => <span>📄</span>
    };

    return (
      <nav style={styles.nav}>
        {navigationTabs.map((tab) => {
          const IconComponent = iconMap[tab.icon];
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.navBtn,
                ...(activeTab === tab.id ? styles.navBtnActive : styles.navBtnInactive)
              }}
            >
              <IconComponent />
              {tab.label}
            </button>
          );
        })}
      </nav>
    );
  };

  if (isLoading) {
    return (
      <div style={{
        ...styles.container,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{textAlign: 'center'}}>
          <div className="spinning" style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            margin: '0 auto 16px'
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{
      ...styles.container,
      borderBottom: 'none' // Remove any border that causes black line
    }}>
      <EnhancedHeader />
      
      <div style={styles.main}>
        <EnhancedNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main>
          {renderTabContent()}
        </main>
      </div>

      {/* Fixed Footer with working links */}
      <footer style={{
        backgroundColor: '#1e293b', 
        color: 'white', 
        marginTop: '80px',
        borderTop: 'none' // Remove border that could cause black line
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px'
        }}>
          <div>
            <h4 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#f8fafc'}}>
              CyberCare Platform
            </h4>
            <p style={{fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6}}>
              Comprehensive RegTech solution helping Moldovan businesses achieve full compliance with Cybersecurity Law No. 142/2023 through automated assessments, employee training, and intelligent monitoring.
            </p>
          </div>
          <div>
            <h4 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#f8fafc'}}>
              Platform Features
            </h4>
            <button 
              onClick={() => setActiveTab('dashboard')} 
              style={{
                display: 'block', 
                fontSize: '14px', 
                color: '#cbd5e1', 
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '2px 0',
                marginBottom: '8px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            >
              Automated Security Audits
            </button>
            <button 
              onClick={() => setActiveTab('training')} 
              style={{
                display: 'block', 
                fontSize: '14px', 
                color: '#cbd5e1', 
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '2px 0',
                marginBottom: '8px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            >
              Professional Training Programs
            </button>
            <button 
              onClick={() => setActiveTab('qa')} 
              style={{
                display: 'block', 
                fontSize: '14px', 
                color: '#cbd5e1', 
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '2px 0',
                marginBottom: '8px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            >
              AI-Powered Risk Assessment
            </button>
            <button 
              onClick={() => setActiveTab('compliance')} 
              style={{
                display: 'block', 
                fontSize: '14px', 
                color: '#cbd5e1', 
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '2px 0',
                marginBottom: '8px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            >
              Real-time Compliance Monitoring
            </button>
          </div>
          <div>
            <h4 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#f8fafc'}}>
              Support & Resources
            </h4>
            <button 
              onClick={() => setActiveTab('resources')} 
              style={{
                display: 'block', 
                fontSize: '14px', 
                color: '#cbd5e1', 
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '2px 0',
                marginBottom: '8px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            >
              Expert Consultation
            </button>
            <button 
              onClick={() => setActiveTab('resources')} 
              style={{
                display: 'block', 
                fontSize: '14px', 
                color: '#cbd5e1', 
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '2px 0',
                marginBottom: '8px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            >
              Technical Documentation
            </button>
            <button 
              onClick={() => setActiveTab('compliance')} 
              style={{
                display: 'block', 
                fontSize: '14px', 
                color: '#cbd5e1', 
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                padding: '2px 0',
                marginBottom: '8px',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#f8fafc'}
              onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            >
              Compliance Templates
            </button>
            <a href="tel:+37322123456" style={{
              display: 'block', 
              fontSize: '14px', 
              color: '#cbd5e1', 
              textDecoration: 'none',
              padding: '2px 0',
              marginBottom: '8px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#f8fafc'}
            onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
            >
              24/7 Emergency Support
            </a>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid #475569',
          marginTop: '32px',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#94a3b8',
          maxWidth: '1200px',
          margin: '32px auto 0',
          padding: '20px'
        }}>
          © 2025 CyberCare by Sudo -ku. Moldova National Cybersecurity Agency Certified Platform.
        </div>
      </footer>
    </div>
  );
};

export default App;