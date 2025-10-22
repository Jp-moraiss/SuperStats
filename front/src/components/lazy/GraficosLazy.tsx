"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy loading do componente de gráficos
const GraficosContent = dynamic(() => import('./GraficosContent'), {
  loading: () => (
    <div className="loading-container">
      <div className="comic-spinner">📊</div>
      <p>Carregando gráficos...</p>
    </div>
  ),
  ssr: false, // Desabilita SSR para este componente pesado
});

export default function GraficosLazy() {
  return (
    <Suspense fallback={
      <div className="loading-container">
        <div className="comic-spinner">📊</div>
        <p>Carregando gráficos...</p>
      </div>
    }>
      <GraficosContent />
    </Suspense>
  );
}
