// src/App.js - Complete modified application with authentication
import React, { useState, useEffect } from 'react';
import { HelpCircle, LogOut, BarChart3, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ComplianceTab from './components/ComplianceTab';
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
  const [complianceData, setComplianceData] = useState(null);

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

  const handleComplianceUpdate = (updates) => {
  // Update compliance data when assessment syncs
  setComplianceData(prev => {
    if (!prev) return prev;
    
    const newData = { ...prev };
    
    updates.forEach(update => {
      if (newData.categories && newData.categories[update.category]) {
        const item = newData.categories[update.category].items.find(
          item => item.id === update.itemId
        );
        if (item) {
          item.completed = update.checked;
          item.syncedFromAssessment = update.syncedFromAssessment;
          item.syncTimestamp = update.syncTimestamp;
        }
      }
    });
    
    return newData;
  });
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

  // Enhanced navigation without icons in the navigation tabs
  const navigationTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'compliance', label: 'Compliance', icon: CheckCircle },
    { id: 'qa', label: 'Quick Assessment', icon: HelpCircle },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'resources', label: 'Resources', icon: FileText }
  ];

  const renderTabContent = () => {
  switch (activeTab) {
    case 'dashboard':
      return <Dashboard setActiveTab={setActiveTab} />;
    case 'compliance':
      return (
        <ComplianceTab 
          complianceData={complianceData}
          onComplianceDataChange={setComplianceData}
        />
      );
    case 'qa':
      return (
        <QAPage 
          onUpdateCompliance={handleComplianceUpdate}
        />
      );
    case 'incidents':
      return <IncidentTab />;
    case 'resources':
      return <ResourcesTab />;
    default:
      return <Dashboard setActiveTab={setActiveTab} />;
  }
};

  // Enhanced Navigation with Q&A tab
  const EnhancedNavigation = ({ activeTab, setActiveTab }) => {
    return (
      <nav style={styles.nav}>
        {navigationTabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.navBtn,
                ...(activeTab === tab.id ? styles.navBtnActive : styles.navBtnInactive)
              }}
            >
              {IconComponent && <IconComponent size={18} />}
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
      <Header user={user} onLogout={handleLogout} />
      
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
              Comprehensive RegTech solution helping Moldovan businesses achieve full compliance with Cybersecurity Law No. 48/2023 through automated assessments, employee training, and intelligent monitoring.
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
              Data Retention Policy
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