"use client";

import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

/**
 * Skeleton para componentes de gráficos
 * 
 * @description Componente de loading específico para gráficos,
 * com animação de skeleton que simula o layout do gráfico.
 */
export const ChartSkeleton = React.memo(() => {
  return (
    <div className="chart-skeleton">
      <div className="chart-skeleton__header">
        <div className="chart-skeleton__title"></div>
        <div className="chart-skeleton__subtitle"></div>
      </div>
      
      <div className="chart-skeleton__content">
        <div className="chart-skeleton__chart">
          <LoadingSpinner size="large" text="Carregando gráfico..." />
        </div>
        
        <div className="chart-skeleton__legend">
          <div className="chart-skeleton__legend-item"></div>
          <div className="chart-skeleton__legend-item"></div>
          <div className="chart-skeleton__legend-item"></div>
        </div>
      </div>
    </div>
  );
});

ChartSkeleton.displayName = 'ChartSkeleton';
