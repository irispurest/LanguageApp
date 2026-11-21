import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type AppTheme } from './theme';

const ThemeContext = createContext<AppTheme>(lightTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): AppTheme {
  return useContext(ThemeContext);
}

export function useThemeStyles<T>(
  factory: (theme: AppTheme) => T,
): { theme: AppTheme; styles: T } {
  const theme = useTheme();
  const styles = useMemo(() => factory(theme), [factory, theme]);

  return { theme, styles };
}
