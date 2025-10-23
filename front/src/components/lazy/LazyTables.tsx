"use client";

import { lazy, Suspense } from 'react';

// Lazy load dos componentes de tabela
const CharacterTable = lazy(() => import('../dashboard/CharacterTable'));

// Componente de loading
const TableLoading = () => (
  <div className="table-loading">
    <div className="loading-skeleton">
      <div className="skeleton-row"></div>
      <div className="skeleton-row"></div>
      <div className="skeleton-row"></div>
    </div>
  </div>
);

// Wrapper para CharacterTable
export const LazyCharacterTable = (props: Record<string, unknown>) => (
  <Suspense fallback={<TableLoading />}>
    <CharacterTable {...(props as unknown as React.ComponentProps<typeof CharacterTable>)} />
  </Suspense>
);
