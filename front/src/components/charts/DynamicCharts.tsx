"use client";

import dynamic from 'next/dynamic';
import { ChartSkeleton } from '../ui/ChartSkeleton';

/**
 * Imports dinâmicos para componentes de gráficos
 * 
 * @description Componentes de gráficos carregados dinamicamente
 * para melhorar a performance inicial da aplicação.
 */

// PowerRadarChart com loading customizado
export const DynamicPowerRadarChart = dynamic(
  () => import('./PowerRadarChart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false
  }
);

// AlignmentChart com loading customizado
export const DynamicAlignmentChart = dynamic(
  () => import('./AlignmentChart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false
  }
);

// PublisherChart com loading customizado
export const DynamicPublisherChart = dynamic(
  () => import('./PublisherChart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false
  }
);

// AlterEgoChart com loading customizado
export const DynamicAlterEgoChart = dynamic(
  () => import('./AlterEgoChart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false
  }
);

// PhysicalStatsCharts com loading customizado
export const DynamicPhysicalStatsCharts = dynamic(
  () => import('./PhysicalStatsCharts'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false
  }
);

// PowerDistributionChart com loading customizado
export const DynamicPowerDistributionChart = dynamic(
  () => import('./PowerDistributionChart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false
  }
);

// ComparisonRadarChart com loading customizado
export const DynamicComparisonRadarChart = dynamic(
  () => import('./ComparisonRadarChart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false
  }
);

