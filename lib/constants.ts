// SeekerLens Design System Constants
// Immutable design tokens for consistent UI across the app

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

export const COLORS = {
  // Backgrounds
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F5F5',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // Primary (actions, CTAs)
  primary: '#3B82F6',
  primaryLight: '#EFF6FF',

  // Secondary (success, earnings)
  secondary: '#10B981',
  secondaryLight: '#ECFDF5',

  // Status
  warning: '#F59E0B',
  error: '#EF4444',

  // SOL branding (SOL amounts only)
  solPurple: '#9945FF',
  solPurpleLight: '#F3EEFF',

  // Utility
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

// ---------------------------------------------------------------------------
// Category Tags
// ---------------------------------------------------------------------------

export const CATEGORY_TAGS = {
  nature: {
    background: '#ECFDF5',
    text: '#059669',
  },
  urban: {
    background: '#EFF6FF',
    text: '#2563EB',
  },
  food: {
    background: '#FFF7ED',
    text: '#EA580C',
  },
  portrait: {
    background: '#FDF2F8',
    text: '#DB2777',
  },
  architecture: {
    background: '#F5F3FF',
    text: '#7C3AED',
  },
  travel: {
    background: '#ECFEFF',
    text: '#0891B2',
  },
} as const;

export type CategoryTagName = keyof typeof CATEGORY_TAGS;

// ---------------------------------------------------------------------------
// Gradients
// ---------------------------------------------------------------------------

export const GRADIENTS = {
  cardHighlight: {
    colors: ['#DBEAFE', '#EDE9FE'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  solBadge: {
    colors: ['#9945FF', '#14F195'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
} as const;

// ---------------------------------------------------------------------------
// Typography (Inter font family)
// ---------------------------------------------------------------------------

export const TYPOGRAPHY = {
  display: {
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: '700' as const,
  },
  heading1: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '700' as const,
  },
  heading2: {
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: '600' as const,
  },
  heading3: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400' as const,
  },
  caption: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500' as const,
  },
  overline: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing & Layout
// ---------------------------------------------------------------------------

export const SPACING = {
  /** Horizontal padding for screen edges */
  screenPadding: 20,

  /** Internal card padding */
  cardPadding: 16,

  /** Card border radius */
  cardRadius: 16,

  /** Vertical gap between sections */
  sectionGap: 24,

  /** Gap between sibling elements */
  elementGap: 12,

  /** Bottom navigation bar height */
  bottomNavHeight: 64,

  // Base scale
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------

export const SHADOWS = {
  card: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardLifted: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

// ---------------------------------------------------------------------------
// Network Configuration
// ---------------------------------------------------------------------------

export const NETWORKS = {
  devnet: {
    name: 'Devnet',
    endpoint: 'https://api.devnet.solana.com',
  },
  mainnet: {
    name: 'Mainnet Beta',
    endpoint: 'https://api.mainnet-beta.solana.com',
  },
} as const;

export type NetworkName = keyof typeof NETWORKS;
