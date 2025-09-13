import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Download, 
  Send,
  Globe,
  Lock,
  Mail,
  Server,
  Eye,
  Users,
  Database,
  Activity,
  Settings,
  RefreshCw,
  BarChart3,
  Clock,
  AlertCircle,
  GraduationCap,
  Trophy,
  Target,
  Zap,
  Brain,
  Award,
  Star,
  Play,
  ChevronRight,
  Calendar,
  Bell,
  TrendingUp,
  FileCheck,
  Smartphone,
  Wifi,
  HardDrive,
  Building,
  CreditCard,
  ShoppingCart,
  Briefcase
} from 'lucide-react';

const CyberCareApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [complianceData, setComplianceData] = useState({
    score: 0,
    checks: {},
    lastScan: null
  });
  const [incidents, setIncidents] = useState([]);
  const [auditResults, setAuditResults] = useState(null);
  const [trainingData, setTrainingData] = useState({
    completedModules: [],
    currentScore: 0,
    streak: 0,
    badges: []
  });
  const [currentGame, setCurrentGame] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', message: 'Password policy review due in 7 days', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'New cybersecurity training module available', time: '1 day ago' },
    { id: 3, type: 'critical', message: '2 high-priority vulnerabilities detected', time: '3 days ago' }
  ]);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#1e293b'
    },
    header: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '16px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    logoText: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#0f172a',
      margin: 0,
      lineHeight: 1.2
    },
    logoSubtext: {
      fontSize: '14px',
      color: '#64748b',
      margin: 0,
      lineHeight: 1.2
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap'
    },
    notificationBell: {
      position: 'relative',
      padding: '8px',
      backgroundColor: '#f1f5f9',
      borderRadius: '50%',
      cursor: 'pointer',
      border: 'none'
    },
    notificationBadge: {
      position: 'absolute',
      top: '2px',
      right: '2px',
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '50%',
      width: '16px',
      height: '16px',
      fontSize: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    lawText: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '500'
    },
    supportBtn: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 20px'
    },
    nav: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginBottom: '32px',
      display: 'flex',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      flexWrap: 'wrap'
    },
    navBtn: {
      flex: 1,
      minWidth: '120px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '16px 12px',
      border: 'none',
      backgroundColor: 'transparent',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap'
    },
    navBtnActive: {
      color: '#3b82f6',
      backgroundColor: '#f0f9ff',
      borderBottom: '3px solid #3b82f6'
    },
    navBtnInactive: {
      color: '#64748b'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '24px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      marginBottom: '24px'
    },
    grid3: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    grid4: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px'
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px'
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    metric: {
      fontSize: '36px',
      fontWeight: '700',
      margin: '8px 0 4px 0',
      lineHeight: 1
    },
    metricLabel: {
      fontSize: '14px',
      color: '#64748b',
      margin: 0,
      fontWeight: '500'
    },
    badge: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      marginTop: '8px'
    },
    badgeGood: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    badgeWarning: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    badgeCritical: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    },
    btn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all 0.2s ease'
    },
    btnPrimary: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    btnSecondary: {
      backgroundColor: '#f1f5f9',
      color: '#475569'
    },
    btnSuccess: {
      backgroundColor: '#059669',
      color: 'white'
    },
    btnWarning: {
      backgroundColor: '#f59e0b',
      color: 'white'
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box'
    },
    gameCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '16px',
      padding: '24px',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
      border: 'none'
    },
    gameCardHover: {
      transform: 'translateY(-4px)'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e2e8f0',
      borderRadius: '4px',
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#3b82f6',
      transition: 'width 0.3s ease'
    },
    riskCard: {
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginBottom: '16px'
    },
    riskHigh: {
      backgroundColor: '#fef2f2',
      borderColor: '#fecaca'
    },
    riskMedium: {
      backgroundColor: '#fffbeb',
      borderColor: '#fed7aa'
    },
    riskLow: {
      backgroundColor: '#f0fdf4',
      borderColor: '#bbf7d0'
    }
  };

  // Expanded compliance checklist with all legal requirements
  const complianceChecklist = {
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

  // Training modules with gamification
  const trainingModules = [
    {
      id: 'phishing',
      title: 'Phishing Defense Master',
      description: 'Learn to identify and defend against phishing attacks',
      difficulty: 'Beginner',
      duration: '15 min',
      points: 100,
      badge: '🎣',
      color: '#3b82f6'
    },
    {
      id: 'passwords',
      title: 'Password Security Champion',
      description: 'Master strong password creation and management',
      difficulty: 'Beginner',
      duration: '10 min',
      points: 80,
      badge: '🔐',
      color: '#059669'
    },
    {
      id: 'social-engineering',
      title: 'Social Engineering Detective',
      description: 'Recognize and counter social engineering tactics',
      difficulty: 'Intermediate',
      duration: '20 min',
      points: 150,
      badge: '🕵️',
      color: '#f59e0b'
    },
    {
      id: 'malware',
      title: 'Malware Hunter',
      description: 'Identify and prevent malware infections',
      difficulty: 'Intermediate',
      duration: '18 min',
      points: 120,
      badge: '🦠',
      color: '#ef4444'
    },
    {
      id: 'data-protection',
      title: 'Data Guardian',
      description: 'Protect sensitive data and ensure privacy compliance',
      difficulty: 'Advanced',
      duration: '25 min',
      points: 200,
      badge: '🛡️',
      color: '#8b5cf6'
    },
    {
      id: 'incident-response',
      title: 'Crisis Commander',
      description: 'Lead effective incident response procedures',
      difficulty: 'Advanced',
      duration: '30 min',
      points: 250,
      badge: '⚡',
      color: '#dc2626'
    }
  ];

  // Training game questions
  const gameQuestions = {
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

  const runAudit = async () => {
    setAuditResults({ loading: true });
    
    setTimeout(() => {
      const mockResults = {
        networkScan: {
          openPorts: [22, 80, 443, 8080],
          vulnerablePorts: [8080],
          status: 'warning'
        },
        tlsCheck: {
          version: 'TLS 1.3',
          certificateValid: true,
          hstsEnabled: false,
          status: 'warning'
        },
        webHeaders: {
          https: true,
          csp: false,
          xFrameOptions: true,
          status: 'warning'
        },
        emailAuth: {
          spf: true,
          dkim: true,
          dmarc: false,
          status: 'warning'
        },
        vulnerabilities: {
          critical: 0,
          high: 2,
          medium: 5,
          low: 8,
          status: 'warning'
        },
        riskScore: 6.7
      };
      
      setAuditResults(mockResults);
      calculateComplianceScore(mockResults);
      generateRiskAssessment(mockResults);
    }, 3000);
  };

  const generateRiskAssessment = (results) => {
    const risks = [
      {
        id: 1,
        category: 'Network Security',
        risk: 'Vulnerable port 8080 exposed',
        severity: 'High',
        impact: 'Unauthorized access to internal systems',
        likelihood: 'Medium',
        recommendation: 'Close port 8080 or implement proper access controls'
      },
      {
        id: 2,
        category: 'Web Security',
        risk: 'Missing Content Security Policy',
        severity: 'Medium',
        impact: 'XSS attack vulnerability',
        likelihood: 'Low',
        recommendation: 'Implement CSP headers on all web applications'
      },
      {
        id: 3,
        category: 'Email Security',
        risk: 'DMARC policy not configured',
        severity: 'Medium',
        impact: 'Email spoofing and phishing attacks',
        likelihood: 'Medium',
        recommendation: 'Configure DMARC policy with monitoring'
      }
    ];
    setRiskAssessment(risks);
  };

  const calculateComplianceScore = (results) => {
    let score = 75;
    
    if (results.vulnerabilities.critical > 0) score -= 20;
    if (results.vulnerabilities.high > 0) score -= 10;
    if (!results.tlsCheck.hstsEnabled) score -= 5;
    if (!results.webHeaders.csp) score -= 5;
    if (!results.emailAuth.dmarc) score -= 5;
    
    setComplianceData(prev => ({
      ...prev,
      score: Math.max(0, score),
      lastScan: new Date().toLocaleString()
    }));
  };

  const updateComplianceCheck = (category, itemId, checked) => {
    setComplianceData(prev => ({
      ...prev,
      checks: {
        ...prev.checks,
        [`${category}-${itemId}`]: checked
      }
    }));
  };

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

  const startTrainingGame = (moduleId) => {
    setCurrentGame({
      moduleId,
      questions: gameQuestions[moduleId] || [],
      currentQuestion: 0,
      score: 0,
      answers: []
    });
  };

  const answerQuestion = (answerIndex) => {
    if (!currentGame) return;
    
    const question = currentGame.questions[currentGame.currentQuestion];
    const isCorrect = answerIndex === question.correct;
    
    const newAnswers = [...currentGame.answers, {
      questionIndex: currentGame.currentQuestion,
      answer: answerIndex,
      correct: isCorrect
    }];

    if (currentGame.currentQuestion + 1 >= currentGame.questions.length) {
      // Game finished
      const finalScore = newAnswers.filter(a => a.correct).length;
      const module = trainingModules.find(m => m.id === currentGame.moduleId);
      
      setTrainingData(prev => ({
        ...prev,
        completedModules: [...prev.completedModules, currentGame.moduleId],
        currentScore: prev.currentScore + (finalScore * 20),
        streak: prev.streak + 1,
        badges: finalScore === currentGame.questions.length ? 
          [...prev.badges, module?.badge] : prev.badges
      }));
      
      setCurrentGame(null);
    } else {
      setCurrentGame(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        score: isCorrect ? prev.score + 1 : prev.score,
        answers: newAnswers
      }));
    }
  };

  const Dashboard = () => {
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
                  {trainingData.completedModules.length}/{trainingModules.length}
                </p>
                <p style={{...styles.metricLabel, marginTop: '8px'}}>Modules completed</p>
              </div>
              <GraduationCap color="#8b5cf6" size={28} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.card}>
          <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#0f172a'}}>
            Quick Actions
          </h3>
          <div style={styles.grid4}>
            <button 
              onClick={runAudit}
              style={{...styles.btn, ...styles.btnPrimary, justifyContent: 'center', padding: '16px'}}
            >
              <RefreshCw size={20} />
              <div>
                <div style={{fontWeight: '600'}}>Run Security Audit</div>
                <div style={{fontSize: '12px', opacity: 0.8}}>Full system scan</div>
              </div>
            </button>
            
            <button 
              onClick={() => setActiveTab('training')}
              style={{...styles.btn, ...styles.btnSuccess, justifyContent: 'center', padding: '16px'}}
            >
              <GraduationCap size={20} />
              <div>
                <div style={{fontWeight: '600'}}>Start Training</div>
                <div style={{fontSize: '12px', opacity: 0.8}}>Learn & earn points</div>
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
                      {auditResults.vulnerabilities?.high} high priority issues
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

        {/* Notifications */}
        <div style={styles.card}>
          <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#0f172a'}}>
            Recent Notifications
          </h3>
          {notifications.map(notification => (
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

  const TrainingTab = () => {
    if (currentGame) {
      const question = currentGame.questions[currentGame.currentQuestion];
      const progress = ((currentGame.currentQuestion + 1) / currentGame.questions.length) * 100;
      
      return (
        <div style={styles.card}>
          <div style={{marginBottom: '24px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: 0}}>
                Training Game in Progress
              </h3>
              <span style={{fontSize: '14px', color: '#64748b'}}>
                Question {currentGame.currentQuestion + 1} of {currentGame.questions.length}
              </span>
            </div>
            
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${progress}%`}} />
            </div>
          </div>

          <div style={{marginBottom: '32px'}}>
            <h4 style={{fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#0f172a'}}>
              {question.question}
            </h4>
            
            <div style={{display: 'grid', gap: '12px'}}>
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => answerQuestion(index)}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: '2px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ':hover': {
                      borderColor: '#3b82f6',
                      backgroundColor: '#f0f9ff'
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        {/* Training Stats */}
        <div style={styles.grid3}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <p style={styles.metricLabel}>Total Points</p>
                <p style={{...styles.metric, color: '#8b5cf6'}}>{trainingData.currentScore}</p>
                <span style={{...styles.badge, backgroundColor: '#f3e8ff', color: '#7c3aed'}}>
                  Level {Math.floor(trainingData.currentScore / 500) + 1}
                </span>
              </div>
              <Trophy color="#8b5cf6" size={28} />
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <p style={styles.metricLabel}>Learning Streak</p>
                <p style={{...styles.metric, color: '#f59e0b'}}>{trainingData.streak}</p>
                <p style={{...styles.metricLabel, marginTop: '8px'}}>Days consecutive</p>
              </div>
              <Target color="#f59e0b" size={28} />
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <p style={styles.metricLabel}>Badges Earned</p>
                <div style={{display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap'}}>
                  {trainingData.badges.length > 0 ? 
                    trainingData.badges.map((badge, index) => (
                      <span key={index} style={{fontSize: '24px'}}>{badge}</span>
                    )) :
                    <span style={{fontSize: '14px', color: '#64748b'}}>No badges yet</span>
                  }
                </div>
              </div>
              <Award color="#059669" size={28} />
            </div>
          </div>
        </div>

        {/* Training Modules */}
        <div style={styles.card}>
          <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#0f172a'}}>
            Cybersecurity Training Modules
          </h3>
          
          <div style={styles.grid2}>
            {trainingModules.map(module => {
              const isCompleted = trainingData.completedModules.includes(module.id);
              const hasQuestions = gameQuestions[module.id];
              
              return (
                <div
                  key={module.id}
                  style={{
                    ...styles.gameCard,
                    background: isCompleted ? 
                      'linear-gradient(135deg, #059669 0%, #047857 100%)' :
                      `linear-gradient(135deg, ${module.color} 0%, ${module.color}dd 100%)`,
                    opacity: isCompleted ? 0.8 : 1
                  }}
                  onClick={() => hasQuestions && !isCompleted && startTrainingGame(module.id)}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                    <div>
                      <span style={{fontSize: '32px', marginBottom: '8px', display: 'block'}}>
                        {module.badge}
                      </span>
                      <h4 style={{fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0', color: 'white'}}>
                        {module.title}
                      </h4>
                    </div>
                    {isCompleted && <CheckCircle color="white" size={24} />}
                  </div>
                  
                  <p style={{fontSize: '14px', color: 'rgba(255,255,255,0.9)', marginBottom: '16px', lineHeight: 1.5}}>
                    {module.description}
                  </p>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', gap: '16px'}}>
                      <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.8)'}}>
                        {module.difficulty}
                      </span>
                      <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.8)'}}>
                        {module.duration}
                      </span>
                    </div>
                    <span style={{fontSize: '12px', fontWeight: '600', color: 'white'}}>
                      +{module.points} pts
                    </span>
                  </div>
                  
                  {!isCompleted && hasQuestions && (
                    <div style={{marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <Play size={16} color="white" />
                      <span style={{fontSize: '14px', fontWeight: '500', color: 'white'}}>
                        Start Training
                      </span>
                    </div>
                  )}
                  
                  {isCompleted && (
                    <div style={{marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <Trophy size={16} color="white" />
                      <span style={{fontSize: '14px', fontWeight: '500', color: 'white'}}>
                        Completed!
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard */}
        <div style={styles.card}>
          <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#0f172a'}}>
            Company Leaderboard
          </h3>
          
          <div style={{display: 'grid', gap: '12px'}}>
            {[
              { name: 'Alexandru Popescu', department: 'IT Security', points: 1250, position: 1 },
              { name: 'Maria Ionescu', department: 'Finance', points: 980, position: 2 },
              { name: 'You', department: 'Your Department', points: trainingData.currentScore, position: 3 },
              { name: 'Dmitri Petrov', department: 'Operations', points: 720, position: 4 },
              { name: 'Ana Muresan', department: 'HR', points: 650, position: 5 }
            ].map(user => (
              <div key={user.name} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: user.name === 'You' ? '#f0f9ff' : '#f8fafc',
                border: user.name === 'You' ? '2px solid #3b82f6' : '1px solid #e2e8f0'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: user.position === 1 ? '#fbbf24' : 
                                 user.position === 2 ? '#9ca3af' : 
                                 user.position === 3 ? '#cd7c2f' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {user.position}
                </div>
                <div style={{flex: 1}}>
                  <p style={{fontSize: '14px', fontWeight: '600', margin: 0, color: '#0f172a'}}>
                    {user.name}
                  </p>
                  <p style={{fontSize: '12px', color: '#64748b', margin: 0}}>
                    {user.department}
                  </p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{fontSize: '14px', fontWeight: '600', margin: 0, color: '#0f172a'}}>
                    {user.points} pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ComplianceTab = () => {
    const completedChecks = Object.values(complianceData.checks).filter(Boolean).length;
    const totalChecks = Object.values(complianceChecklist).reduce((sum, category) => sum + category.items.length, 0);
    const completionPercentage = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px'}}>
          <div>
            <h3 style={{fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0}}>
              Moldova Cybersecurity Law Compliance
            </h3>
            <p style={{color: '#64748b', margin: '4px 0 0 0'}}>
              Complete checklist based on Law No. 142/2023 requirements
            </p>
          </div>
          <div style={{textAlign: 'right'}}>
            <p style={{fontSize: '14px', color: '#64748b', margin: 0}}>Overall Progress</p>
            <p style={{fontSize: '24px', fontWeight: '700', color: '#3b82f6', margin: '4px 0 0 0'}}>
              {completedChecks}/{totalChecks} ({completionPercentage}%)
            </p>
          </div>
        </div>
        
        {Object.entries(complianceChecklist).map(([categoryKey, category]) => {
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
                      marginBottom: '16px',
                      padding: '16px',
                      borderRadius: '8px',
                      backgroundColor: isChecked ? '#f0fdf4' : '#fefefe',
                      border: `1px solid ${isChecked ? '#bbf7d0' : '#f1f5f9'}`,
                      transition: 'all 0.2s ease'
                    }}>
                      <input
                        type="checkbox"
                        id={checkKey}
                        checked={isChecked}
                        onChange={(e) => updateComplianceCheck(categoryKey, item.id, e.target.checked)}
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
                            marginBottom: '4px'
                          }}
                        >
                          {item.text}
                          {item.required && <span style={{color: '#dc2626', marginLeft: '4px'}}>*</span>}
                        </label>
                        {item.required && (
                          <p style={{fontSize: '12px', color: '#64748b', margin: 0, fontStyle: 'italic'}}>
                            Mandatory requirement under Moldova Cybersecurity Law No. 142/2023
                          </p>
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

  const IncidentForm = () => {
    const [incident, setIncident] = useState({
      type: 'initial',
      severity: 'medium',
      category: 'data-breach',
      description: '',
      impact: '',
      actions: '',
      status: 'open'
    });

    const submitIncident = () => {
      const newIncident = {
        ...incident,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        reportDate: new Date().toLocaleString()
      };
      setIncidents(prev => [...prev, newIncident]);
      setIncident({
        type: 'initial',
        severity: 'medium',
        category: 'data-breach',
        description: '',
        impact: '',
        actions: '',
        status: 'open'
      });
    };

    return (
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#0f172a' }}>
          Incident Reporting (Article 12)
        </h3>
        
        <div style={{...styles.grid2, marginBottom: '20px'}}>
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>Report Type</label>
            <select 
              style={styles.input}
              value={incident.type}
              onChange={(e) => setIncident({...incident, type: e.target.value})}
            >
              <option value="initial">Initial Notification (24h)</option>
              <option value="update">Update Report (72h)</option>
              <option value="final">Final Report (30 days)</option>
            </select>
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>Severity Level</label>
            <select 
              style={styles.input}
              value={incident.severity}
              onChange={(e) => setIncident({...incident, severity: e.target.value})}
            >
              <option value="low">Low Impact</option>
              <option value="medium">Medium Impact</option>
              <option value="high">High Impact (Significant)</option>
              <option value="critical">Critical Impact (Major)</option>
            </select>
          </div>
          
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>Incident Category</label>
            <select 
              style={styles.input}
              value={incident.category}
              onChange={(e) => setIncident({...incident, category: e.target.value})}
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
          <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>Incident Description</label>
          <textarea 
            style={{...styles.input, height: '100px', resize: 'vertical', fontFamily: 'inherit'}}
            placeholder="Provide a detailed description of the security incident..."
            value={incident.description}
            onChange={(e) => setIncident({...incident, description: e.target.value})}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>Business Impact Assessment</label>
          <textarea 
            style={{...styles.input, height: '100px', resize: 'vertical', fontFamily: 'inherit'}}
            placeholder="Describe impact on operations, affected systems, number of affected persons..."
            value={incident.impact}
            onChange={(e) => setIncident({...incident, impact: e.target.value})}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151'}}>Remediation Actions Taken</label>
          <textarea 
            style={{...styles.input, height: '100px', resize: 'vertical', fontFamily: 'inherit'}}
            placeholder="Describe immediate containment and remediation actions..."
            value={incident.actions}
            onChange={(e) => setIncident({...incident, actions: e.target.value})}
          />
        </div>

        <button 
          onClick={submitIncident}
          style={{...styles.btn, ...styles.btnPrimary}}
        >
          <Send size={16} />
          Submit Incident Report to National Agency
        </button>
      </div>
    );
  };

  const IncidentTab = () => {
    return (
      <div>
        <IncidentForm />
        
        {incidents.length > 0 && (
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
                        {incident.category.replace('-', ' ')}
                      </h4>
                      <p style={{fontSize: '14px', color: '#64748b', marginBottom: '8px', lineHeight: 1.5}}>
                        {incident.description}
                      </p>
                      <div style={{display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap'}}>
                        <p style={{fontSize: '12px', color: '#94a3b8', margin: 0}}>
                          <strong>Type:</strong> {incident.type} report
                        </p>
                        <p style={{fontSize: '12px', color: '#94a3b8', margin: 0}}>
                          <strong>Submitted:</strong> {incident.reportDate}
                        </p>
                        <p style={{fontSize: '12px', color: '#94a3b8', margin: 0}}>
                          <strong>Status:</strong> {incident.status}
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
                        {incident.severity.toUpperCase()}
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
      </div>
    );
  };

  const ResourcesTab = () => {
    return (
      <div>
        {/* Quick Links */}
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
                  🇲🇩 Moldova Cybersecurity Law
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
                  📋 Article 11: Security Measures
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
                  🚨 Article 12: Incident Notification
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
                  📖 SME Best Practices Guide
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
                  🔧 Technical Implementation
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
                  💼 Compliance Templates
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
            🤖 AI-Powered Compliance Assistant
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
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <Shield color="#3b82f6" size={32} />
            <div>
              <h1 style={styles.logoText}>CyberCare</h1>
              <p style={styles.logoSubtext}>Moldova Cybersecurity Law Compliance Platform</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <button style={styles.notificationBell}>
              <Bell color="#64748b" size={18} />
              <span style={styles.notificationBadge}>
                {notifications.filter(n => n.type === 'critical').length}
              </span>
            </button>
            <span style={styles.lawText}>Law No. 142/2023</span>
            <button style={styles.supportBtn}>
              Contact Support
            </button>
          </div>
        </div>
      </header>

      <div style={styles.main}>
        {/* Navigation */}
        <nav style={styles.nav}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'compliance', label: 'Compliance', icon: CheckCircle },
            { id: 'training', label: 'Training', icon: GraduationCap },
            { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
            { id: 'resources', label: 'Resources', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.navBtn,
                ...(activeTab === tab.id ? styles.navBtnActive : styles.navBtnInactive)
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'compliance' && <ComplianceTab />}
          {activeTab === 'training' && <TrainingTab />}
          {activeTab === 'incidents' && <IncidentTab />}
          {activeTab === 'resources' && <ResourcesTab />}
        </main>
      </div>

      {/* Footer */}
      <footer style={{backgroundColor: '#1e293b', color: 'white', marginTop: '80px'}}>
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
            <a href="#" style={{display: 'block', fontSize: '14px', color: '#cbd5e1', textDecoration: 'none', marginBottom: '8px'}}>
              Automated Security Audits
            </a>
            <a href="#" style={{display: 'block', fontSize: '14px', color: '#cbd5e1', textDecoration: 'none', marginBottom: '8px'}}>
              Interactive Training Games
            </a>
            <a href="#" style={{display: 'block', fontSize: '14px', color: '#cbd5e1', textDecoration: 'none', marginBottom: '8px'}}>
              AI-Powered Risk Assessment
            </a>
            <a href="#" style={{display: 'block', fontSize: '14px', color: '#cbd5e1', textDecoration: 'none', marginBottom: '8px'}}>
              Real-time Compliance Monitoring
            </a>
          </div>
          <div>
            <h4 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#f8fafc'}}>
              Support & Resources
            </h4>
            <a href="#" style={{display: 'block', fontSize: '14px', color: '#cbd5e1', textDecoration: 'none', marginBottom: '8px'}}>
              Expert Consultation
            </a>
            <a href="#" style={{display: 'block', fontSize: '14px', color: '#cbd5e1', textDecoration: 'none', marginBottom: '8px'}}>
              Technical Documentation
            </a>
            <a href="#" style={{display: 'block', fontSize: '14px', color: '#cbd5e1', textDecoration: 'none', marginBottom: '8px'}}>
              Compliance Templates
            </a>
            <a href="#" style={{display: 'block', fontSize: '14px', color: '#cbd5e1', textDecoration: 'none', marginBottom: '8px'}}>
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

export default CyberCareApp;