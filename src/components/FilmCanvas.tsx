'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { padFrameNumber } from '@/lib/utils';
import type { CarFraming } from '@/types';
import { useResponsiveViewport } from '@/hooks/useResponsiveViewport';

interface FilmCanvasProps {
  slug: string;
  framePath: string;
  frameCount?: number;
  currentFrame: number;
  framing?: CarFraming;
  className?: string;
  cameraScale?: number;
  opacity?: number;
}

export function FilmCanvas({
  slug,
  framePath,
  frameCount = 240,
  currentFrame,
  framing,
  className = '',
  cameraScale = 1.0,
  opacity = 1.0,
}: FilmCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameCache = useRef<Map<number, HTMLImageElement>>(new Map());
  const decodedFramesRef = useRef<Set<number>>(new Set());
  const loadingFramesRef = useRef<Set<number>>(new Set());
  const currentRenderedFrameRef = useRef<number>(-1);
  const targetFrameRef = useRef<number>(currentFrame);
  const isDirtyRef = useRef<boolean>(true);

  const [dpr, setDpr] = useState<number>(1);
  const viewport = useResponsiveViewport();

  targetFrameRef.current = currentFrame;

  // Clear cache on vehicle slug change
  useEffect(() => {
    frameCache.current.clear();
    decodedFramesRef.current.clear();
    loadingFramesRef.current.clear();
    currentRenderedFrameRef.current = -1;
    isDirtyRef.current = true;
  }, [slug]);

  const getFrameUrl = useCallback(
    (frameNum: number): string => {
      const paddedFrame = padFrameNumber(frameNum + 1, 4);
      return `${framePath}/frame-${paddedFrame}.jpg`;
    },
    [framePath]
  );

  const loadFrame = useCallback(
    (frameNum: number): Promise<HTMLImageElement | null> => {
      if (frameNum < 0 || frameNum >= frameCount) return Promise.resolve(null);
      if (frameCache.current.has(frameNum)) return Promise.resolve(frameCache.current.get(frameNum)!);
      if (loadingFramesRef.current.has(frameNum)) return Promise.resolve(null);

      loadingFramesRef.current.add(frameNum);
      const img = new Image();
      img.src = getFrameUrl(frameNum);

      return new Promise((resolve) => {
        const handleDecoded = async () => {
          try {
            if ('decode' in img) await img.decode();
          } catch {}

          frameCache.current.set(frameNum, img);
          decodedFramesRef.current.add(frameNum);
          loadingFramesRef.current.delete(frameNum);
          isDirtyRef.current = true;
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

  // Preload initial frames and key milestones
  useEffect(() => {
    let isCancelled = false;

    // Instant priority: frame 0 and target frame
    loadFrame(0).then(() => {
      if (!isCancelled) isDirtyRef.current = true;
    });
    loadFrame(targetFrameRef.current);

    // Initial burst
    const burstCount = Math.min(24, frameCount);
    for (let i = 1; i < burstCount; i++) {
      loadFrame(i);
    }

    // Milestone frames every 12 frames
    for (let i = 24; i < frameCount; i += 12) {
      loadFrame(i);
    }

    // Idle preloader for remainder
    const idleTimer = setTimeout(async () => {
      for (let i = 0; i < frameCount; i++) {
        if (isCancelled) break;
        if (!frameCache.current.has(i) && !loadingFramesRef.current.has(i)) {
          await loadFrame(i);
          await new Promise((r) => setTimeout(r, 10));
        }
      }
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(idleTimer);
    };
  }, [frameCount, loadFrame, slug]);

  // Priority window around active frame
  useEffect(() => {
    const windowRadius = 8;
    const start = Math.max(0, currentFrame - windowRadius);
    const end = Math.min(frameCount - 1, currentFrame + windowRadius);
    for (let i = start; i <= end; i++) {
      if (!frameCache.current.has(i)) {
        loadFrame(i);
      }
    }
    isDirtyRef.current = true;
  }, [currentFrame, frameCount, loadFrame]);

  // Active framing based on viewport
  const getActiveFraming = useCallback((): CarFraming => {
    const base = framing ?? { scale: 1, offsetX: 0, offsetY: 0, backgroundColor: '#060606', feather: 32 };
    if (!framing?.responsive) return base;
    const catFraming = framing.responsive[viewport.category];
    return catFraming ? { ...base, ...catFraming } : base;
  }, [framing, viewport.category]);

  // Render to canvas
  const renderCanvas = useCallback(
    (frameNum: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
      if (!ctx) return;

      const activeFraming = getActiveFraming();
      const bgHex = activeFraming.backgroundColor || '#060606';

      // Clear with background color
      ctx.fillStyle = bgHex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let targetImg = frameCache.current.get(frameNum);

      // Nearest frame fallback if current frame is loading
      if (!targetImg || targetImg.naturalWidth === 0) {
        let minDistance = Infinity;
        let bestFallback: HTMLImageElement | null = null;
        for (const [idx, img] of frameCache.current.entries()) {
          if (img && img.naturalWidth > 0) {
            const dist = Math.abs(idx - frameNum);
            if (dist < minDistance) {
              minDistance = dist;
              bestFallback = img;
            }
          }
        }
        targetImg = bestFallback || undefined;
      }

      if (!targetImg || targetImg.naturalWidth === 0) {
        return;
      }

      const sourceWidth = targetImg.naturalWidth || 1920;
      const sourceHeight = targetImg.naturalHeight || 1080;
      const currentDpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const finalCustomScale = (activeFraming.scale ?? 1.0) * cameraScale;
      const customOffsetX = (activeFraming.offsetX ?? 0) * currentDpr;
      const customOffsetY = (activeFraming.offsetY ?? 0) * currentDpr;
      const featherPx = (activeFraming.feather ?? 32) * currentDpr;

      let paddingX = 0;
      let paddingY = 0;
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 480) {
          paddingX = 16 * currentDpr;
          paddingY = 24 * currentDpr;
        } else if (window.innerWidth < 768) {
          paddingX = 24 * currentDpr;
          paddingY = 24 * currentDpr;
        }
      }

      const availableWidth = canvas.width - paddingX * 2;
      const availableHeight = canvas.height - paddingY * 2;
      const baseScale = Math.min(availableWidth / sourceWidth, availableHeight / sourceHeight);
      const finalScale = baseScale * finalCustomScale;

      const renderWidth = sourceWidth * finalScale;
      const renderHeight = sourceHeight * finalScale;
      const x = (canvas.width - renderWidth) / 2 + customOffsetX;
      const y = (canvas.height - renderHeight) / 2 + customOffsetY;

      ctx.drawImage(targetImg, x, y, renderWidth, renderHeight);

      // Linear edge feathering to eliminate border cutoffs
      if (featherPx > 0) {
        // Top edge
        const topGrad = ctx.createLinearGradient(0, y, 0, y + featherPx);
        topGrad.addColorStop(0, bgHex);
        topGrad.addColorStop(1, 'rgba(6, 6, 6, 0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(x - 1, y - 1, renderWidth + 2, featherPx + 1);

        // Bottom edge
        const btmGrad = ctx.createLinearGradient(0, y + renderHeight - featherPx, 0, y + renderHeight);
        btmGrad.addColorStop(0, 'rgba(6, 6, 6, 0)');
        btmGrad.addColorStop(1, bgHex);
        ctx.fillStyle = btmGrad;
        ctx.fillRect(x - 1, y + renderHeight - featherPx, renderWidth + 2, featherPx + 1);

        // Left edge
        const leftGrad = ctx.createLinearGradient(x, 0, x + featherPx, 0);
        leftGrad.addColorStop(0, bgHex);
        leftGrad.addColorStop(1, 'rgba(6, 6, 6, 0)');
        ctx.fillStyle = leftGrad;
        ctx.fillRect(x - 1, y - 1, featherPx + 1, renderHeight + 2);

        // Right edge
        const rightGrad = ctx.createLinearGradient(x + renderWidth - featherPx, 0, x + renderWidth, 0);
        rightGrad.addColorStop(0, bgHex);
        rightGrad.addColorStop(1, 'rgba(6, 6, 6, 0)');
        ctx.fillStyle = rightGrad;
        ctx.fillRect(x + renderWidth - featherPx, y - 1, featherPx + 1, renderHeight + 2);
      }

      currentRenderedFrameRef.current = frameNum;
    },
    [cameraScale, getActiveFraming]
  );

  // Render loop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (isDirtyRef.current || currentRenderedFrameRef.current !== targetFrameRef.current) {
        renderCanvas(targetFrameRef.current);
        isDirtyRef.current = false;
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderCanvas]);

  // Resize observer
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;
    const deviceDpr = Math.min(window.devicePixelRatio || 1, 2);
    setDpr(deviceDpr);
    const rect = canvas.getBoundingClientRect();
    const newWidth = Math.round(rect.width * deviceDpr);
    const newHeight = Math.round(rect.height * deviceDpr);

    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;
      isDirtyRef.current = true;
    }
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && canvasRef.current) {
      ro = new ResizeObserver(() => resize());
      ro.observe(canvasRef.current);
    }
    return () => {
      window.removeEventListener('resize', resize);
      ro?.disconnect();
    };
  }, [resize]);

  return (
    <div
      className={`relative w-full h-full bg-[#060606] overflow-hidden ${className}`}
      style={{ opacity, transition: 'opacity 0.6s ease-in-out' }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
