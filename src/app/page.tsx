'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CinematicIntro } from '@/components/CinematicIntro';
import { ALL_CARS } from '@/data';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const [introComplete, setIntroComplete] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!introComplete) {
    return <CinematicIntro onComplete={() => setIntroComplete(true)} />;
  }

  const featuredCars = ALL_CARS.filter((car) => car.featured);
  const chapterCars = ALL_CARS.filter((car) => car.chapterIndex);

  return (
    <div className="bg-background text-foreground w-full max-w-[100vw] overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-[calc(100svh-4rem)] md:min-h-[calc(100vh-4rem)] flex flex-col items-center justify-between relative overflow-hidden px-4 sm:px-6 py-8 sm:py-12">
        {/* Top spacer for balanced vertical distribution */}
        <div className="hidden sm:block h-4" />

        {/* Center Hero Block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="text-center w-full max-w-4xl mx-auto my-auto flex flex-col items-center"
        >
          <p className="font-eyebrow text-accent mb-3 sm:mb-4 tracking-widest text-[10px] sm:text-xs uppercase">
            SANCTUARY OF AUTOMOTIVE EXCELLENCE
          </p>

          <h1 className="font-display mb-3 sm:mb-5 text-balance w-full">
            THE COLLECTION
          </h1>

          <p className="font-subheading text-secondary mb-4 sm:mb-6 max-w-[340px] sm:max-w-xl mx-auto text-balance leading-relaxed">
            The World's Premier Luxury Automotive Marketplace
          </p>

          <p className="font-body text-tertiary max-w-[340px] sm:max-w-2xl mx-auto mb-8 sm:mb-10 text-balance hidden sm:block">
            Discover, configure, and reserve the world's most exclusive automobiles. From hypercars to luxury sedans, each
            vehicle is a masterpiece of engineering and design.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-[340px] sm:max-w-none sm:w-auto justify-center">
            <Link
              href="/cars"
              className="btn btn-primary w-full sm:w-auto min-h-[52px] sm:min-h-[48px] px-8 tracking-wider text-xs font-semibold"
            >
              BROWSE COLLECTION →
            </Link>
            <Link
              href="/test-drive"
              className="btn btn-secondary w-full sm:w-auto min-h-[52px] sm:min-h-[48px] px-8 tracking-wider text-xs font-semibold"
            >
              BOOK TEST DRIVE →
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="pt-6 sm:pt-4 text-center"
        >
          <p className="font-eyebrow text-tertiary mb-1.5 text-[9px] tracking-widest">SCROLL</p>
          <svg className="w-4 h-5 text-accent/80 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Chapter Navigation - 12 Cars */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-center mb-12 sm:mb-16"
          >
            <p className="font-eyebrow text-accent mb-2">CURATED MARQUES</p>
            <h2 className="font-headline mb-3 text-xl sm:text-2xl">CHAPTERS</h2>
            <p className="font-body text-secondary text-sm sm:text-base max-w-xl mx-auto text-balance">
              Explore our curated collection of the world's most exceptional vehicles
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {chapterCars.map((car, idx) => (
              <motion.div
                key={car.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
                viewport={{ once: true, margin: '-60px' }}
              >
                <Link
                  href={`/cars/${car.slug}`}
                  className="card card-hover group cursor-pointer block h-full flex flex-col p-5 sm:p-6"
                >
                  <div className="w-full h-48 sm:h-52 bg-gradient-to-br from-accent/10 to-transparent rounded-lg mb-5 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={car.heroImage}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `/placeholder-car.jpg`;
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-eyebrow text-accent text-[10px] tracking-widest mb-1.5">
                      CHAPTER {car.chapterIndex}
                    </p>
                    <h3 className="font-headline text-base sm:text-lg mb-2 text-foreground group-hover:text-accent transition-colors">
                      {car.brand} {car.model}
                    </h3>
                    <p className="font-body text-secondary text-xs sm:text-sm mb-5 line-clamp-2 leading-relaxed">
                      {car.tagline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/40 text-xs">
                    <span className="font-eyebrow text-secondary text-[10px]">{car.category}</span>
                    <span className="font-body text-accent font-medium">{formatCurrency(car.price)}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Manifesto Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 md:px-8 border-t border-border/40 bg-[#060606]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-center flex flex-col items-center"
          >
            <p className="font-eyebrow text-accent mb-3 tracking-widest text-[10px] sm:text-xs">THE MANIFESTO</p>
            <h2 className="font-display text-3xl sm:text-5xl mb-6 sm:mb-8 text-balance">THE PHILOSOPHY</h2>
            <p className="font-serif text-lg sm:text-2xl text-secondary italic leading-relaxed mb-6 max-w-2xl mx-auto text-balance">
              "A car is not mere transportation—it is a sanctuary of human aspiration, engineering prowess, and timeless beauty."
            </p>
            <p className="font-body text-tertiary text-xs sm:text-sm leading-relaxed mb-10 max-w-xl mx-auto text-balance">
              THE COLLECTION curates private allocations and bespoke vehicle configurations for discerning clients globally.
            </p>

            <Link
              href="/cars"
              className="btn btn-primary min-h-[52px] sm:min-h-[48px] px-8 tracking-wider text-xs"
            >
              EXPLORE FULL COLLECTION →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-center mb-12 sm:mb-16"
          >
            <p className="font-eyebrow text-accent mb-2">TAILORED EXCELLENCE</p>
            <h2 className="font-headline mb-3 text-xl sm:text-2xl">BESPOKE SERVICES</h2>
            <p className="font-body text-secondary text-sm sm:text-base max-w-xl mx-auto text-balance">
              From private test drives to bespoke configurations, we offer the highest level of personalized service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: 'Test Drive',
                description: 'Experience luxury at our private showrooms worldwide',
                icon: '🏁',
              },
              {
                title: 'Configure',
                description: 'Personalize every detail in our bespoke atelier',
                icon: '⚙️',
              },
              {
                title: 'Compare',
                description: 'Side-by-side technical specifications and details',
                icon: '📊',
              },
              {
                title: 'Reserve',
                description: 'Secure your vehicle with our concierge team',
                icon: '✓',
              },
            ].map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true, margin: '-40px' }}
                className="card p-5 sm:p-6"
              >
                <div className="text-2xl sm:text-3xl mb-3">{service.icon}</div>
                <h3 className="font-headline text-sm sm:text-base mb-2">{service.title}</h3>
                <p className="font-body text-secondary text-xs sm:text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showrooms Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-center mb-12 sm:mb-16"
          >
            <p className="font-eyebrow text-accent mb-2">GLOBAL PRESENCE</p>
            <h2 className="font-headline mb-3 text-xl sm:text-2xl">PRIVATE SHOWROOMS</h2>
            <p className="font-body text-secondary text-sm sm:text-base max-w-xl mx-auto text-balance">
              Visit our exclusive viewing suites in the world's finest locations
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {['Mumbai', 'Delhi', 'Bangalore', 'Dubai', 'London', 'Singapore'].map((city, idx) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.06 }}
                viewport={{ once: true, margin: '-40px' }}
                className="card card-hover text-center p-4 sm:p-5"
              >
                <h3 className="font-headline text-sm sm:text-base mb-1">{city}</h3>
                <p className="font-eyebrow text-accent text-[9px] tracking-wider">VIEWING SUITE</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <Link
              href="/showrooms"
              className="btn btn-secondary min-h-[50px] sm:min-h-[46px] px-6 text-xs tracking-wider"
            >
              VIEW ALL SHOWROOMS →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 border-t border-border/40">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="font-eyebrow text-accent mb-2">PRIVATE ACCESS</p>
            <h2 className="font-display text-2xl sm:text-4xl mb-4 text-balance">Ready to Explore?</h2>
            <p className="font-body text-secondary mb-8 sm:mb-10 text-xs sm:text-sm max-w-lg mx-auto text-balance leading-relaxed">
              Join our private community of automotive connoisseurs. Create your account to save favorites, track
              configurations, and connect with our concierge team.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-[340px] sm:max-w-none sm:w-auto mx-auto justify-center">
              <Link
                href="/register"
                className="btn btn-primary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider"
              >
                CREATE ACCOUNT →
              </Link>
              <Link
                href="/cars"
                className="btn btn-secondary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider"
              >
                BROWSE VEHICLES
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4 sm:px-6 md:px-8 bg-[#060606]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <p className="font-headline text-xs tracking-widest mb-3">THE COLLECTION</p>
              <p className="font-body text-tertiary text-xs leading-relaxed">
                The World's Premier Luxury Automotive Marketplace
              </p>
            </div>
            <div>
              <p className="font-eyebrow text-[10px] tracking-widest text-secondary mb-3">EXPLORE</p>
              <ul className="space-y-2 font-body text-secondary text-xs">
                <li>
                  <Link href="/cars" className="hover:text-accent transition-colors">
                    All Vehicles
                  </Link>
                </li>
                <li>
                  <Link href="/compare" className="hover:text-accent transition-colors">
                    Compare
                  </Link>
                </li>
                <li>
                  <Link href="/configure" className="hover:text-accent transition-colors">
                    Configure
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-eyebrow text-[10px] tracking-widest text-secondary mb-3">SERVICES</p>
              <ul className="space-y-2 font-body text-secondary text-xs">
                <li>
                  <Link href="/test-drive" className="hover:text-accent transition-colors">
                    Test Drive
                  </Link>
                </li>
                <li>
                  <Link href="/showrooms" className="hover:text-accent transition-colors">
                    Showrooms
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-accent transition-colors">
                    My Account
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-eyebrow text-[10px] tracking-widest text-secondary mb-3">CONCIERGE</p>
              <ul className="space-y-2 font-body text-secondary text-xs">
                <li>concierge@thecollection.co</li>
                <li>+1 (800) COLLECTION</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/30 pt-6">
            <p className="font-body text-tertiary text-[11px] text-center">
              © 2024 THE COLLECTION. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
