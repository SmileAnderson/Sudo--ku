// Design system and theme configuration
export const colors = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a'
  },
  
  // Status colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#059669',
    600: '#047857',
    700: '#065f46'
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#92400e'
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#991b1b'
  },
  
  // Neutral colors
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  },
  
  // Special colors
  purple: {
    50: '#f3e8ff',
    500: '#8b5cf6',
    600: '#7c3aed'
  }
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px'
};

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  lg: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  xl: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
};

export const typography = {
  fontFamily: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px'
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625'
  }
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
};

export const zIndex = {
  dropdown: 10,
  sticky: 20,
  modal: 50,
  toast: 100
};

// Component-specific styles
export const components = {
  button: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: spacing.sm,
      padding: `${spacing.md} ${spacing.lg}`,
      borderRadius: borderRadius.md,
      border: 'none',
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontFamily: typography.fontFamily.sans
    },
    primary: {
      backgroundColor: colors.primary[500],
      color: 'white'
    },
    secondary: {
      backgroundColor: colors.gray[100],
      color: colors.gray[700]
    },
    success: {
      backgroundColor: colors.success[500],
      color: 'white'
    },
    warning: {
      backgroundColor: colors.warning[500],
      color: 'white'
    }
  },
  
  card: {
    base: {
      backgroundColor: 'white',
      borderRadius: borderRadius.lg,
      border: `1px solid ${colors.gray[200]}`,
      padding: spacing['2xl'],
      boxShadow: shadows.sm,
      marginBottom: spacing['2xl']
    }
  },
  
  input: {
    base: {
      width: '100%',
      padding: `${spacing.md} ${spacing.lg}`,
      border: `1px solid ${colors.gray[300]}`,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.sm,
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box',
      fontFamily: typography.fontFamily.sans
    }
  },
  
  badge: {
    base: {
      display: 'inline-block',
      padding: `6px ${spacing.lg}`,
      borderRadius: borderRadius.full,
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semibold
    },
    success: {
      backgroundColor: colors.success[100],
      color: colors.success[700]
    },
    warning: {
      backgroundColor: colors.warning[100],
      color: colors.warning[700]
    },
    error: {
      backgroundColor: colors.error[100],
      color: colors.error[700]
    }
  }
};

// Responsive utilities
export const responsive = {
  mobile: `@media (max-width: ${breakpoints.md})`,
  tablet: `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  desktop: `@media (min-width: ${breakpoints.lg})`
};

// Grid systems
export const grid = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${spacing.xl}`
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: spacing['2xl']
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: spacing['2xl']
  },
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing.xl
  }
};