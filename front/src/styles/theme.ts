// src/styles/theme.ts
export const theme = {
  colors: {
    primary: '#E30000',
    secondary: '#121212',
    accent: '#FFD700',
    accent1: '#3b82f6', // Azul
    accent2: '#ef4444', // Vermelho
    accent3: '#10b981', // Verde
    cardBackground: '#ffffff',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    background: '#FAFAFA',
    surface: '#FFFFFF',
  },
  shadows: {
    strong: '8px 8px 0 var(--color-secondary)',
    light: '4px 4px 0 var(--color-secondary)',
  },
  transitions: {
    base: 'all 0.25s ease',
    fast: 'all 0.15s ease-out',
  },
  fonts: {
    bangers: '"Bangers", cursive',
    permanentMarker: '"Permanent Marker", cursive',
    comicNeue: '"Comic Neue", cursive',
  },
  breakpoints: {
    mobile: '600px',
    tablet: '768px',
    desktop: '1024px',
    large: '1400px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
};

export type Theme = typeof theme;
