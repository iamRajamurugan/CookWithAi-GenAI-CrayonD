
import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useEffect } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ThemeToggle() {
  const { preferences, updatePreference } = useUserPreferences();
  const { setTheme, theme } = useTheme();

  // Sync theme between preferences and next-themes
  useEffect(() => {
    if (theme !== preferences.theme) {
      setTheme(preferences.theme);
    }
  }, [preferences.theme, setTheme, theme]);

  // Sync next-themes back to preferences
  useEffect(() => {
    if (theme && theme !== preferences.theme) {
      updatePreference('theme', theme as 'light' | 'dark' | 'system');
    }
  }, [theme, preferences.theme, updatePreference]);

  return null;
}
