"use client";

import React, { ReactNode, CSSProperties } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

/**
 * Componente Card genérico reutilizável
 * 
 * @description Card flexível que pode ser usado para diferentes tipos de conteúdo
 * com variantes de estilo e tamanho.
 */
export const Card = React.memo(({
  children,
  variant = 'default',
  size = 'medium',
  className = '',
  style,
  onClick,
  hoverable = false,
  padding = 'medium'
}: CardProps) => {
  const variantClass = styles[`card--${variant}`];
  const sizeClass = styles[`card--${size}`];
  const paddingClass = styles[`card--padding-${padding}`];
  const hoverClass = hoverable ? styles['card--hoverable'] : '';
  const clickableClass = onClick ? styles['card--clickable'] : '';

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`${styles.card} ${variantClass} ${sizeClass} ${paddingClass} ${hoverClass} ${clickableClass} ${className}`}
      style={style}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-testid="card-container"
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
