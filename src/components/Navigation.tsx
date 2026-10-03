'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const desktopNavItems = [
    { label: 'CARS', href: '/cars' },
    { label: 'SHOWROOMS', href: '/showrooms' },
    { label: 'COMPARE', href: '/compare' },
    { label: 'CONFIGURE', href: '/configure' },
    { label: 'RESERVE', href: '/reserve' },
  ];

  const mobileNavItems = [
    { label: 'CARS', href: '/cars', description: 'Explore the curated collection' },
    { label: 'SHOWROOMS', href: '/showrooms', description: 'Global private viewing suites' },
    { label: 'COMPARE', href: '/compare', description: 'Side-by-side vehicle analysis' },
    { label: 'CONFIGURE', href: '/configure', description: 'Bespoke vehicle customization' },
    { label: 'FINANCE', href: '/test-drive', description: 'Financing & test drive inquiries' },
    { label: 'ACCOUNT', href: '/account', description: 'Client portal & reservations' },
    { label: 'RESERVE', href: '/reserve', description: 'Acquire an allocation' },
  ];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -1 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full max-w-[100vw] ${
          isScrolled
            ? 'backdrop-blur-md bg-background/90 border-b border-border/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between h-16">
          {/* Logo / Home Link */}
          <Link
            href="/"
            className="font-eyebrow text-foreground tracking-widest text-[11px] sm:text-xs hover:text-accent transition-colors duration-300 flex-shrink-0"
          >
            THE COLLECTION
          </Link>

          {/* Desktop Center Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {desktopNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-eyebrow tracking-widest text-xs transition-colors duration-300 ${
                  pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                    ? 'text-accent'
                    : 'text-secondary hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Account Link */}
            <Link
              href="/account"
              className={`hidden md:inline-block font-eyebrow tracking-widest text-xs transition-colors duration-300 ${
                pathname?.startsWith('/account')
                  ? 'text-accent'
                  : 'text-secondary hover:text-foreground'
              }`}
            >
              ACCOUNT
            </Link>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden flex items-center justify-center w-11 h-11 -mr-2 text-secondary hover:text-foreground focus:outline-none transition-colors"
              aria-label="Open Navigation Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Full-Screen Dedicated Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#060606] flex flex-col justify-between overflow-y-auto px-6 py-6 sm:px-8 w-full max-w-[100vw]"
            style={{
              paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
              paddingBottom: 'max(1.75rem, env(safe-area-inset-bottom))',
            }}
          >
            {/* Overlay Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-5">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-eyebrow text-foreground tracking-widest text-xs uppercase"
              >
                THE COLLECTION
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-11 h-11 -mr-2 text-secondary hover:text-accent focus:outline-none transition-colors"
                aria-label="Close Navigation Menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="py-6 sm:py-8 flex flex-col justify-center space-y-2 my-auto">
              {mobileNavItems.map((item, index) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname?.startsWith(item.href));

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + index * 0.035, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-baseline justify-between py-3 border-b border-border/20 transition-all"
                    >
                      <div className="flex flex-col">
                        <span
                          className={`font-serif text-2xl sm:text-3xl font-light tracking-wide transition-colors ${
                            isActive
                              ? 'text-accent'
                              : 'text-foreground group-hover:text-accent'
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="font-body text-[11px] text-tertiary mt-0.5 tracking-normal">
                          {item.description}
                        </span>
                      </div>

                      <span className="font-sans text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Overlay Footer */}
            <div className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-tertiary">
              <p className="font-eyebrow text-[10px] tracking-widest text-secondary">
                SANCTUARY OF AUTOMOTIVE EXCELLENCE
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/test-drive"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-accent transition-colors"
                >
                  Concierge
                </Link>
                <span>•</span>
                <Link
                  href="/showrooms"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-accent transition-colors"
                >
                  Suites
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
