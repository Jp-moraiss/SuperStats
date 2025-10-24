"use client";

import dynamic from 'next/dynamic';
import { TableSkeleton } from '../ui/TableSkeleton';

/**
 * Imports dinâmicos para componentes de tabela
 * 
 * @description Componentes de tabela carregados dinamicamente
 * para melhorar a performance inicial da aplicação.
 */

// CharacterTable com loading customizado
export const DynamicCharacterTable = dynamic(
  () => import('./CharacterTable'),
  {
    loading: () => <TableSkeleton />,
    ssr: false
  }
);

// StatCard com loading customizado
export const DynamicStatCard = dynamic(
  () => import('./StatCard'),
  {
    loading: () => <div className="stat-card-skeleton">Carregando estatística...</div>,
    ssr: false
  }
);

