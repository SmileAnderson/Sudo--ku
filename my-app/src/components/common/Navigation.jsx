import React from 'react';
import { colors, spacing, borderRadius, shadows } from '../../styles/theme.js';

const Navigation = ({ tabs, activeTab, onTabChange }) => {
  const styles = {
    nav: {
      backgroundColor: 'white',
      borderRadius: borderRadius.lg,
      border: `1px solid ${colors.gray[200]}`,
      marginBottom: spacing['3xl'],
      display: 'flex',
      boxShadow: shadows.sm,
      overflow: 'hidden',
      flexWrap: 'wrap'
    },
    navBtn: {
      flex: 1,
      minWidth: '120px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      padding: `${spacing.lg} ${spacing.lg}`,
      border: 'none',
      backgroundColor: 'transparent',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap'
    },
    navBtnActive: {
      color: colors.primary[500],
      backgroundColor: colors.primary[50],
      borderBottom: `3px solid ${colors.primary[500]}`
    },
    navBtnInactive: {
      color: colors.gray[500],
      ':hover': {
        color: colors.gray[900],
        backgroundColor: colors.gray[50]
      }
    }
  };

  return (
    <nav style={styles.nav}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
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
  );
};

export default Navigation;