"use client";

import { lazy, Suspense } from 'react';

// Lazy load dos modais
const TrailerModal = lazy(() => import('../movies/TrailerModal'));
const HeroVideoOverlay = lazy(() => import('../ui/HeroVideoOverlay'));

// Componente de loading
const ModalLoading = () => (
  <div className="modal-loading">
    <div className="loading-spinner"></div>
  </div>
);

// Wrapper para TrailerModal
export const LazyTrailerModal = (props: Record<string, unknown>) => (
  <Suspense fallback={<ModalLoading />}>
    <TrailerModal {...(props as unknown as React.ComponentProps<typeof TrailerModal>)} />
  </Suspense>
);

// Wrapper para HeroVideoOverlay
export const LazyHeroVideoOverlay = (props: Record<string, unknown>) => (
  <Suspense fallback={<ModalLoading />}>
    <HeroVideoOverlay {...(props as unknown as React.ComponentProps<typeof HeroVideoOverlay>)} />
  </Suspense>
);
