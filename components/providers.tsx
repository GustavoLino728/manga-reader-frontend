'use client';

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect, createContext, useContext } from 'react';
import { mantineTheme } from '@/lib/mantine-theme';

type ColorScheme = 'light' | 'dark';

interface ThemeContextType {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colorScheme: 'dark',
  toggleColorScheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    const stored = localStorage.getItem('mantine-color-scheme') as ColorScheme | null;
    if (stored) {
      setColorScheme(stored);
    }
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  useEffect(() => {
    // Sync with document class
    if (colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mantine-color-scheme', colorScheme);
  }, [colorScheme]);

  const toggleColorScheme = () => {
    setColorScheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
        <MantineProvider 
          theme={mantineTheme} 
          defaultColorScheme="dark"
          forceColorScheme={colorScheme}
        >
          {children}
        </MantineProvider>
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
}

export function ColorSchemeScriptWrapper() {
  return <ColorSchemeScript defaultColorScheme="dark" />;
}
