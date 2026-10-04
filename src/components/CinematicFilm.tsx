'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_CARS, getCarBySlug } from '@/data';
import { FilmCanvas } from './FilmCanvas';
import { soundEngine } from '@/lib/sound';
import type { Car } from '@/types';

export interface FilmChapterData {
  chapterNumber: string;
  slug: string;
  brand: string;
  model: string;
  category: string;
  headline: string;
  mood: string;
  specs: {
    power: string;
    topSpeed: string;
    acceleration: string;
  };
}

export const FILM_CHAPTERS: FilmChapterData[] = [
  {
    chapterNumber: '01',
    slug: 'rolls-royce-spectre',
    brand: 'ROLLS-ROYCE',
    model: 'SPECTRE',
    category: 'Electric Luxury',
    headline: 'THE SILENCE OF POWER.',
    mood: 'quiet, architectural, sophisticated',
    specs: { power: '577 HP', topSpeed: '250 km/h', acceleration: '4.5 s' },
  },
  {
    chapterNumber: '02',
    slug: 'bugatti-tourbillon',
    brand: 'BUGATTI',
    model: 'TOURBILLON',
    category: 'Hypercar',
    headline: 'ENGINEERED BEYOND ORDINARY.',
    mood: 'technical, dramatic, mechanical',
    specs: { power: '1,800 HP', topSpeed: '445 km/h', acceleration: '2.0 s' },
  },
  {
    chapterNumber: '03',
    slug: 'ferrari-296-gtb',
    brand: 'FERRARI',
    model: '296 GTB',
    category: 'Supercar',
    headline: 'PURE PERFORMANCE.',
    mood: 'Italian, sensual, athletic',
    specs: { power: '830 CV', topSpeed: '330 km/h', acceleration: '2.9 s' },
  },
  {
    chapterNumber: '04',
    slug: 'bentley-flying-spur',
    brand: 'BENTLEY',
    model: 'FLYING SPUR',
    category: 'Luxury Sedan',
    headline: 'CRAFTED IN MOTION.',
    mood: 'warm, elegant, architectural',
    specs: { power: '782 HP', topSpeed: '285 km/h', acceleration: '3.5 s' },
  },
  {
    chapterNumber: '05',
    slug: 'koenigsegg-jesko',
    brand: 'KOENIGSEGG',
    model: 'JESKO',
    category: 'Hypercar',
    headline: 'BEYOND LIMITS.',
    mood: 'futuristic, technical, extreme',
    specs: { power: '1,600 HP', topSpeed: '480+ km/h', acceleration: '2.5 s' },
  },
  {
    chapterNumber: '06',
    slug: 'lamborghini-revuelto',
    brand: 'LAMBORGHINI',
    model: 'REVUELTO',
    category: 'Supercar',
    headline: 'THE V12, REIMAGINED.',
    mood: 'dramatic, aggressive, sculptural',
    specs: { power: '1,015 CV', topSpeed: '350 km/h', acceleration: '2.5 s' },
  },
  {
    chapterNumber: '07',
    slug: 'lucid-air-sapphire',
    brand: 'LUCID',
    model: 'AIR SAPPHIRE',
    category: 'Electric Performance',
    headline: 'PERFORMANCE, ELECTRIFIED.',
    mood: 'minimal, futuristic, silent',
    specs: { power: '1,234 HP', topSpeed: '330 km/h', acceleration: '1.89 s' },
  },
  {
    chapterNumber: '08',
    slug: 'rolls-royce-ghost',
    brand: 'ROLLS-ROYCE',
    model: 'GHOST',
    category: 'Luxury Sedan',
    headline: 'CRAFTED IN SILENCE.',
    mood: 'understated, cinematic, luxurious',
    specs: { power: '563 HP', topSpeed: '250 km/h', acceleration: '4.8 s' },
  },
  {
    chapterNumber: '09',
    slug: 'mclaren-w1',
    brand: 'McLAREN',
    model: 'W1',
    category: 'Hypercar',
    headline: 'FORM. FUNCTION. OBSESSION.',
    mood: 'aerodynamic, technical, motorsport-inspired',
    specs: { power: '1,275 PS', topSpeed: '350 km/h', acceleration: '2.7 s' },
  },
  {
    chapterNumber: '10',
    slug: 'aston-martin-dbx',
    brand: 'ASTON MARTIN',
    model: 'DBX',
    category: 'Luxury SUV',
    headline: 'THE GRAND TOURER, ELEVATED.',
    mood: 'refined, expansive, adventurous',
    specs: { power: '707 PS', topSpeed: '310 km/h', acceleration: '3.3 s' },
  },
  {
    chapterNumber: '11',
    slug: 'lamborghini-urus',
    brand: 'LAMBORGHINI',
    model: 'URUS',
    category: 'Performance SUV',
    headline: 'POWER WITHOUT BOUNDARIES.',
    mood: 'powerful, dark, aggressive',
    specs: { power: '800 CV', topSpeed: '312 km/h', acceleration: '3.4 s' },
  },
  {
    chapterNumber: '12',
    slug: 'range-rover',
    brand: 'RANGE ROVER',
    model: 'AUTOBIOGRAPHY',
    category: 'Luxury SUV',
    headline: 'COMMANDING PRESENCE.',
    mood: 'architectural, calm, powerful',
    specs: { power: '530 HP', topSpeed: '250 km/h', acceleration: '4.6 s' },
  },
];

interface CinematicFilmProps {
  onComplete: () => void;
}

const CHAPTER_DURATION_MS = 7200; // Total chapter time

export function CinematicFilm({ onComplete }: CinematicFilmProps) {
  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(0);
  const [isFinalChapter, setIsFinalChapter] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [isTransitioningOut, setIsTransitioningOut] = useState<boolean>(false);

  // Chapter sub-timeline state (0 to 1)
  const [chapterProgress, setChapterProgress] = useState<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const elapsedOffsetRef = useRef<number>(0);

  // Current active car data
  const currentChapter = FILM_CHAPTERS[currentChapterIdx];
  const carData: Car | undefined = useMemo(() => {
    if (!currentChapter) return undefined;
    return getCarBySlug(currentChapter.slug);
  }, [currentChapter]);

  // Preload upcoming chapter frame 0 in background
  useEffect(() => {
    const nextIdx = currentChapterIdx + 1;
    if (nextIdx < FILM_CHAPTERS.length) {
      const nextSlug = FILM_CHAPTERS[nextIdx].slug;
      const img = new Image();
      img.src = `/cars/${nextSlug}/frames/frame-0001.jpg`;
      if ('decode' in img) {
        img.decode().catch(() => {});
      }
    }
  }, [currentChapterIdx]);

  // Handle completion / exploration
  const handleExploreCollection = useCallback(() => {
    setIsTransitioningOut(true);
    setTimeout(() => {
      onComplete();
    }, 900);
  }, [onComplete]);

  // Jump to specific chapter cleanly via black reset
  const jumpToChapter = useCallback((index: number) => {
    setIsFinalChapter(false);
    setCurrentChapterIdx(index);
    setChapterProgress(0);
    elapsedOffsetRef.current = 0;
    startTimeRef.current = Date.now();
  }, []);

  // Next chapter
  const nextChapter = useCallback(() => {
    if (currentChapterIdx < FILM_CHAPTERS.length - 1) {
      jumpToChapter(currentChapterIdx + 1);
    } else {
      setIsFinalChapter(true);
      setChapterProgress(0);
      elapsedOffsetRef.current = 0;
      startTimeRef.current = Date.now();
    }
  }, [currentChapterIdx, jumpToChapter]);

  // Prev chapter
  const prevChapter = useCallback(() => {
    if (isFinalChapter) {
      setIsFinalChapter(false);
      jumpToChapter(FILM_CHAPTERS.length - 1);
    } else if (currentChapterIdx > 0) {
      jumpToChapter(currentChapterIdx - 1);
    }
  }, [currentChapterIdx, isFinalChapter, jumpToChapter]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || (e.key === 'Enter' && isFinalChapter)) {
        handleExploreCollection();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextChapter();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevChapter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleExploreCollection, isFinalChapter, nextChapter, prevChapter]);

  // Main RAF Playback Timeline Engine
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (isPlaying && !isTransitioningOut) {
        const now = Date.now();
        const elapsed = now - startTimeRef.current + elapsedOffsetRef.current;
        const prog = Math.min(1, elapsed / CHAPTER_DURATION_MS);
        setChapterProgress(prog);

        if (prog >= 1) {
          if (!isFinalChapter) {
            if (currentChapterIdx < FILM_CHAPTERS.length - 1) {
              setCurrentChapterIdx((prev) => prev + 1);
              setChapterProgress(0);
              elapsedOffsetRef.current = 0;
              startTimeRef.current = Date.now();
            } else {
              setIsFinalChapter(true);
              setChapterProgress(0);
              elapsedOffsetRef.current = 0;
              startTimeRef.current = Date.now();
            }
          }
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [currentChapterIdx, isFinalChapter, isPlaying, isTransitioningOut]);

  // Pause / Resume time tracking
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      elapsedOffsetRef.current += Date.now() - startTimeRef.current;
      setIsPlaying(false);
    } else {
      startTimeRef.current = Date.now();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Audio toggle
  const toggleAudio = useCallback(() => {
    if (soundEngine) {
      const active = soundEngine.toggleAudio();
      setIsAudioEnabled(active);
    }
  }, []);

  // Compute staged opacities according to the strict chapter choreography:
  // Vehicle title entrance:
  //   brand appears first (t: 0.06 -> 0.16)
  //   model appears (t: 0.14 -> 0.24)
  //   headline fades in (t: 0.22 -> 0.32)
  //   vehicle becomes visible (t: 0.28 -> 0.38)
  // Vehicle exit:
  //   headline fades (t: 0.76 -> 0.82)
  //   model fades (t: 0.81 -> 0.87)
  //   vehicle fades into black (t: 0.85 -> 0.92)
  //   short black hold (t: 0.92 -> 1.00, ~580ms)
  //   next chapter

  const stageOpacities = useMemo(() => {
    if (isFinalChapter) {
      return {
        brand: 0,
        model: 0,
        headline: 0,
        vehicle: 0,
        specs: 0,
      };
    }

    const p = chapterProgress;

    // Brand: in 0.06..0.16, out 0.81..0.87
    let brand = 0;
    if (p >= 0.06 && p < 0.16) brand = (p - 0.06) / 0.1;
    else if (p >= 0.16 && p <= 0.81) brand = 1;
    else if (p > 0.81 && p <= 0.87) brand = 1 - (p - 0.81) / 0.06;

    // Model: in 0.14..0.24, out 0.81..0.87
    let model = 0;
    if (p >= 0.14 && p < 0.24) model = (p - 0.14) / 0.1;
    else if (p >= 0.24 && p <= 0.81) model = 1;
    else if (p > 0.81 && p <= 0.87) model = 1 - (p - 0.81) / 0.06;

    // Headline: in 0.22..0.32, out 0.76..0.82
    let headline = 0;
    if (p >= 0.22 && p < 0.32) headline = (p - 0.22) / 0.1;
    else if (p >= 0.32 && p <= 0.76) headline = 1;
    else if (p > 0.76 && p <= 0.82) headline = 1 - (p - 0.76) / 0.06;

    // Vehicle Canvas: in 0.28..0.38, out 0.85..0.92
    let vehicle = 0;
    if (p >= 0.28 && p < 0.38) vehicle = (p - 0.28) / 0.1;
    else if (p >= 0.38 && p <= 0.85) vehicle = 1;
    else if (p > 0.85 && p <= 0.92) vehicle = 1 - (p - 0.85) / 0.07;

    // Specs: in 0.34..0.42, out 0.76..0.82
    let specs = 0;
    if (p >= 0.34 && p < 0.42) specs = (p - 0.34) / 0.08;
    else if (p >= 0.42 && p <= 0.76) specs = 1;
    else if (p > 0.76 && p <= 0.82) specs = 1 - (p - 0.76) / 0.06;

    return {
      brand: Math.max(0, Math.min(1, brand)),
      model: Math.max(0, Math.min(1, model)),
      headline: Math.max(0, Math.min(1, headline)),
      vehicle: Math.max(0, Math.min(1, vehicle)),
      specs: Math.max(0, Math.min(1, specs)),
    };
  }, [chapterProgress, isFinalChapter]);

  // Frame scrubbing calculation over the vehicle's visible chapter window (0.28 to 0.85)
  const currentScrubbedFrame = useMemo(() => {
    if (chapterProgress < 0.28) return 0;
    if (chapterProgress > 0.85) return 180;
    const activeProg = (chapterProgress - 0.28) / (0.85 - 0.28);
    // Smooth scrub from frame 0 to 180
    return Math.min(239, Math.floor(activeProg * 180));
  }, [chapterProgress]);

  // Subtle camera scale drift during the chapter
  const cameraScale = useMemo(() => {
    return 1.0 + chapterProgress * 0.024;
  }, [chapterProgress]);

  return (
    <div
      className="fixed inset-0 z-50 bg-[#060606] text-foreground select-none overflow-hidden flex flex-col justify-between"
      style={{
        opacity: isTransitioningOut ? 0 : 1,
        transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Visual Reset Point Base Layer */}
      <div className="absolute inset-0 bg-[#060606] pointer-events-none" />

      {/* Atmospheric Vignette & Film Grain */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(6,6,6,0.7) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.85) 1px, transparent 0)',
          backgroundSize: '4px 4px',
        }}
      />

      {/* Dynamic Studio Lighting Sweep */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.05] mix-blend-screen transition-opacity duration-300"
        style={{
          background: `linear-gradient(115deg, transparent ${Math.max(
            0,
            chapterProgress * 100 - 30
          )}%, rgba(255,255,255,0.4) ${chapterProgress * 100}%, transparent ${Math.min(
            100,
            chapterProgress * 100 + 30
          )}%)`,
        }}
      />

      {/* =================================================================== */}
      {/* FILM HEADER / HUD */}
      {/* =================================================================== */}
      <header className="relative z-30 w-full px-6 sm:px-10 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <span className="font-eyebrow text-foreground tracking-[0.25em] text-[10px] sm:text-xs uppercase">
            THE COLLECTION
          </span>
          <span className="text-[#ede8e0]/20 text-[10px]">•</span>
          <span className="font-eyebrow text-accent tracking-widest text-[9px] sm:text-[10px] uppercase hidden sm:inline">
            12-CHAPTER AUTOMOTIVE FILM
          </span>
        </div>

        {/* Right: Enter Collection Direct Bypass */}
        <button
          onClick={handleExploreCollection}
          className="group flex items-center gap-2 font-eyebrow text-secondary hover:text-accent transition-colors duration-300 text-[10px] sm:text-xs tracking-widest uppercase bg-[#060606]/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5 hover:border-accent/30"
          aria-label="Explore the collection"
        >
          <span>EXPLORE COLLECTION</span>
          <span className="text-accent group-hover:translate-x-0.5 transition-transform duration-300">→</span>
        </button>
      </header>

      {/* =================================================================== */}
      {/* CHAPTER CONTENT & CANVAS */}
      {/* =================================================================== */}
      <main className="relative z-20 w-full h-full flex-1 flex items-center justify-center overflow-hidden">
        {/* Normal 12 Chapters */}
        {!isFinalChapter && currentChapter && carData && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* HTML5 Canvas Frame Sequence Renderer */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500"
              style={{ opacity: stageOpacities.vehicle }}
            >
              <FilmCanvas
                key={currentChapter.slug}
                slug={currentChapter.slug}
                framePath={carData.framePath || `/cars/${currentChapter.slug}/frames`}
                frameCount={carData.frameCount || 240}
                currentFrame={currentScrubbedFrame}
                framing={carData.framing}
                cameraScale={cameraScale}
                opacity={1}
                className="w-full h-full"
              />
            </div>

            {/* Restrained Cinematic Typography & Chapter Narrative */}
            <div className="relative z-30 w-full max-w-6xl mx-auto px-6 sm:px-12 flex flex-col items-center text-center pointer-events-none">
              {/* Category Pill / Chapter Number */}
              <div
                className="mb-2 sm:mb-4 transition-all duration-700 ease-out"
                style={{
                  opacity: stageOpacities.brand,
                  transform: `translateY(${(1 - stageOpacities.brand) * 6}px)`,
                }}
              >
                <div className="flex items-center justify-center gap-2.5">
                  <span className="font-mono text-accent text-[9px] sm:text-[11px] tracking-widest uppercase">
                    CHAPTER {currentChapter.chapterNumber}
                  </span>
                  <span className="text-white/20 text-[9px]">•</span>
                  <span className="font-eyebrow text-[#ede8e0]/60 text-[9px] sm:text-[10px] tracking-widest uppercase">
                    {currentChapter.category}
                  </span>
                </div>
              </div>

              {/* Brand Entrance */}
              <h2
                className="font-eyebrow text-accent tracking-[0.35em] text-xs sm:text-sm md:text-base font-semibold uppercase mb-1 sm:mb-2 transition-all duration-700 ease-out"
                style={{
                  opacity: stageOpacities.brand,
                  transform: `translateY(${(1 - stageOpacities.brand) * 8}px)`,
                }}
              >
                {currentChapter.brand}
              </h2>

              {/* Model Entrance */}
              <h1
                className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground font-light tracking-wide mb-3 sm:mb-5 transition-all duration-700 ease-out"
                style={{
                  opacity: stageOpacities.model,
                  transform: `translateY(${(1 - stageOpacities.model) * 10}px)`,
                }}
              >
                {currentChapter.model}
              </h1>

              {/* Headline Entrance */}
              <p
                className="font-serif italic text-base sm:text-xl md:text-2xl text-[#ede8e0]/85 max-w-2xl mx-auto tracking-wide mb-6 sm:mb-8 text-balance transition-all duration-700 ease-out"
                style={{
                  opacity: stageOpacities.headline,
                  transform: `translateY(${(1 - stageOpacities.headline) * 6}px)`,
                }}
              >
                "{currentChapter.headline}"
              </p>

              {/* Restrained Specs Bar */}
              <div
                className="flex items-center justify-center gap-6 sm:gap-10 pt-4 border-t border-white/10 transition-all duration-700 ease-out"
                style={{
                  opacity: stageOpacities.specs,
                  transform: `translateY(${(1 - stageOpacities.specs) * 6}px)`,
                }}
              >
                <div className="text-center">
                  <span className="block font-mono text-[8px] sm:text-[9px] text-[#ede8e0]/40 tracking-widest uppercase mb-0.5">
                    POWER
                  </span>
                  <span className="font-body text-xs sm:text-sm text-foreground font-light">
                    {currentChapter.specs.power}
                  </span>
                </div>
                <div className="w-[1px] h-4 bg-white/10" />
                <div className="text-center">
                  <span className="block font-mono text-[8px] sm:text-[9px] text-[#ede8e0]/40 tracking-widest uppercase mb-0.5">
                    0-100 KM/H
                  </span>
                  <span className="font-body text-xs sm:text-sm text-foreground font-light">
                    {currentChapter.specs.acceleration}
                  </span>
                </div>
                <div className="w-[1px] h-4 bg-white/10" />
                <div className="text-center">
                  <span className="block font-mono text-[8px] sm:text-[9px] text-[#ede8e0]/40 tracking-widest uppercase mb-0.5">
                    TOP SPEED
                  </span>
                  <span className="font-body text-xs sm:text-sm text-foreground font-light">
                    {currentChapter.specs.topSpeed}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* FINAL CHAPTER TITLE SEQUENCE & MARKETPLACE REVEAL */}
        {/* =================================================================== */}
        {isFinalChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="relative z-30 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center space-y-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.3 }}
              className="font-eyebrow text-accent tracking-[0.3em] text-[10px] sm:text-xs uppercase"
            >
              12 CINEMATIC MACHINES. ONE WORLD.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground font-light tracking-wider uppercase"
            >
              THE COLLECTION
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 1.2 }}
              className="font-serif italic text-secondary text-sm sm:text-lg max-w-xl mx-auto leading-relaxed"
            >
              "The definitive anthology of world-class automotive engineering, preserved in singular motion."
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 1.8 }}
              className="pt-6"
            >
              <button
                onClick={handleExploreCollection}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-accent/90 hover:bg-accent text-[#060606] font-eyebrow text-xs tracking-[0.2em] uppercase font-semibold rounded-sm transition-all duration-500 shadow-2xl hover:shadow-[0_0_30px_rgba(197,168,128,0.35)]"
              >
                <span>EXPLORE THE COLLECTION</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </main>

      {/* =================================================================== */}
      {/* FILM FOOTER & CHAPTER CONTROLLER */}
      {/* =================================================================== */}
      <footer className="relative z-30 w-full px-6 sm:px-10 pb-6 sm:pb-8 flex flex-col gap-3">
        {/* Timeline Bar with 12 Chapter Markers */}
        <div className="w-full flex items-center gap-1 sm:gap-1.5">
          {FILM_CHAPTERS.map((chap, idx) => {
            const isCurrent = idx === currentChapterIdx && !isFinalChapter;
            const isPast = idx < currentChapterIdx || isFinalChapter;

            return (
              <button
                key={chap.slug}
                onClick={() => jumpToChapter(idx)}
                className="group relative flex-1 h-6 flex items-center justify-center cursor-pointer focus:outline-none"
                aria-label={`Jump to Chapter ${chap.chapterNumber}: ${chap.brand} ${chap.model}`}
              >
                {/* Segment Background Line */}
                <div className="w-full h-[2px] bg-white/10 group-hover:bg-white/30 transition-colors rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-75 ease-out rounded-full"
                    style={{
                      width: isPast ? '100%' : isCurrent ? `${Math.round(chapterProgress * 100)}%` : '0%',
                    }}
                  />
                </div>

                {/* Hover Tooltip */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#060606]/90 border border-white/10 px-2 py-1 rounded text-[9px] font-mono tracking-wider whitespace-nowrap text-[#ede8e0] shadow-lg">
                  {chap.chapterNumber} • {chap.brand}
                </div>
              </button>
            );
          })}
        </div>

        {/* HUD Sub-Bar */}
        <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] text-[#ede8e0]/60">
          {/* Chapter Mood & Details */}
          <div className="flex items-center gap-2 font-mono">
            <span className="text-accent font-semibold">
              {isFinalChapter ? 'FINALE' : `CHAPTER ${currentChapter?.chapterNumber} / 12`}
            </span>
            <span className="text-white/20">•</span>
            <span className="font-eyebrow uppercase text-[#ede8e0]/50 tracking-wider hidden sm:inline">
              {isFinalChapter ? 'THE COLLECTION ANTHOLOGY' : currentChapter?.mood}
            </span>
          </div>

          {/* Interactive Controls */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Previous Chapter */}
            <button
              onClick={prevChapter}
              className="hover:text-foreground transition-colors p-1"
              aria-label="Previous Chapter"
            >
              ← PREV
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={togglePlayPause}
              className="hover:text-accent transition-colors font-mono tracking-wider p-1"
              aria-label={isPlaying ? 'Pause Film' : 'Play Film'}
            >
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </button>

            {/* Next Chapter */}
            <button
              onClick={nextChapter}
              className="hover:text-foreground transition-colors p-1"
              aria-label="Next Chapter"
            >
              NEXT →
            </button>

            {/* Audio Ambient Sound Toggle */}
            <button
              onClick={toggleAudio}
              className={`transition-colors p-1 hidden sm:inline ${
                isAudioEnabled ? 'text-accent' : 'text-[#ede8e0]/40 hover:text-[#ede8e0]'
              }`}
              aria-label={isAudioEnabled ? 'Mute Audio' : 'Enable Audio'}
            >
              {isAudioEnabled ? 'AUDIO ON' : 'AUDIO OFF'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
