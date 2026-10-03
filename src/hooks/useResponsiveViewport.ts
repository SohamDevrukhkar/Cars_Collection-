'use client';

import { useState, useEffect } from 'react';

export type ViewportCategory = 'mobile' | 'tablet' | 'laptop' | 'desktop';

export interface ViewportInfo {
  category: ViewportCategory;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  dpr: number;
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

const BREAKPOINTS = {
  mobile: { min: 0, max: 767 },
  tablet: { min: 768, max: 1023 },
  laptop: { min: 1024, max: 1439 },
  desktop: { min: 1440, max: Infinity },
};

export function useResponsiveViewport(): ViewportInfo {
  const [viewport, setViewport] = useState<ViewportInfo>({
    category: 'desktop',
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: true,
    dpr: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    safeAreaInsets: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      // Determine viewport category
      let category: ViewportCategory = 'desktop';
      if (width < BREAKPOINTS.tablet.min) {
        category = 'mobile';
      } else if (width < BREAKPOINTS.laptop.min) {
        category = 'tablet';
      } else if (width < BREAKPOINTS.desktop.min) {
        category = 'laptop';
      } else {
        category = 'desktop';
      }

      // Get safe area insets from CSS variables
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const getSafeArea = (varName: string): number => {
        const value = computedStyle.getPropertyValue(`--safe-area-${varName}`);
        return parseInt(value) || 0;
      };

      setViewport({
        category,
        width,
        height,
        isMobile: category === 'mobile',
        isTablet: category === 'tablet',
        isLaptop: category === 'laptop',
        isDesktop: category === 'desktop',
        dpr,
        safeAreaInsets: {
          top: getSafeArea('inset-top'),
          bottom: getSafeArea('inset-bottom'),
          left: getSafeArea('inset-left'),
          right: getSafeArea('inset-right'),
        },
      });
    };

    // Initial update
    updateViewport();

    // Listen for resize events
    window.addEventListener('resize', updateViewport);

    // Listen for orientation change
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  return viewport;
}
