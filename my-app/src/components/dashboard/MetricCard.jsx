import React from 'react';
import { components, colors, spacing } from '../../styles/theme.js';

const MetricCard = ({ title, value, subtitle, icon: Icon, color, bgColor }) => {
  const styles = {
    card: {
      ...components.card.base,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    },
    content: {
      flex: 1
    },
    title: {
      fontSize: '14px',
      color: colors.gray[500],
      margin: 0,
      fontWeight: '500'
    },
    value: {
      fontSize: '36px',
      fontWeight: '700',
      margin: '8px 0 4px 0',
      lineHeight: 1,
      color: color || colors.gray[900]
    },
    subtitle: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      marginTop: '8px',
      backgroundColor: bgColor || colors.gray[100],
      color: color || colors.gray[700]
    },
    iconContainer: {
      padding: spacing.sm
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.content}>
        <p style={styles.title}>{title}</p>
        <p style={styles.value}>{value}</p>
        <span style={styles.subtitle}>{subtitle}</span>
      </div>
      <div style={styles.iconContainer}>
        {Icon && <Icon color={color} size={28} />}
      </div>
    </div>
  );
};

export default MetricCard;