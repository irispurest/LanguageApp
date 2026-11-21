export type ThemeScheme = 'light' | 'dark';

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  accent: string;
  accentPressed: string;
  accentStrong: string;
  accentInk: string;
  accentSoft: string;
  onAccent: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  success: string;
  successSoft: string;
};

const shared = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 24,
    pill: 999,
  },
  typography: {
    caption: { fontSize: 12, lineHeight: 16 },
    body: { fontSize: 15, lineHeight: 22 },
    bodyLarge: { fontSize: 17, lineHeight: 24 },
    title: { fontSize: 22, lineHeight: 28 },
    display: { fontSize: 30, lineHeight: 36 },
  },
} as const;

export type AppTheme = {
  scheme: ThemeScheme;
  colors: ThemeColors;
  spacing: typeof shared.spacing;
  radius: typeof shared.radius;
  typography: typeof shared.typography;
};

export const lightTheme: AppTheme = {
  scheme: 'light',
  ...shared,
  colors: {
    background: '#FBF4F0',
    surface: '#FFFFFF',
    surfaceMuted: '#F3E3DD',
    text: '#2B2021',
    textMuted: '#766366',
    border: '#EAD8D2',
    accent: '#B33A56',
    accentPressed: '#972F48',
    accentStrong: '#A63D56',
    accentInk: '#8E2F45',
    accentSoft: '#FBE3DF',
    onAccent: '#FFFFFF',
    warning: '#96561A',
    warningSoft: '#F7E5CC',
    danger: '#A33A3A',
    dangerSoft: '#F8E2E2',
    success: '#2E6B4F',
    successSoft: '#E5F1E9',
  },
};

export const darkTheme: AppTheme = {
  scheme: 'dark',
  ...shared,
  colors: {
    background: '#171214',
    surface: '#221A1D',
    surfaceMuted: '#33262B',
    text: '#F8EEEA',
    textMuted: '#C4B2AF',
    border: '#3B2C31',
    accent: '#FFA3B4',
    accentPressed: '#EE8FA2',
    accentStrong: '#FFB3C1',
    accentInk: '#FFD5DE',
    accentSoft: '#3B232A',
    onAccent: '#2A141A',
    warning: '#F3B56A',
    warningSoft: '#3A2A18',
    danger: '#FF8C8C',
    dangerSoft: '#3B2022',
    success: '#7ED6A6',
    successSoft: '#1B3326',
  },
};
