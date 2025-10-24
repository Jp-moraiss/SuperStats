"use client";

import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

/**
 * Skeleton para componentes de tabela
 * 
 * @description Componente de loading específico para tabelas,
 * com animação de skeleton que simula o layout da tabela.
 */
export const TableSkeleton = React.memo(() => {
  return (
    <div className="table-skeleton">
      <div className="table-skeleton__header">
        <div className="table-skeleton__title"></div>
        <div className="table-skeleton__actions">
          <div className="table-skeleton__button"></div>
          <div className="table-skeleton__button"></div>
        </div>
      </div>
      
      <div className="table-skeleton__content">
        <div className="table-skeleton__table">
          <div className="table-skeleton__row table-skeleton__row--header">
            <div className="table-skeleton__cell"></div>
            <div className="table-skeleton__cell"></div>
            <div className="table-skeleton__cell"></div>
            <div className="table-skeleton__cell"></div>
          </div>
          
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="table-skeleton__row">
              <div className="table-skeleton__cell"></div>
              <div className="table-skeleton__cell"></div>
              <div className="table-skeleton__cell"></div>
              <div className="table-skeleton__cell"></div>
            </div>
          ))}
        </div>
        
        <div className="table-skeleton__loading">
          <LoadingSpinner size="medium" text="Carregando dados..." />
        </div>
      </div>
    </div>
  );
});

TableSkeleton.displayName = 'TableSkeleton';
