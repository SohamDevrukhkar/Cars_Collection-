'use client';

import './globals.css';
import { useEffect, useState } from 'react';
import { soundEngine } from '@/lib/sound';
import { Navigation } from '@/components/Navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Initialize audio engine
    if (soundEngine) {
      soundEngine.disableAudio();
    }

    // Prevent context menu on images
    document.addEventListener('contextmenu', (e) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
      }
    });
  }, []);

  if (!mounted) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
          <title>THE COLLECTION</title>
          <meta name="description" content="The World's Premier Luxury Automotive Marketplace" />
        </head>
        <body className="bg-background text-foreground w-full max-w-[100vw] overflow-x-hidden">
          <div className="bg-background min-h-[100svh] w-full" />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning className="w-full max-w-[100vw] overflow-x-hidden">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <title>THE COLLECTION</title>
        <meta name="description" content="The World's Premier Luxury Automotive Marketplace" />
        <meta name="theme-color" content="#060606" />
      </head>
      <body className="bg-background text-foreground w-full max-w-[100vw] overflow-x-hidden min-h-[100svh] relative">
        {/* Film grain overlay */}
        <div className="film-grain" />

        {/* Vignette overlay */}
        <div className="vignette" />

        {/* Light sweep */}
        <div className="light-sweep" />

        {/* Navigation */}
        <Navigation />

        {/* Main content */}
        <main className="w-full max-w-[100vw] overflow-x-hidden pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
