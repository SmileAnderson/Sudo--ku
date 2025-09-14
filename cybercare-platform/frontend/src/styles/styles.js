// src/styles/styles.js - Component styles
export const styles = {
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
  border: '1px solid #e5e7eb',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
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
  alignItems: 'flex-start',
  marginBottom: '16px'
},
  metric: {
  fontSize: '48px',
  fontWeight: '700',
  lineHeight: '1',
  margin: '8px 0 12px 0'
},
 metricLabel: {
  color: '#6b7280',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 8px 0'
},
  badge: {
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: '600',
  display: 'inline-block',
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
  btnResource: {
    backgroundColor: '#7a5dc7',
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
  },
  footerLink: {
  display: 'block',
  fontSize: '14px', 
  color: '#cbd5e1',
  textDecoration: 'none',
  marginBottom: '8px',
  cursor: 'pointer', // Make it clear these are clickable
  transition: 'color 0.2s ease'
  }
};