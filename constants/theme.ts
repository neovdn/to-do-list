// Theme constants for the TugasKu app
// Pastel palette designed for Indonesian students

export const Colors = {
  // Primary palette
  primary: '#7C5CFC',        // Vibrant purple
  primaryLight: '#A78BFA',
  primarySoft: '#EDE9FE',
  primaryDark: '#5B3FD9',

  // Accent colors
  coral: '#FF6F91',
  coralSoft: '#FFE0E6',
  sky: '#56CCF2',
  skySoft: '#D6F3FF',
  mint: '#6EE7B7',
  mintSoft: '#D1FAE5',
  amber: '#FBBF24',
  amberSoft: '#FEF3C7',

  // Neutrals
  white: '#FFFFFF',
  background: '#F8F5FF',
  surface: '#FFFFFF',
  surfaceHover: '#F5F0FF',
  border: '#E8E0F7',
  textPrimary: '#1E1B4B',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  danger: '#EF4444',
  dangerSoft: '#FEE2E2',
  success: '#10B981',
  successSoft: '#D1FAE5',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
};

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
};
