'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ALL_CARS } from '@/data';

interface CinematicIntroProps {
  onComplete?: () => void;
}

const SEQUENCE_SLUGS = [
  'rolls-royce-spectre',
  'bugatti-tourbillon',
  'ferrari-296-gtb',
  'bentley-flying-spur',
  'koenigsegg-jesko',
  'lamborghini-revuelto',
  'lucid-air-sapphire',
  'rolls-royce-ghost',
  'mclaren-w1',
  'aston-martin-dbx',
  'lamborghini-urus',
  'range-rover',
];

const INTRO_DURATION = 3500;
const CAR_DISPLAY_DURATION = 3500;
const BLACK_SPACE_DURATION = 800;

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<string>('initial');
  const [currentIndex, setCurrentIndex] = useState(-1);

  const completeAndRedirect = useCallback(() => {
    if (onComplete) {
      onComplete();
    } else {
      router.push('/cars');
    }
  }, [onComplete, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        completeAndRedirect();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [completeAndRedirect]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (phase === 'initial') {
      timeoutId = setTimeout(() => {
        setPhase('black-intro');
      }, INTRO_DURATION);
    } else if (phase === 'black-intro') {
      timeoutId = setTimeout(() => {
        setCurrentIndex(0);
        setPhase('car');
      }, 800);
    } else if (phase === 'car') {
      timeoutId = setTimeout(() => {
        setPhase('black-mid');
      }, CAR_DISPLAY_DURATION);
    } else if (phase === 'black-mid') {
      timeoutId = setTimeout(() => {
        if (currentIndex < SEQUENCE_SLUGS.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setPhase('car');
        } else {
          setPhase('fade-out');
        }
      }, BLACK_SPACE_DURATION);
    } else if (phase === 'fade-out') {
      timeoutId = setTimeout(() => {
        completeAndRedirect();
      }, 800);
    }

    return () => clearTimeout(timeoutId);
  }, [phase, currentIndex, completeAndRedirect]);

  const currentCar =
    phase === 'car' && currentIndex >= 0 ? ALL_CARS.find((c) => c.slug === SEQUENCE_SLUGS[currentIndex]) : null;

  return (
    <div className="fixed inset-0 bg-[#060606] z-50 flex items-center justify-center overflow-hidden w-full max-w-[100vw]">
      <div className="absolute bottom-6 right-6 z-50">
        <button
          onClick={completeAndRedirect}
          className="font-eyebrow text-tertiary hover:text-accent transition-colors duration-300 tracking-wider text-[11px] sm:text-xs min-h-[44px] px-3 py-2 flex items-center"
        >
          ENTER COLLECTION →
        </button>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'initial' && (
          <motion.div
            key="intro-title"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="text-center flex flex-col items-center justify-center px-4 space-y-4 sm:space-y-6 max-w-[90vw]"
          >
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl text-foreground tracking-wider uppercase">
              The Collection
            </h1>
            <p className="font-eyebrow text-accent tracking-widest text-xs sm:text-sm uppercase">
              Sanctuary of Automotive Excellence
            </p>
          </motion.div>
        )}

        {phase === 'car' && currentCar && (
          <motion.div
            key={`car-${currentCar.slug}`}
            className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-12 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent opacity-80 z-10 pointer-events-none" />

              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 1.04 }}
                animate={{ scale: 1 }}
                transition={{ duration: CAR_DISPLAY_DURATION / 1000, ease: 'linear' }}
              >
                <div
                  className="w-full h-[50vh] sm:h-[65vh] md:h-[80vh] bg-contain bg-center bg-no-repeat opacity-80"
                  style={{
                    backgroundImage: `url(${currentCar.heroImage})`,
                    maskImage: 'linear-gradient(to top, transparent 0%, black 20%, black 80%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%, black 80%, transparent 100%)',
                  }}
                />
              </motion.div>

              <div className="relative z-20 text-center flex flex-col items-center mt-[35vh] sm:mt-[45vh] md:mt-[50vh] px-4">
                <p className="font-eyebrow text-accent tracking-widest text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-3 uppercase">
                  {currentCar.category}
                </p>
                <h2 className="font-display text-3xl sm:text-5xl md:text-7xl text-foreground mb-1 shadow-sm drop-shadow-2xl">
                  {currentCar.brand}
                </h2>
                <h3 className="font-serif text-xl sm:text-3xl md:text-5xl text-foreground/90 italic mb-4 sm:mb-6 drop-shadow-lg">
                  {currentCar.model}
                </h3>

                <div className="flex gap-6 sm:gap-8 border-t border-border/50 pt-4 sm:pt-6">
                  <div className="text-center">
                    <p className="font-eyebrow text-tertiary text-[9px] sm:text-[10px] uppercase mb-0.5">POWER</p>
                    <p className="font-body text-secondary text-xs sm:text-sm md:text-base">{currentCar.specs.power}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-eyebrow text-tertiary text-[9px] sm:text-[10px] uppercase mb-0.5">TOP SPEED</p>
                    <p className="font-body text-secondary text-xs sm:text-sm md:text-base">{currentCar.specs.topSpeed}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
