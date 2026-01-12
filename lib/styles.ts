// Common reusable inline styles for the project

export const commonStyles = {
  // Container styles
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 16px',
  } as React.CSSProperties,

  // Flexbox layouts
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  } as React.CSSProperties,

  flexCol: {
    display: 'flex',
    flexDirection: 'column',
  } as React.CSSProperties,

  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,

  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as React.CSSProperties,

  // Grid layouts
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
  } as React.CSSProperties,

  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  } as React.CSSProperties,

  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  } as React.CSSProperties,

  // Typography
  h1: {
    fontSize: '48px',
    fontWeight: 700,
    lineHeight: 1.2,
  } as React.CSSProperties,

  h2: {
    fontSize: '36px',
    fontWeight: 700,
    lineHeight: 1.3,
  } as React.CSSProperties,

  h3: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: 1.4,
  } as React.CSSProperties,

  textMuted: {
    color: '#737373',
  } as React.CSSProperties,

  // Spacing
  p1: { padding: '4px' } as React.CSSProperties,
  p2: { padding: '8px' } as React.CSSProperties,
  p3: { padding: '12px' } as React.CSSProperties,
  p4: { padding: '16px' } as React.CSSProperties,
  p6: { padding: '24px' } as React.CSSProperties,
  p8: { padding: '32px' } as React.CSSProperties,

  m1: { margin: '4px' } as React.CSSProperties,
  m2: { margin: '8px' } as React.CSSProperties,
  m3: { margin: '12px' } as React.CSSProperties,
  m4: { margin: '16px' } as React.CSSProperties,
  m6: { margin: '24px' } as React.CSSProperties,
  m8: { margin: '32px' } as React.CSSProperties,

  gap1: { gap: '4px' } as React.CSSProperties,
  gap2: { gap: '8px' } as React.CSSProperties,
  gap3: { gap: '12px' } as React.CSSProperties,
  gap4: { gap: '16px' } as React.CSSProperties,
  gap6: { gap: '24px' } as React.CSSProperties,

  // Borders & Shadows
  border: {
    border: '1px solid #e5e5e5',
  } as React.CSSProperties,

  borderBottom: {
    borderBottom: '1px solid #e5e5e5',
  } as React.CSSProperties,

  rounded: {
    borderRadius: '8px',
  } as React.CSSProperties,

  roundedLg: {
    borderRadius: '12px',
  } as React.CSSProperties,

  shadow: {
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  } as React.CSSProperties,

  shadowMd: {
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  } as React.CSSProperties,

  shadowLg: {
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  } as React.CSSProperties,

  // Gradients
  gradientBg: {
    background: 'linear-gradient(to bottom, #ffffff, #fafafa)',
  } as React.CSSProperties,

  gradientText: {
    background: 'linear-gradient(to right, #171717, #737373)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  } as React.CSSProperties,

  // Transitions
  transition: {
    transition: 'all 0.2s',
  } as React.CSSProperties,

  //  Responsive helper
  fullWidth: {
    width: '100%',
  } as React.CSSProperties,

  minHScreen: {
    minHeight: '100vh',
  } as React.CSSProperties,
}

// Media queries helper
export const mediaQueries = {
  sm: '@media (min-width: 640px)',
  md: '@media (min-width: 768px)',
  lg: '@media (min-width: 1024px)',
  xl: '@media (min-width: 1280px)',
}
