"use client";

import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Componente Button genérico reutilizável
 * 
 * @description Button flexível com diferentes variantes, tamanhos e estados,
 * incluindo suporte a ícones e loading state.
 */
export const Button = React.memo(({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const variantClass = styles[`button--${variant}`];
  const sizeClass = styles[`button--${size}`];
  const fullWidthClass = fullWidth ? styles['button--full-width'] : '';
  const loadingClass = loading ? styles['button--loading'] : '';
  const iconClass = icon ? styles[`button--icon-${iconPosition}`] : '';

  return (
    <button
      className={`${styles.button} ${variantClass} ${sizeClass} ${fullWidthClass} ${loadingClass} ${iconClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className={styles.button__spinner}>
          <div className={styles.spinner}></div>
        </div>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className={styles.button__icon}>{icon}</span>
      )}
      
      <span className={styles.button__content}>{children}</span>
      
      {icon && iconPosition === 'right' && !loading && (
        <span className={styles.button__icon}>{icon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
