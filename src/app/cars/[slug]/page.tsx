'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CarSequence } from '@/components/CarSequence';
import { useResponsiveViewport } from '@/hooks/useResponsiveViewport';
import { getCarBySlug, ALL_CARS } from '@/data';
import { formatCurrency } from '@/lib/utils';
import type { SequenceState } from '@/hooks/usePinnedFrameSequence';

export default function CarDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const car = getCarBySlug(slug);
  const [sequenceReleased, setSequenceReleased] = useState(false);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showDebug] = useState<boolean>(
    typeof window !== 'undefined' &&
      (new URLSearchParams(window.location.search).get('debug') === '1' ||
        process.env.NODE_ENV === 'development')
  );

  // Get responsive viewport info
  const viewport = useResponsiveViewport();

  // Track scroll to hide indicator
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!car) {
    return (
      <div className="min-h-[100svh] bg-[#060606] text-foreground flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-display text-2xl sm:text-4xl mb-4">Vehicle Not Found</h1>
          <p className="font-body text-secondary text-sm mb-8">The requested vehicle is not in our private registry.</p>
          <Link href="/cars" className="btn btn-primary min-h-[50px] px-8 text-xs">
            RETURN TO COLLECTION →
          </Link>
        </div>
      </div>
    );
  }

  const relatedCars = ALL_CARS.filter((c) => c.slug !== slug && c.featured).slice(0, 3);
  const carFraming = car.framing ?? { scale: 1, offsetX: 0, offsetY: 0, backgroundColor: '#060606', feather: 32 };

  // Adjust scroll distance based on viewport for mobile responsiveness
  const scrollDistance =
    viewport.category === 'mobile' ? 1600 :
    viewport.category === 'tablet' ? 2000 :
    2400; // desktop default

  return (
    <div className="bg-[#060606] text-foreground w-full max-w-[100vw] overflow-x-hidden">
      {/* ============ HERO SECTION — Pinned Cinematic Canvas ============ */}
      <section className="relative h-[calc(100svh-4rem)] md:h-[calc(100vh-4rem)] overflow-hidden bg-[#060606] w-full">
        {/* Full-bleed canvas occupying entire viewport */}
        <CarSequence
          slug={car.slug}
          frameCount={car.frameCount}
          framePath={car.framePath}
          framing={carFraming}
          responsiveFraming={carFraming.responsive}
          className="absolute inset-0 w-full h-full"
          debug={showDebug}
          scrollDistance={scrollDistance}
          onScrollProgress={(p) => setSequenceProgress(p)}
          onStateChange={(state: SequenceState) => setSequenceReleased(state === 'RELEASED')}
        />

        {/* Seamless bottom gradient that dissolves into the next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(6,6,6,0) 0%, #060606 100%)',
            opacity: sequenceReleased ? 1 : 0.85,
            transition: 'opacity 600ms ease',
          }}
        />

        {/* Top Navigation - Back Button */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-8 z-30">
          <Link
            href="/cars"
            className="pointer-events-auto font-eyebrow text-tertiary hover:text-accent transition-colors duration-300 text-[11px] sm:text-xs tracking-wider flex items-center gap-1.5 py-2 px-3 rounded bg-[#060606]/60 backdrop-blur-sm border border-border/30 min-h-[44px]"
          >
            ← COLLECTION
          </Link>
        </div>

        {/* Hero Typography - Mobile-Optimized Clean Vertical Hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 flex flex-col justify-between pointer-events-none px-4 sm:px-6 py-6 sm:py-10 z-20 max-w-7xl mx-auto w-full"
        >
          {/* TOP OF STACK: Chapter & Brand */}
          <div className="text-center pt-12 sm:pt-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="font-eyebrow text-accent tracking-widest text-[9px] sm:text-[11px] md:text-xs mb-1 uppercase"
            >
              CHAPTER {car.chapterIndex || '01'}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="font-eyebrow text-secondary tracking-wide text-xs sm:text-sm uppercase"
            >
              {car.brand}
            </motion.p>
          </div>

          {/* CENTER OF STACK: Prominent Model Title */}
          <div className="text-center my-auto px-2">
            <motion.h1
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-foreground font-light tracking-wide text-balance"
            >
              {car.model}
            </motion.h1>
          </div>

          {/* BOTTOM OF STACK: Tagline & Supporting Details */}
          <div className="text-center pb-8 sm:pb-4 max-w-xl mx-auto px-2">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="font-serif text-xs sm:text-base md:text-xl text-accent italic leading-relaxed text-balance"
            >
              "{car.tagline}"
            </motion.p>
          </div>
        </motion.div>

        {/* Scroll Indicator - Bottom Right */}
        <motion.div
          animate={{ opacity: hasScrolled ? 0 : 1, y: hasScrolled ? 8 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 pointer-events-none z-20"
        >
          <div className="text-right">
            <p className="font-eyebrow text-tertiary text-[8px] sm:text-[9px] uppercase mb-1 tracking-widest">
              SWIPE / SCROLL
            </p>
            <motion.svg
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3.5 h-4 sm:w-4 sm:h-5 text-accent/80 ml-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </motion.svg>
          </div>
        </motion.div>
      </section>

      {/* ============ DESIGN LANGUAGE SECTION ============ */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 border-t border-border/30 bg-[#060606]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-center"
          >
            <p className="font-eyebrow text-accent tracking-widest text-[10px] sm:text-xs mb-4 sm:mb-6 uppercase">
              DESIGN LANGUAGE
            </p>

            <h2 className="font-serif text-2xl sm:text-4xl md:text-6xl text-foreground font-light leading-tight mb-6 sm:mb-8 text-balance">
              {car.design[0]?.title || 'Sculpted by Purpose'}
            </h2>

            <p className="font-body text-secondary text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto text-balance">
              {car.design[0]?.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ MANIFESTO / PHILOSOPHY SECTION ============ */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 border-t border-border/30 bg-gradient-to-b from-[#060606] to-[#060606]/95">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="font-eyebrow text-accent tracking-widest text-[10px] sm:text-xs mb-4 sm:mb-6 uppercase">
              PHILOSOPHY
            </p>

            <h2 className="font-serif text-2xl sm:text-4xl md:text-6xl text-foreground font-light leading-tight mb-8 sm:mb-12 text-balance">
              {car.heroStatement}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-start">
              <p className="font-body text-secondary text-sm sm:text-base leading-relaxed">
                {car.manifesto}
              </p>

              {/* Quick Key Metrics on Desktop & Mobile */}
              <div className="space-y-6 sm:space-y-8 border-t md:border-t-0 md:border-l border-border/30 pt-6 md:pt-0 md:pl-8">
                <div>
                  <p className="font-eyebrow text-tertiary text-[10px] uppercase mb-1 tracking-wider">Total Power</p>
                  <p className="font-serif text-2xl sm:text-3xl text-foreground font-light">{car.specs.power}</p>
                </div>
                <div>
                  <p className="font-eyebrow text-tertiary text-[10px] uppercase mb-1 tracking-wider">Acceleration</p>
                  <p className="font-serif text-2xl sm:text-3xl text-foreground font-light">{car.specs.acceleration}</p>
                </div>
                <div>
                  <p className="font-eyebrow text-tertiary text-[10px] uppercase mb-1 tracking-wider">Top Velocity</p>
                  <p className="font-serif text-2xl sm:text-3xl text-foreground font-light">{car.specs.topSpeed}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ PERFORMANCE SPECIFICATION SHEET ============ */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 border-t border-border/30 bg-[#060606]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="font-eyebrow text-accent tracking-widest text-[10px] sm:text-xs mb-8 sm:mb-12 uppercase text-center sm:text-left">
              PERFORMANCE ARCHITECTURE
            </p>

            {/* 2x2 Grid on Mobile, 3-column on Desktop with Large Numbers (28-36px mobile, 48-60px desktop) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-12 sm:mb-16">
              <div className="card p-4 sm:p-6 text-center sm:text-left">
                <p className="font-serif text-2xl sm:text-4xl md:text-5xl text-accent font-light mb-1 sm:mb-2">
                  {car.specs.power.split(' ')[0] || car.specs.power}
                </p>
                <p className="font-eyebrow text-tertiary text-[9px] sm:text-[10px] uppercase tracking-wider">
                  Power (HP / PS)
                </p>
              </div>

              <div className="card p-4 sm:p-6 text-center sm:text-left">
                <p className="font-serif text-2xl sm:text-4xl md:text-5xl text-accent font-light mb-1 sm:mb-2">
                  {car.specs.acceleration.split(' ')[0] || car.specs.acceleration}
                </p>
                <p className="font-eyebrow text-tertiary text-[9px] sm:text-[10px] uppercase tracking-wider">
                  0–100 km/h
                </p>
              </div>

              <div className="card p-4 sm:p-6 text-center sm:text-left">
                <p className="font-serif text-2xl sm:text-4xl md:text-5xl text-accent font-light mb-1 sm:mb-2">
                  {car.specs.topSpeed.split(' ')[0] || car.specs.topSpeed}
                </p>
                <p className="font-eyebrow text-tertiary text-[9px] sm:text-[10px] uppercase tracking-wider">
                  Top Speed
                </p>
              </div>

              <div className="card p-4 sm:p-6 text-center sm:text-left">
                <p className="font-serif text-2xl sm:text-4xl md:text-5xl text-accent font-light mb-1 sm:mb-2">
                  {car.specs.curbWeight ? car.specs.curbWeight.split(' ')[0] : 'Bespoke'}
                </p>
                <p className="font-eyebrow text-tertiary text-[9px] sm:text-[10px] uppercase tracking-wider">
                  Curb Weight
                </p>
              </div>
            </div>

            {/* Detailed Technical Specs - Single Column on Mobile, 3 Column on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-8 border-t border-border/30">
              {/* Powertrain */}
              <div className="card p-5 sm:p-6">
                <p className="font-eyebrow text-accent text-xs uppercase mb-4 tracking-wider">Powertrain</p>
                <div className="space-y-3 text-xs sm:text-sm">
                  {car.specs.engine && (
                    <div>
                      <p className="font-eyebrow text-tertiary text-[10px] uppercase">Engine</p>
                      <p className="font-body text-secondary mt-0.5">{car.specs.engine}</p>
                    </div>
                  )}
                  {car.specs.transmission && (
                    <div>
                      <p className="font-eyebrow text-tertiary text-[10px] uppercase">Transmission</p>
                      <p className="font-body text-secondary mt-0.5">{car.specs.transmission}</p>
                    </div>
                  )}
                  {car.specs.torque && (
                    <div>
                      <p className="font-eyebrow text-tertiary text-[10px] uppercase">Peak Torque</p>
                      <p className="font-body text-secondary mt-0.5">{car.specs.torque}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamics */}
              <div className="card p-5 sm:p-6">
                <p className="font-eyebrow text-accent text-xs uppercase mb-4 tracking-wider">Dynamics</p>
                <div className="space-y-3 text-xs sm:text-sm">
                  {car.specs.drivetrain && (
                    <div>
                      <p className="font-eyebrow text-tertiary text-[10px] uppercase">Drivetrain</p>
                      <p className="font-body text-secondary mt-0.5">{car.specs.drivetrain}</p>
                    </div>
                  )}
                  {car.specs.curbWeight && (
                    <div>
                      <p className="font-eyebrow text-tertiary text-[10px] uppercase">Curb Weight</p>
                      <p className="font-body text-secondary mt-0.5">{car.specs.curbWeight}</p>
                    </div>
                  )}
                  {car.specs.dragCoefficient && (
                    <div>
                      <p className="font-eyebrow text-tertiary text-[10px] uppercase">Drag Coefficient</p>
                      <p className="font-body text-secondary mt-0.5">{car.specs.dragCoefficient}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Atelier / Valuation */}
              <div className="card p-5 sm:p-6">
                <p className="font-eyebrow text-accent text-xs uppercase mb-4 tracking-wider">Atelier & Value</p>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <p className="font-eyebrow text-tertiary text-[10px] uppercase">Base Allocation</p>
                    <p className="font-body text-accent font-medium mt-0.5">{formatCurrency(car.price)}</p>
                  </div>
                  <div>
                    <p className="font-eyebrow text-tertiary text-[10px] uppercase">Category</p>
                    <p className="font-body text-secondary mt-0.5">{car.category}</p>
                  </div>
                  <div>
                    <p className="font-eyebrow text-tertiary text-[10px] uppercase">Registry Status</p>
                    <p className="font-body text-emerald-400 mt-0.5">Private Allocation Available</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ ENGINEERING SECTION ============ */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 border-t border-border/30 bg-gradient-to-b from-[#060606] to-[#060606]/95">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="font-eyebrow text-accent tracking-widest text-[10px] sm:text-xs mb-4 sm:mb-6 uppercase">
              ENGINEERING
            </p>

            <h2 className="font-serif text-2xl sm:text-4xl md:text-6xl text-foreground font-light leading-tight mb-8 sm:mb-12 text-balance">
              The Machine Within
            </h2>

            <div className="space-y-6 sm:space-y-8">
              {car.engineering.components.map((component, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="border-l border-accent/40 pl-4 sm:pl-6 py-2 sm:py-3"
                >
                  <p className="font-eyebrow text-accent text-xs uppercase mb-1.5 tracking-wider">
                    {component.name}
                  </p>
                  <p className="font-body text-secondary text-xs sm:text-sm leading-relaxed">
                    {component.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CRAFTSMANSHIP SECTION ============ */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 border-t border-border/30 bg-[#060606]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="font-eyebrow text-accent tracking-widest text-[10px] sm:text-xs mb-4 sm:mb-6 uppercase">
              CRAFTSMANSHIP
            </p>

            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-foreground font-light leading-tight mb-4 sm:mb-6 text-balance">
              {car.craftsmanship.headline}
            </h2>

            <p className="font-body text-secondary text-xs sm:text-sm md:text-base leading-relaxed mb-8 sm:mb-12 max-w-2xl">
              {car.craftsmanship.narrative}
            </p>

            {/* Materials Grid - 1-column on mobile, 2-col on sm, 3-col on md */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {car.craftsmanship.materials.map((material, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="p-4 sm:p-5 card text-xs sm:text-sm text-secondary"
                >
                  <p className="font-body">{material}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ RELATED COLLECTION ============ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 border-t border-border/30 bg-gradient-to-b from-[#060606] to-[#060606]/95">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="font-eyebrow text-accent tracking-widest text-[10px] sm:text-xs mb-2 uppercase text-center sm:text-left">
              CURATED PEERS
            </p>
            <h3 className="font-headline text-lg sm:text-2xl mb-8 sm:mb-12 text-center sm:text-left">
              EXPLORE THE COLLECTION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {relatedCars.map((relatedCar, idx) => (
                <motion.div
                  key={relatedCar.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/cars/${relatedCar.slug}`}
                    className="card card-hover group block p-4 sm:p-6 h-full flex flex-col"
                  >
                    <div className="relative overflow-hidden rounded mb-4 h-44 sm:h-52 bg-[#060606]">
                      <img
                        src={relatedCar.heroImage}
                        alt={`${relatedCar.brand} ${relatedCar.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `/placeholder-car.jpg`;
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <p className="font-eyebrow text-accent text-[10px] tracking-widest mb-1 uppercase">
                        {relatedCar.brand}
                      </p>
                      <h4 className="font-serif text-lg sm:text-xl text-foreground font-light mb-2 group-hover:text-accent transition-colors">
                        {relatedCar.model}
                      </h4>
                      <p className="font-body text-secondary text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
                        {relatedCar.tagline}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/30 flex items-center justify-between text-xs">
                      <span className="font-eyebrow text-secondary text-[10px]">{relatedCar.category}</span>
                      <span className="font-body text-accent font-medium">VIEW CHAPTER →</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FOOTER CTA ACTIONS ============ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 border-t border-border/30 bg-[#060606]">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="font-eyebrow text-accent text-[10px] sm:text-xs tracking-widest mb-2 uppercase">
              ACQUISITION & ATELIER
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl text-foreground font-light mb-4 sm:mb-6 text-balance">
              Experience the {car.brand} {car.model}
            </h2>
            <p className="font-body text-secondary text-xs sm:text-sm mb-8 max-w-lg mx-auto text-balance leading-relaxed">
              Connect with our private concierge to configure custom bespoke specifications or reserve an immediate allocation.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-[340px] sm:max-w-none sm:w-auto mx-auto justify-center">
              <Link
                href={`/configure/${slug}`}
                className="btn btn-primary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider"
              >
                CONFIGURE VEHICLE →
              </Link>
              <Link
                href={`/reserve/${slug}`}
                className="btn btn-secondary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider"
              >
                RESERVE ALLOCATION
              </Link>
              <Link
                href="/test-drive"
                className="btn btn-secondary min-h-[52px] sm:min-h-[48px] px-8 text-xs tracking-wider"
              >
                BOOK TEST DRIVE
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
