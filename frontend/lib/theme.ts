/**
 * Centralized Theme Configuration
 * Based on homepage design - warm, elegant, professional
 */

export const theme = {
  colors: {
    // Backgrounds
    background: '#f5f1e8', // Warm beige
    surface: '#ffffff', // White cards
    surfaceHover: '#fafaf9',
    overlay: 'rgba(31, 53, 41, 0.95)', // Dark green with opacity

    // Primary Colors
    primary: '#1f3529', // Dark green
    primaryHover: '#2d4a39',
    primaryLight: 'rgba(31, 53, 41, 0.1)',

    // Secondary/Accent
    secondary: '#ebe4d5', // Light beige
    secondaryDark: '#d4cbb7',

    // Text Colors
    text: {
      primary: '#0a0a0a',
      secondary: '#374151',
      muted: '#6b7280',
      light: '#9ca3af',
      inverse: '#ffffff',
    },

    // Status Colors
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe',

    // Borders
    border: 'rgba(0, 0, 0, 0.05)',
    borderMedium: 'rgba(0, 0, 0, 0.1)',
    borderStrong: '#d1d5db',

    // Chart Colors
    chart: {
      blue: '#5B8DEE',
      teal: '#4ECDC4',
      purple: '#9b87f5',
      pink: '#fbcfe8',
      orange: '#fb923c',
    },
  },

  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
      serif: 'Playfair Display, Georgia, serif',
      mono: '"Courier New", monospace',
    },
    fontSize: {
      xs: '11px',
      sm: '13px',
      base: '14px',
      md: '15px',
      lg: '16px',
      xl: '18px',
      '2xl': '20px',
      '3xl': '24px',
      '4xl': '32px',
      '5xl': '48px',
      '6xl': '64px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.15em',
      wider: '0.2em',
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    '4xl': '64px',
    '5xl': '96px',
  },

  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },

  transitions: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
  },
};

// Helper function to generate inline styles
export const getStyles = {
  card: (hover: boolean = false): React.CSSProperties => ({
    backgroundColor: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing['2xl'],
    transition: `all ${theme.transitions.base}`,
    ...(hover && {
      cursor: 'pointer',
      ':hover': {
        boxShadow: theme.shadows.md,
      },
    }),
  }),

  button: {
    primary: (): React.CSSProperties => ({
      backgroundColor: theme.colors.primary,
      color: theme.colors.text.inverse,
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      borderRadius: theme.borderRadius.md,
      border: 'none',
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.normal,
      cursor: 'pointer',
      transition: `all ${theme.transitions.base}`,
    }),

    secondary: (): React.CSSProperties => ({
      backgroundColor: theme.colors.surface,
      color: theme.colors.text.secondary,
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      borderRadius: theme.borderRadius.md,
      border: `2px solid ${theme.colors.borderStrong}`,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.normal,
      cursor: 'pointer',
      transition: `all ${theme.transitions.base}`,
    }),

    ghost: (): React.CSSProperties => ({
      backgroundColor: 'transparent',
      color: theme.colors.text.secondary,
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      borderRadius: theme.borderRadius.md,
      border: 'none',
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.normal,
      cursor: 'pointer',
      transition: `all ${theme.transitions.base}`,
    }),
  },

  heading: (level: 1 | 2 | 3 = 1): React.CSSProperties => ({
    fontFamily: theme.typography.fontFamily.serif,
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: theme.typography.letterSpacing.tight,
    color: theme.colors.text.primary,
    ...(level === 1 && { fontSize: theme.typography.fontSize['5xl'] }),
    ...(level === 2 && { fontSize: theme.typography.fontSize['4xl'] }),
    ...(level === 3 && { fontSize: theme.typography.fontSize['3xl'] }),
  }),

  stat: {
    label: (): React.CSSProperties => ({
      fontSize: theme.typography.fontSize.xs,
      letterSpacing: theme.typography.letterSpacing.wide,
      color: theme.colors.text.muted,
      fontWeight: theme.typography.fontWeight.medium,
      textTransform: 'uppercase',
    }),

    value: (): React.CSSProperties => ({
      fontFamily: theme.typography.fontFamily.serif,
      fontSize: theme.typography.fontSize['4xl'],
      fontWeight: theme.typography.fontWeight.semibold,
      letterSpacing: theme.typography.letterSpacing.tight,
      color: theme.colors.text.primary,
    }),
  },

  input: (): React.CSSProperties => ({
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.borderStrong}`,
    fontSize: theme.typography.fontSize.base,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text.primary,
    transition: `all ${theme.transitions.base}`,
  }),

  iconCircle: (size: 'sm' | 'md' | 'lg' = 'md'): React.CSSProperties => ({
    borderRadius: '50%',
    backgroundColor: theme.colors.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...(size === 'sm' && { width: '40px', height: '40px' }),
    ...(size === 'md' && { width: '48px', height: '48px' }),
    ...(size === 'lg' && { width: '56px', height: '56px' }),
  }),
};
