'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { padFrameNumber } from '@/lib/utils';
import { usePinnedFrameSequence, SequenceState } from '@/hooks/usePinnedFrameSequence';
import { useResponsiveViewport, type ViewportCategory } from '@/hooks/useResponsiveViewport';
import type { CarFraming } from '@/types';

export interface CarSequenceProps {
  slug: string;
  frameCount: number;
  framePath: string;
  framing?: CarFraming;
  responsiveFraming?: CarFraming['responsive'];
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
  framing,
  responsiveFraming,
  onScrollProgress,
  onStateChange,
  className = '',
  debug = false,
  scrollDistance = 2400,
  holdDurationMs = 500,
}: CarSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameCache = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingFramesRef = useRef<Set<number>>(new Set());
  const currentRenderedFrameRef = useRef<number>(-1);
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

  // Get responsive viewport info
  const viewport = useResponsiveViewport();

  // Determine active framing based on viewport category
  const getActiveFraming = useCallback((): CarFraming => {
    const baseFraming = framing ?? { scale: 1, offsetX: 0, offsetY: 0, backgroundColor: '#060606', feather: 32 };

    // No responsive overrides, return base
    if (!responsiveFraming) {
      return baseFraming;
    }

    // Select framing for current viewport category
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
      onScrollProgress?.(prog);
    },
  });

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

  // Preload a single frame
  const loadFrame = useCallback(
    (frameNum: number): Promise<HTMLImageElement | null> => {
      if (frameCache.current.has(frameNum)) {
        return Promise.resolve(frameCache.current.get(frameNum)!);
      }
      if (loadingFramesRef.current.has(frameNum)) {
        return Promise.resolve(null);
      }

      loadingFramesRef.current.add(frameNum);
      const img = new Image();
      const paddedFrame = padFrameNumber(frameNum + 1, 4);
      img.src = `${framePath}/frame-${paddedFrame}.jpg`;

      return new Promise((resolve) => {
        img.onload = () => {
          frameCache.current.set(frameNum, img);
          loadingFramesRef.current.delete(frameNum);
          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            setSourceDimensions({
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          }
          resolve(img);
        };
        img.onerror = () => {
          loadingFramesRef.current.delete(frameNum);
          resolve(null);
        };
      });
    },
    [framePath]
  );

  // Initial milestone preloading + first frame priority
  useEffect(() => {
    // 1. Immediately load frame 0 and last frame
    loadFrame(0).then(() => {
      drawCanvas(0);
    });
    loadFrame(frameCount - 1);

    // 2. Load milestone frames (every 12th frame)
    const milestones: number[] = [];
    for (let i = 0; i < frameCount; i += 12) {
      milestones.push(i);
    }
    milestones.forEach((idx) => loadFrame(idx));

    // 3. Incrementally preload all remaining frames in idle time
    let cancelPreload = false;
    const preloadAll = async () => {
      for (let i = 0; i < frameCount; i++) {
        if (cancelPreload) break;
        if (!frameCache.current.has(i)) {
          await loadFrame(i);
        }
      }
    };

    const idleCallback =
      typeof window !== 'undefined' && 'requestIdleCallback' in window
        ? (window as any).requestIdleCallback(preloadAll)
        : setTimeout(preloadAll, 300);

    return () => {
      cancelPreload = true;
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(idleCallback);
      } else {
        clearTimeout(idleCallback);
      }
    };
  }, [frameCount, loadFrame]);

  // Preload sliding window around current frame
  useEffect(() => {
    const windowSize = 16;
    const start = Math.max(0, currentFrame - windowSize);
    const end = Math.min(frameCount - 1, currentFrame + windowSize);

    for (let i = start; i <= end; i++) {
      if (!frameCache.current.has(i)) {
        loadFrame(i);
      }
    }
  }, [currentFrame, frameCount, loadFrame]);

  // Core Canvas Drawing Routine with High-DPI, Contain Fit, and Seamless Edge Feathering
  const drawCanvas = useCallback(
    (frameNum: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
      if (!ctx) return;

      const activeFraming = getActiveFraming();
      const cachedFrame = frameCache.current.get(frameNum);
      const bgHex = activeFraming.backgroundColor || '#060606';

      // 1. Clear full canvas with the designated background color
      ctx.fillStyle = bgHex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!cachedFrame || cachedFrame.naturalWidth === 0 || cachedFrame.naturalHeight === 0) {
        // Fallback to nearest loaded frame if current frame is loading
        let fallbackFrame: HTMLImageElement | null = null;
        for (let offset = 1; offset < 20; offset++) {
          if (frameCache.current.has(frameNum - offset)) {
            fallbackFrame = frameCache.current.get(frameNum - offset)!;
            break;
          }
          if (frameCache.current.has(frameNum + offset)) {
            fallbackFrame = frameCache.current.get(frameNum + offset)!;
            break;
          }
        }
        if (!fallbackFrame) return;
        renderImageToCanvas(ctx, canvas, fallbackFrame, activeFraming);
        return;
      }

      renderImageToCanvas(ctx, canvas, cachedFrame, activeFraming);
      currentRenderedFrameRef.current = frameNum;
    },
    [getActiveFraming]
  );

  // Helper to render image with contain fit, DPR, custom framing offsets, and gradient edge feathering
  const renderImageToCanvas = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    activeFraming: CarFraming
  ) => {
    const sourceWidth = img.naturalWidth || 1920;
    const sourceHeight = img.naturalHeight || 1080;
    const currentDpr = window.devicePixelRatio || 1;

    // Enable high quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Per-car framing metadata adjustments
    const customScale = activeFraming.scale ?? 1.0;
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

    // 2. SAFE BACKGROUND EDGE NORMALIZATION (Linear Gradient Feathering)
    // Seamlessly fades the outer border of the drawn frame into #060606
    // This dissolves any residual corner/edge lighting without touching the vehicle itself
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
  };

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
    }

    drawCanvas(currentFrame);
  }, [currentFrame, drawCanvas]);

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

  // Redraw when currentFrame updates or viewport changes
  useEffect(() => {
    drawCanvas(currentFrame);
  }, [currentFrame, drawCanvas, viewport.category]);

  return (
    <div className={`relative w-full h-full bg-[#060606] select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          backgroundColor: framing?.backgroundColor || '#060606',
          imageRendering: 'auto',
        }}
      />

      {/* DEVELOPMENT ONLY DEBUG OVERLAY */}
      {showDebug && process.env.NODE_ENV !== 'production' && (
        <div className="absolute top-6 right-6 z-50 bg-[#060606]/85 border border-[#ede8e0]/20 backdrop-blur-md px-4 py-3 rounded text-[11px] font-mono text-[#ede8e0] shadow-2xl pointer-events-none space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-secondary uppercase">Frame:</span>
            <span className="font-semibold text-accent">
              {padFrameNumber(currentFrame + 1, 3)} / {frameCount}
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
              {viewportDimensions.width} × {viewportDimensions.height}
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
