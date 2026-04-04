import { createTheme, MantineColorsTuple } from '@mantine/core';

const frostedBlue: MantineColorsTuple = [
  '#e8fbfc',
  '#d5f4f7',
  '#a7e8ed',
  '#75dce4',
  '#4ed2dc',
  '#36ccd7',
  '#25c9d5',
  '#12b1bc',
  '#009ea8',
  '#008992',
];

const jetBlack: MantineColorsTuple = [
  '#f3f4f5',
  '#e4e5e7',
  '#c6c9cd',
  '#a6abb3',
  '#8b929c',
  '#79818d',
  '#6f7885',
  '#5d6573',
  '#525a67',
  '#434c5c',
];

const burntTangerine: MantineColorsTuple = [
  '#ffebe7',
  '#fdd6d0',
  '#f5aba0',
  '#ee7d6d',
  '#e85643',
  '#e53f28',
  '#e4331a',
  '#cb260e',
  '#b61f09',
  '#a01404',
];

export const mantineTheme = createTheme({
  primaryColor: 'frostedBlue',
  colors: {
    frostedBlue,
    jetBlack,
    burntTangerine,
  },
  fontFamily: 'var(--font-sans)',
  fontFamilyMonospace: 'var(--font-mono)',
  headings: {
    fontFamily: 'var(--font-sans)',
    fontWeight: '600',
  },
  radius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  defaultRadius: 'md',
  cursorType: 'pointer',
  other: {
    colors: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      card: 'var(--card)',
      cardForeground: 'var(--card-foreground)',
      primary: 'var(--primary)',
      primaryForeground: 'var(--primary-foreground)',
      secondary: 'var(--secondary)',
      secondaryForeground: 'var(--secondary-foreground)',
      muted: 'var(--muted)',
      mutedForeground: 'var(--muted-foreground)',
      accent: 'var(--accent)',
      accentForeground: 'var(--accent-foreground)',
      destructive: 'var(--destructive)',
      border: 'var(--border)',
      input: 'var(--input)',
      ring: 'var(--ring)',
    },
  },
});
