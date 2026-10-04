'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CinematicFilm } from './CinematicFilm';

interface CinematicIntroProps {
  onComplete?: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const router = useRouter();

  const handleComplete = useCallback(() => {
    if (onComplete) {
      onComplete();
    } else {
      router.push('/cars');
    }
  }, [onComplete, router]);

  return <CinematicFilm onComplete={handleComplete} />;
}
