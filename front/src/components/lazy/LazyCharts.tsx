"use client";

import { lazy, Suspense } from 'react';

// Lazy load dos componentes de gráficos
const PowerRadarChart = lazy(() => import('../charts/PowerRadarChart'));
const AlignmentChart = lazy(() => import('../charts/AlignmentChart'));
const PublisherChart = lazy(() => import('../charts/PublisherChart'));

// Componente de loading
const ChartLoading = () => (
  <div className="chart-loading">
    <div className="loading-spinner"></div>
    <p>Carregando gráfico...</p>
  </div>
);

// Wrapper para PowerRadarChart
export const LazyPowerRadarChart = (props: Record<string, unknown>) => (
  <Suspense fallback={<ChartLoading />}>
    <PowerRadarChart {...(props as unknown as React.ComponentProps<typeof PowerRadarChart>)} />
  </Suspense>
);

// Wrapper para AlignmentChart
export const LazyAlignmentChart = (props: Record<string, unknown>) => (
  <Suspense fallback={<ChartLoading />}>
    <AlignmentChart {...(props as unknown as React.ComponentProps<typeof AlignmentChart>)} />
  </Suspense>
);

// Wrapper para PublisherChart
export const LazyPublisherChart = (props: Record<string, unknown>) => (
  <Suspense fallback={<ChartLoading />}>
    <PublisherChart {...(props as unknown as React.ComponentProps<typeof PublisherChart>)} />
  </Suspense>
);
