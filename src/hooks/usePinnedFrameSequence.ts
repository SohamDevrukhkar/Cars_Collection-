'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type SequenceState = 'IDLE' | 'ENTERING' | 'PINNED' | 'COMPLETING' | 'RELEASED';

export interface UsePinnedFrameSequenceOptions {
  frameCount: number;
  scrollDistance?: number; // Total delta in px to traverse 0 -> 1 (default 2400)
  holdDurationMs?: number; // Hold duration at boundaries in ms (default 500)
  onProgressChange?: (progress: number, frameIndex: number) => void;
  disabled?: boolean;
}

export interface UsePinnedFrameSequenceReturn {
  currentFrame: number;
  progress: number;
  sequenceState: SequenceState;
  isPinned: boolean;
  isComplete: boolean;
  targetProgress: number;
  heroRef: React.RefObject<HTMLDivElement | null>;
  setProgress: (p: number) => void;
  reducedMotion: boolean;
}

export function usePinnedFrameSequence({
  frameCount,
  scrollDistance = 2400,
  holdDurationMs = 500,
  onProgressChange,
  disabled = false,
}: UsePinnedFrameSequenceOptions): UsePinnedFrameSequenceReturn {
  const [progress, setProgressState] = useState(0);
  const [sequenceState, setSequenceState] = useState<SequenceState>('PINNED');
  const [reducedMotion, setReducedMotion] = useState(false);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const stateRef = useRef<SequenceState>('PINNED');
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTouchYRef = useRef<number | null>(null);
  const isHoldingRef = useRef(false);

  // Sync ref with state
  useEffect(() => {
    stateRef.current = sequenceState;
  }, [sequenceState]);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update target and interpolate progress smoothly with direct delta coupling
  const applyDelta = useCallback(
    (deltaY: number) => {
      if (disabled || reducedMotion) return;

      // When in hold state, absorb delta until hold timer finishes or user reverses
      if (isHoldingRef.current) {
        // Allow user to reverse out of hold immediately
        if (progressRef.current >= 1 && deltaY < -10) {
          if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
          isHoldingRef.current = false;
          setSequenceState('PINNED');
        } else if (progressRef.current <= 0 && deltaY > 10) {
          if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
          isHoldingRef.current = false;
          setSequenceState('PINNED');
        } else {
          return;
        }
      }

      // Calculate incremental progress delta
      const deltaProgress = deltaY / scrollDistance;
      const prevProgress = progressRef.current;
      const nextProgress = Math.max(0, Math.min(1, prevProgress + deltaProgress));

      progressRef.current = nextProgress;
      targetProgressRef.current = nextProgress;
      setProgressState(nextProgress);

      const currentFrameIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.round(nextProgress * (frameCount - 1)))
      );
      onProgressChange?.(nextProgress, currentFrameIndex);

      // Check boundary conditions for hold & release
      if (nextProgress >= 1 && prevProgress < 1) {
        // Reached the final frame
        setSequenceState('COMPLETING');
        isHoldingRef.current = true;

        if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        holdTimerRef.current = setTimeout(() => {
          isHoldingRef.current = false;
          setSequenceState('RELEASED');
        }, holdDurationMs);
      } else if (nextProgress <= 0 && prevProgress > 0) {
        // Reached the first frame
        setSequenceState('COMPLETING');
        isHoldingRef.current = true;

        if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        holdTimerRef.current = setTimeout(() => {
          isHoldingRef.current = false;
          setSequenceState('IDLE');
        }, holdDurationMs);
      } else if (nextProgress > 0 && nextProgress < 1) {
        if (stateRef.current !== 'PINNED') {
          setSequenceState('PINNED');
        }
      }
    },
    [disabled, frameCount, holdDurationMs, onProgressChange, reducedMotion, scrollDistance]
  );

  // Wheel event listener with active prevention only while sequence is active
  useEffect(() => {
    if (typeof window === 'undefined' || disabled || reducedMotion) return;

    const handleWheel = (e: WheelEvent) => {
      const scrollY = window.scrollY;
      const currentProg = progressRef.current;
      const currentState = stateRef.current;

      // Downward scrolling when sequence is active
      if (e.deltaY > 0) {
        if (scrollY <= 5 && (currentProg < 1 || currentState !== 'RELEASED')) {
          e.preventDefault();
          applyDelta(e.deltaY);
        }
      }
      // Upward scrolling when returning to hero
      else if (e.deltaY < 0) {
        if (scrollY <= 5) {
          if (currentProg > 0 || currentState !== 'IDLE') {
            e.preventDefault();
            applyDelta(e.deltaY);
          }
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [applyDelta, disabled, reducedMotion]);

  // Touch event listeners for mobile swipe gestures
  useEffect(() => {
    if (typeof window === 'undefined' || disabled || reducedMotion) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        lastTouchYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || lastTouchYRef.current === null) return;

      const currentY = e.touches[0].clientY;
      const deltaY = (lastTouchYRef.current - currentY) * 1.5; // Touch multiplier for responsiveness
      lastTouchYRef.current = currentY;

      const scrollY = window.scrollY;
      const currentProg = progressRef.current;
      const currentState = stateRef.current;

      if (deltaY > 0 && scrollY <= 5 && (currentProg < 1 || currentState !== 'RELEASED')) {
        if (e.cancelable) e.preventDefault();
        applyDelta(deltaY);
      } else if (deltaY < 0 && scrollY <= 5 && (currentProg > 0 || currentState !== 'IDLE')) {
        if (e.cancelable) e.preventDefault();
        applyDelta(deltaY);
      }
    };

    const handleTouchEnd = () => {
      lastTouchYRef.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [applyDelta, disabled, reducedMotion]);

  // Keyboard navigation support (Arrow keys, Space, PageUp/PageDown)
  useEffect(() => {
    if (typeof window === 'undefined' || disabled || reducedMotion) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollY = window.scrollY;
      const currentProg = progressRef.current;
      const currentState = stateRef.current;

      let keyDelta = 0;
      if (e.key === 'ArrowDown') keyDelta = 80;
      else if (e.key === 'ArrowUp') keyDelta = -80;
      else if (e.key === 'PageDown' || e.key === ' ') keyDelta = 300;
      else if (e.key === 'PageUp') keyDelta = -300;

      if (keyDelta !== 0) {
        if (keyDelta > 0 && scrollY <= 5 && (currentProg < 1 || currentState !== 'RELEASED')) {
          e.preventDefault();
          applyDelta(keyDelta);
        } else if (keyDelta < 0 && scrollY <= 5 && (currentProg > 0 || currentState !== 'IDLE')) {
          e.preventDefault();
          applyDelta(keyDelta);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [applyDelta, disabled, reducedMotion]);

  // Check window scroll position on scroll events to re-lock hero when scrolling back to top
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleWindowScroll = () => {
      if (window.scrollY <= 5 && progressRef.current >= 1 && stateRef.current === 'RELEASED') {
        // User has scrolled back up to the hero
        setSequenceState('COMPLETING');
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  // Programmatic progress setter
  const setProgress = useCallback(
    (p: number) => {
      const clamped = Math.max(0, Math.min(1, p));
      progressRef.current = clamped;
      targetProgressRef.current = clamped;
      setProgressState(clamped);
      const currentFrameIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.round(clamped * (frameCount - 1)))
      );
      onProgressChange?.(clamped, currentFrameIndex);
    },
    [frameCount, onProgressChange]
  );

  const currentFrame = Math.min(
    frameCount - 1,
    Math.max(0, Math.round(progress * (frameCount - 1)))
  );

  const isPinned = sequenceState === 'PINNED' || sequenceState === 'ENTERING' || sequenceState === 'COMPLETING';
  const isComplete = progress >= 1 && sequenceState === 'RELEASED';

  return {
    currentFrame,
    progress,
    sequenceState,
    isPinned,
    isComplete,
    targetProgress: targetProgressRef.current,
    heroRef,
    setProgress,
    reducedMotion,
  };
}
