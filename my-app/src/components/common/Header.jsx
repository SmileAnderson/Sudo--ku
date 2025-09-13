import React from 'react';
import { Shield, Bell } from 'lucide-react';
import { colors, spacing, shadows } from '../../styles/theme.js';
import { APP_CONFIG } from '../../utils/constants.js';
import NotificationBell from './NotificationBell.jsx';

const Header = () => {
  const styles = {
    header: {
      backgroundColor: 'white',
      borderBottom: `1px solid ${colors.gray[200]}`,
      boxShadow: shadows.sm,
      position: 'sticky',
      top: 0,
      zIndex: 50
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `${spacing.lg} ${spacing.xl}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: spacing.lg
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.lg
    },
    logoText: {
      fontSize: '24px',
      fontWeight: '700',
      color: colors.gray[900],
      margin: 0,
      lineHeight: 1.2
    },
    logoSubtext: {
      fontSize: '14px',
      color: colors.gray[500],
      margin: 0,
      lineHeight: 1.2
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.lg,
      flexWrap: 'wrap'
    },
    lawText: {
      fontSize: '14px',
      color: colors.gray[500],
      fontWeight: '500'
    },
    supportBtn: {
      backgroundColor: colors.primary[500],
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: `${spacing.md} ${spacing.xl}`,
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.content}>
        <div style={styles.logo}>
          <Shield color={colors.primary[500]} size={32} />
          <div>
            <h1 style={styles.logoText}>{APP_CONFIG.NAME}</h1>
            <p style={styles.logoSubtext}>Moldova Cybersecurity Law Compliance Platform</p>
          </div>
        </div>
        
        <div style={styles.headerRight}>
          <NotificationBell />
          <span style={styles.lawText}>{APP_CONFIG.LAW_REFERENCE}</span>
          <button style={styles.supportBtn}>
            Contact Support
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;