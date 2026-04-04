import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { Providers, ColorSchemeScriptWrapper } from '@/components/providers';
import { Header } from '@/components/header';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'MangaReader - Leia Mangás Online',
  description: 'Leia seus mangás favoritos online gratuitamente. Milhares de títulos atualizados diariamente.',
  keywords: ['manga', 'mangá', 'leitor', 'online', 'gratuito', 'português'],
  authors: [{ name: 'MangaReader' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MangaReader',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0f12' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <ColorSchemeScriptWrapper />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border bg-card py-6">
              <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
                <p>MangaReader - Todos os direitos reservados</p>
              </div>
            </footer>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
