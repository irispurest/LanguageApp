export const theme = {
  colors: {
    background: '#FBF4F0',
    surface: '#FFFFFF',
    surfaceMuted: '#F3E3DD',
    text: '#2B2021',
    textMuted: '#766366',
    border: '#EAD8D2',
    accent: '#B6465F',
    accentPressed: '#963A4E',
    accentInk: '#8E2F45',
    accentSoft: '#F7DAD4',
    onAccent: '#FFFFFF',
    warning: '#96561A',
    warningSoft: '#F7E5CC',
    danger: '#A33A3A',
    success: '#2E6B4F',
  },
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

export type Theme = typeof theme;
