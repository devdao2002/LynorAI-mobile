import { Platform } from 'react-native';

export const colors = {
    bgBase: '#1a1a2e',
    bgSurface: '#16213e',
    bgElevated: '#0f3460',
    bgGlass: 'rgba(255,255,255,0.04)',
    bgGlassHover: 'rgba(255,255,255,0.08)',

    accent: '#6264A7',
    accent2: '#9EA8DB',
    accentGlow: 'rgba(98,100,167,0.35)',

    textPrimary: '#e8eaf6',
    textSecondary: '#9da3bb',
    textMuted: '#5c6080',

    border: 'rgba(255,255,255,0.08)',
    borderAccent: 'rgba(98,100,167,0.5)',

    success: '#4caf87',
    danger: '#f06c7e',
    warning: '#f5a623',
};

export const radius = {
    sm: 6,
    md: 12,
    lg: 20,
    xl: 28,
    full: 999,
};

export const shadow = {
    sm: Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
        android: { elevation: 3 },
    }),
    md: Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10 },
        android: { elevation: 6 },
    }),
};

export const typography = {
    xs: { fontSize: 11, lineHeight: 16 },
    sm: { fontSize: 12, lineHeight: 18 },
    base: { fontSize: 14, lineHeight: 21 },
    md: { fontSize: 15, lineHeight: 22 },
    lg: { fontSize: 17, lineHeight: 24 },
    xl: { fontSize: 20, lineHeight: 28 },
    bold: { fontWeight: '700' },
    semi: { fontWeight: '600' },
    mono: { fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace' }) },
};

export const spacing = {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24,
};
