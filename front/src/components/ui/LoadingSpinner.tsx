"use client";

import React, { CSSProperties } from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
  style?: CSSProperties;
  text?: string;
}

/**
 * Componente de loading spinner reutilizável
 * 
 * @description Spinner genérico que pode ser usado em qualquer lugar da aplicação
 * com diferentes tamanhos e cores.
 */
export const LoadingSpinner = React.memo(({ 
  size = 'medium', 
  color = 'var(--color-primary)', 
  className = '',
  style,
  text
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'loading-spinner--small',
    medium: 'loading-spinner--medium',
    large: 'loading-spinner--large'
  };

  return (
    <div 
      data-testid="loading-spinner"
      className={`loading-spinner ${sizeClasses[size]} ${className}`}
      style={{ 
        '--spinner-color': color,
        ...style 
      } as CSSProperties}
    >
      <div className="spinner-ring"></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';
