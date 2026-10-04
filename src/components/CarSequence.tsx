'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { padFrameNumber } from '@/lib/utils';
import { usePinnedFrameSequence, SequenceState } from '@/hooks/usePinnedFrameSequence';
import { useResponsiveViewport, type ViewportCategory } from '@/hooks/useResponsiveViewport';
import type { CarFraming, NarrativeOverlay } from '@/types';

export interface CarSequenceProps {
  slug: string;
  frameCount: number;
  framePath: string;
  frames?: string[];
  framing?: CarFraming;
  responsiveFraming?: CarFraming['responsive'];
  narratives?: NarrativeOverlay[];
  onScrollProgress?: (progress: number) => void;
  onStateChange?: (state: SequenceState) => void;
  className?: string;
  debug?: boolean;
  scrollDistance?: number;
  holdDurationMs?: number;
}

export function CarSequence({
  slug,
  frameCount,
  framePath,
  frames,
  framing,
  responsiveFraming,
  narratives,
  onScrollProgress,
  onStateChange,
  className = '',
  debug = false,
  scrollDistance = 2400,
  holdDurationMs = 500,
}: CarSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameCache = useRef<Map<number, HTMLImageElement>>(new Map());
  const decodedFramesRef = useRef<Set<number>>(new Set());
  const loadingFramesRef = useRef<Set<number>>(new Set());
  const currentRenderedFrameRef = useRef<number>(-1);
  const targetFrameRef = useRef<number>(0);
  const targetProgressRef = useRef<number>(0);
  const isDirtyRef = useRef<boolean>(true);

  const [decodedCount, setDecodedCount] = useState<number>(0);
  const [sourceDimensions, setSourceDimensions] = useState<{ width: number; height: number }>({
    width: 1920,
    height: 1080,
  });
  const [viewportDimensions, setViewportDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [dpr, setDpr] = useState<number>(1);
  const [showDebug, setShowDebug] = useState<boolean>(debug);

  // Helper to resolve verified frame URL by zero-based index
  const getFrameUrl = useCallback(
    (frameNum: number): string => {
      if (frames && frames[frameNum]) {
        return frames[frameNum];
      }
      const paddedFrame = padFrameNumber(frameNum + 1, 4);
      return `${framePath}/frame-${paddedFrame}.jpg`;
    },
    [frames, framePath]
  );

  // Get responsive viewport info
  const viewport = useResponsiveViewport();

  // Determine active framing based on viewport category
  const getActiveFraming = useCallback((): CarFraming => {
    const baseFraming = framing ?? { scale: 1, offsetX: 0, offsetY: 0, backgroundColor: '#060606', feather: 32 };

    if (!responsiveFraming) {
      return baseFraming;
    }

    const categoryFraming = responsiveFraming[viewport.category];
    if (categoryFraming) {
      return {
        ...baseFraming,
        ...categoryFraming,
      };
    }

    return baseFraming;
  }, [framing, responsiveFraming, viewport.category]);

  // Hook for pinned frame sequence controller
  const { currentFrame, progress, sequenceState, isPinned, reducedMotion } = usePinnedFrameSequence({
    frameCount,
    scrollDistance,
    holdDurationMs,
    onProgressChange: (prog, frameIdx) => {
      targetProgressRef.current = prog;
      targetFrameRef.current = frameIdx;
      isDirtyRef.current = true;
      onScrollProgress?.(prog);
    },
  });

  // Sync refs when currentFrame or progress updates
  useEffect(() => {
    targetFrameRef.current = currentFrame;
    targetProgressRef.current = progress;
    isDirtyRef.current = true;
  }, [currentFrame, progress]);

  // Notify parent of state changes
  useEffect(() => {
    onStateChange?.(sequenceState);
  }, [sequenceState, onStateChange]);

  // Check for debug query param in development
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('debug') === 'true' || urlParams.get('debug') === '1' || debug) {
        setShowDebug(true);
      }
    }
  }, [debug]);

  // Reset cache on slug change or unmount
  useEffect(() => {
    frameCache.current.clear();
    decodedFramesRef.current.clear();
    loadingFramesRef.current.clear();
    currentRenderedFrameRef.current = -1;
    setDecodedCount(0);
    isDirtyRef.current = true;
  }, [slug]);

  // Asynchronous Image Loading & Decoding Pipeline
  const loadFrame = useCallback(
    (frameNum: number): Promise<HTMLImageElement | null> => {
      if (frameNum < 0 || frameNum >= frameCount) {
        return Promise.resolve(null);
      }
      if (frameCache.current.has(frameNum)) {
        return Promise.resolve(frameCache.current.get(frameNum)!);
      }
      if (loadingFramesRef.current.has(frameNum)) {
        return Promise.resolve(null);
      }

      loadingFramesRef.current.add(frameNum);
      const img = new Image();
      const frameUrl = getFrameUrl(frameNum);
      img.src = frameUrl;

      return new Promise((resolve) => {
        const handleDecoded = async () => {
          try {
            if ('decode' in img) {
              await img.decode();
            }
          } catch {
            // Ignore decode error (image is still drawable)
          }

          frameCache.current.set(frameNum, img);
          decodedFramesRef.current.add(frameNum);
          loadingFramesRef.current.delete(frameNum);

          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            setSourceDimensions((prev) => {
              if (prev.width === img.naturalWidth && prev.height === img.naturalHeight) return prev;
              return { width: img.naturalWidth, height: img.naturalHeight };
            });
          }

          isDirtyRef.current = true;
          setDecodedCount(decodedFramesRef.current.size);
          resolve(img);
        };

        if (img.complete && img.naturalWidth > 0) {
          handleDecoded();
        } else {
          img.onload = handleDecoded;
          img.onerror = () => {
            loadingFramesRef.current.delete(frameNum);
            resolve(null);
          };
        }
      });
    },
    [frameCount, getFrameUrl]
  );

  // Development-only asset validation for milestone frames
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const probeIndices = [0, Math.floor(frameCount / 2), frameCount - 1];
      probeIndices.forEach((idx) => {
        const testImg = new Image();
        const url = getFrameUrl(idx);
        testImg.onerror = () => {
          console.error(
            `[CarSequence Asset Validation Error] Car "${slug}" failed to load milestone frame ${idx} at: ${url}`
          );
        };
        testImg.src = url;
      });
    }
  }, [slug, frameCount, getFrameUrl]);

  // Multi-Tier Preloader Lifecycle:
  // Tier 1: Frame 0 and Last Frame
  // Tier 2: Initial Burst (frames 1..16)
  // Tier 3: Milestone frames (every 12 frames)
  // Tier 4: Staggered background idle loader for all remaining frames
  useEffect(() => {
    let isCancelled = false;

    // 1. Immediately load Frame 0 and Last Frame
    loadFrame(0).then((img) => {
      if (!isCancelled && img) {
        isDirtyRef.current = true;
      }
    });
    loadFrame(frameCount - 1);

    // 2. Load immediate initial burst [1..16]
    const initialBurstLimit = Math.min(16, frameCount);
    for (let i = 1; i < initialBurstLimit; i++) {
      loadFrame(i);
    }

    // 3. Load milestone frames across sequence
    for (let i = 0; i < frameCount; i += 12) {
      loadFrame(i);
    }

    // 4. Staggered background idle preloader for remaining frames
    const idlePreloadRemaining = async () => {
      for (let i = 0; i < frameCount; i++) {
        if (isCancelled) break;
        if (!frameCache.current.has(i) && !loadingFramesRef.current.has(i)) {
          await loadFrame(i);
          await new Promise((r) => setTimeout(r, 8));
        }
      }
    };

    const timerId = setTimeout(idlePreloadRemaining, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timerId);
    };
  }, [frameCount, loadFrame, slug]);

  // Dynamic Interactive Priority Window around currentFrame
  useEffect(() => {
    // Near immediate window
    const nearWindow = 4;
    const startNear = Math.max(0, currentFrame - nearWindow);
    const endNear = Math.min(frameCount - 1, currentFrame + nearWindow);
    for (let i = startNear; i <= endNear; i++) {
      if (!frameCache.current.has(i)) {
        loadFrame(i);
      }
    }

    // Extended directional window
    const extendedWindow = 20;
    const startExt = Math.max(0, currentFrame - extendedWindow);
    const endExt = Math.min(frameCount - 1, currentFrame + extendedWindow);
    for (let i = startExt; i <= endExt; i++) {
      if (!frameCache.current.has(i)) {
        loadFrame(i);
      }
    }
  }, [currentFrame, frameCount, loadFrame]);

  // Helper to render image with contain fit, DPR, custom framing offsets, and gradient edge feathering
  const renderImageToCanvas = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      img: HTMLImageElement,
      activeFraming: CarFraming,
      currentProgress: number
    ) => {
      const sourceWidth = img.naturalWidth || 1920;
      const sourceHeight = img.naturalHeight || 1080;
      const currentDpr = window.devicePixelRatio || 1;

      // Enable highest quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Cinematic subtle camera scale dynamics (1.000 -> 1.018 across scrub)
      const cameraScale = 1.0 + currentProgress * 0.018;

      // Per-car framing metadata adjustments
      const customScale = (activeFraming.scale ?? 1.0) * cameraScale;
      const customOffsetX = (activeFraming.offsetX ?? 0) * currentDpr;
      const customOffsetY = (activeFraming.offsetY ?? 0) * currentDpr;
      const featherPx = (activeFraming.feather ?? 32) * currentDpr;

      // Responsive safe margins
      let paddingX = 0;
      let paddingY = 0;
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 480) {
          paddingX = 12 * currentDpr;
          paddingY = 24 * currentDpr;
        } else if (window.innerWidth < 768) {
          paddingX = 24 * currentDpr;
          paddingY = 24 * currentDpr;
        }
      }

      const availableWidth = canvas.width - paddingX * 2;
      const availableHeight = canvas.height - paddingY * 2;

      // STRICT CONTAIN FIT: Math.min guarantees entire image is visible without distortion or cropping
      const baseScale = Math.min(availableWidth / sourceWidth, availableHeight / sourceHeight);
      const finalScale = baseScale * customScale;

      const renderWidth = sourceWidth * finalScale;
      const renderHeight = sourceHeight * finalScale;

      // Center in canvas viewport with framing offsets
      const x = (canvas.width - renderWidth) / 2 + customOffsetX;
      const y = (canvas.height - renderHeight) / 2 + customOffsetY;

      // 1. Draw the clean source frame
      ctx.drawImage(img, x, y, renderWidth, renderHeight);

      // 2. Safe Background Edge Normalization (Linear Gradient Feathering)
      if (featherPx > 0) {
        const bgHex = activeFraming.backgroundColor || '#060606';

        // Top Edge Feather Strip
        const topGrad = ctx.createLinearGradient(0, y, 0, y + featherPx);
        topGrad.addColorStop(0, bgHex);
        topGrad.addColorStop(1, 'rgba(6, 6, 6, 0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(x - 1, y - 1, renderWidth + 2, featherPx + 1);

        // Bottom Edge Feather Strip
        const btmGrad = ctx.createLinearGradient(0, y + renderHeight - featherPx, 0, y + renderHeight);
        btmGrad.addColorStop(0, 'rgba(6, 6, 6, 0)');
        btmGrad.addColorStop(1, bgHex);
        ctx.fillStyle = btmGrad;
        ctx.fillRect(x - 1, y + renderHeight - featherPx, renderWidth + 2, featherPx + 1);

        // Left Edge Feather Strip
        const leftGrad = ctx.createLinearGradient(x, 0, x + featherPx, 0);
        leftGrad.addColorStop(0, bgHex);
        leftGrad.addColorStop(1, 'rgba(6, 6, 6, 0)');
        ctx.fillStyle = leftGrad;
        ctx.fillRect(x - 1, y - 1, featherPx + 1, renderHeight + 2);

        // Right Edge Feather Strip
        const rightGrad = ctx.createLinearGradient(x + renderWidth - featherPx, 0, x + renderWidth, 0);
        rightGrad.addColorStop(0, 'rgba(6, 6, 6, 0)');
        rightGrad.addColorStop(1, bgHex);
        ctx.fillStyle = rightGrad;
        ctx.fillRect(x + renderWidth - featherPx, y - 1, featherPx + 1, renderHeight + 2);
      }
    },
    []
  );

  // Core Canvas Drawing Routine with High-DPI and Nearest Decoded Frame Fallback
  const drawCanvas = useCallback(
    (frameNum: number, currentProgress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
      if (!ctx) return;

      const activeFraming = getActiveFraming();
      const cachedFrame = frameCache.current.get(frameNum);
      const bgHex = activeFraming.backgroundColor || '#060606';

      // 1. Clear full canvas with designated background color
      ctx.fillStyle = bgHex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!cachedFrame || cachedFrame.naturalWidth === 0 || cachedFrame.naturalHeight === 0) {
        // Fallback to nearest loaded frame if current frame is loading
        let fallbackFrame: HTMLImageElement | null = null;
        let minDistance = Infinity;

        for (const [loadedIdx, loadedImg] of frameCache.current.entries()) {
          if (loadedImg && loadedImg.naturalWidth > 0 && loadedImg.naturalHeight > 0) {
            const distance = Math.abs(loadedIdx - frameNum);
            if (distance < minDistance) {
              minDistance = distance;
              fallbackFrame = loadedImg;
            }
          }
        }

        if (!fallbackFrame) return;
        renderImageToCanvas(ctx, canvas, fallbackFrame, activeFraming, currentProgress);
        return;
      }

      renderImageToCanvas(ctx, canvas, cachedFrame, activeFraming, currentProgress);
      currentRenderedFrameRef.current = frameNum;
    },
    [getActiveFraming, renderImageToCanvas]
  );

  // Single Decoupled RAF Render Scheduler
  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      if (
        isDirtyRef.current ||
        currentRenderedFrameRef.current !== targetFrameRef.current
      ) {
        drawCanvas(targetFrameRef.current, targetProgressRef.current);
        isDirtyRef.current = false;
      }
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [drawCanvas]);

  // Resize handling with High-DPI support (capped to DPR 2 max for mobile GPU performance)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;

    const deviceDpr = Math.min(window.devicePixelRatio || 1, 2);
    setDpr(deviceDpr);

    const rect = canvas.getBoundingClientRect();
    const newWidth = Math.round(rect.width * deviceDpr);
    const newHeight = Math.round(rect.height * deviceDpr);

    setViewportDimensions({
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    });

    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;
      isDirtyRef.current = true;
    }
  }, []);

  // Set up resize observer and window resize listener
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && canvasRef.current) {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });
      resizeObserver.observe(canvasRef.current);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      resizeObserver?.disconnect();
    };
  }, [resizeCanvas]);

  // Trigger redraw on framing or viewport category changes
  useEffect(() => {
    isDirtyRef.current = true;
  }, [viewport.category, framing, responsiveFraming]);

  // Active narrative lookup based on progress
  const activeNarrative = useMemo(() => {
    if (!narratives || narratives.length === 0) return null;
    return narratives.find(
      (n) => progress >= n.range[0] && progress <= n.range[1]
    );
  }, [narratives, progress]);

  return (
    <div className={`relative w-full h-full bg-[#060606] select-none overflow-hidden ${className}`}>
      {/* HTML5 Direct Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          backgroundColor: framing?.backgroundColor || '#060606',
          imageRendering: 'auto',
        }}
      />

      {/* Atmospheric Layer 1: Studio Lighting Sweep */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-screen transition-opacity duration-300"
        style={{
          background: `linear-gradient(110deg, transparent ${Math.max(
            0,
            progress * 100 - 35
          )}%, rgba(255,255,255,0.45) ${progress * 100}%, transparent ${Math.min(
            100,
            progress * 100 + 35
          )}%)`,
        }}
      />

      {/* Atmospheric Layer 2: Studio Radial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(6,6,6,0.65) 100%)',
        }}
      />

      {/* Atmospheric Layer 3: Static Film Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 0)',
          backgroundSize: '4px 4px',
        }}
      />

      {/* Synchronized Luxury Narrative Overlay */}
      <AnimatePresence mode="wait">
        {activeNarrative && (
          <motion.div
            key={`${activeNarrative.headline}-${activeNarrative.eyebrow}`}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={`absolute z-20 pointer-events-none px-4 sm:px-8 md:px-12 max-w-sm sm:max-w-md md:max-w-lg ${
              activeNarrative.position === 'right'
                ? 'right-4 sm:right-10 md:right-16 top-1/4 sm:top-1/3 text-right'
                : activeNarrative.position === 'center'
                ? 'inset-x-0 mx-auto top-1/4 text-center'
                : 'left-4 sm:left-10 md:left-16 top-1/4 sm:top-1/3 text-left'
            }`}
          >
            <div className="bg-[#060606]/60 backdrop-blur-md p-4 sm:p-6 rounded-lg border border-[#ede8e0]/10 shadow-2xl">
              {activeNarrative.eyebrow && (
                <p className="font-eyebrow text-accent text-[9px] sm:text-xs tracking-widest uppercase mb-1.5 font-semibold">
                  {activeNarrative.eyebrow}
                </p>
              )}
              <h3 className="font-serif text-lg sm:text-2xl md:text-3xl text-foreground font-light mb-2 tracking-wide leading-tight text-balance">
                {activeNarrative.headline}
              </h3>
              <p className="font-body text-secondary text-xs sm:text-sm leading-relaxed text-balance">
                {activeNarrative.statement}
              </p>
              {activeNarrative.subtext && (
                <p className="font-eyebrow text-tertiary text-[9px] sm:text-xs mt-2 italic">
                  {activeNarrative.subtext}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Production Subtle Frame / Progress Tracker */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 z-20 pointer-events-none flex items-center gap-2.5 font-mono text-[10px] sm:text-[11px] text-[#ede8e0]/60 tracking-wider select-none bg-[#060606]/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5">
        <span>FRAME {padFrameNumber(currentFrame + 1, 3)} / {frameCount}</span>
        <span className="text-[#ede8e0]/25">•</span>
        <span>{Math.round(progress * 100)}%</span>
        <div className="w-12 sm:w-20 h-[2px] bg-white/10 rounded-full overflow-hidden ml-1">
          <div
            className="h-full bg-accent/80 transition-all duration-75 ease-out rounded-full"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>

      {/* DEVELOPMENT ONLY DIAGNOSTIC DEBUG OVERLAY */}
      {showDebug && process.env.NODE_ENV !== 'production' && (
        <div className="absolute top-4 right-4 z-50 bg-[#060606]/90 border border-[#ede8e0]/20 backdrop-blur-md px-4 py-3 rounded text-[11px] font-mono text-[#ede8e0] shadow-2xl pointer-events-none space-y-1 max-w-sm">
          <div className="flex justify-between gap-4">
            <span className="text-secondary uppercase">SRC:</span>
            <span className="font-semibold text-accent truncate max-w-[190px]" title={getFrameUrl(currentFrame)}>
              {getFrameUrl(currentFrame)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-secondary uppercase">Frame:</span>
            <span className="font-semibold text-accent">
              {padFrameNumber(currentFrame + 1, 3)} / {frameCount}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-secondary uppercase">Decoded:</span>
            <span className="font-semibold text-emerald-400">
              {decodedCount} / {frameCount} ({Math.round((decodedCount / frameCount) * 100)}%)
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-secondary uppercase">Progress:</span>
            <span className="font-semibold text-accent">{(progress * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-secondary uppercase">Pinned:</span>
            <span className={`font-semibold ${isPinned ? 'text-emerald-400' : 'text-zinc-500'}`}>
              {isPinned ? 'YES' : 'NO'}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-secondary uppercase">State:</span>
            <span className="font-semibold text-foreground">{sequenceState}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-secondary uppercase">Background:</span>
            <span className="font-semibold text-secondary">{framing?.backgroundColor || '#060606'}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-secondary uppercase">Image:</span>
            <span className="font-semibold text-secondary">
              {sourceDimensions.width} × {sourceDimensions.height}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-secondary uppercase">Viewport:</span>
            <span className="font-semibold text-secondary">
              {viewportDimensions.width} × {viewportDimensions.height} ({viewport.category})
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-secondary uppercase">DPR:</span>
            <span className="font-semibold text-secondary">{dpr}</span>
          </div>
        </div>
      )}
    </div>
  );
}
