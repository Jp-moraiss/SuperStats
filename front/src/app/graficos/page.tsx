import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy loading do componente de gráficos
const GraficosLazy = dynamic(() => import('../../components/lazy/GraficosLazy'), {
  loading: () => (
    <div className="loading-container">
      <div className="comic-spinner"></div>
      <p>Carregando gráficos...</p>
    </div>
  ),
});

export default function GraficosPage() {
  return (
    <Suspense fallback={
      <div className="loading-container">
        <div className="comic-spinner"></div>
        <p>Carregando gráficos...</p>
      </div>
    }>
      <GraficosLazy />
    </Suspense>
  );
}

