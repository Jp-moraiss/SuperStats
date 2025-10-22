// src/components/ui/ComicButton.tsx
"use client";

import React from 'react';
import './ComicButton.module.css';

interface ComicButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  effect?: 'explosion' | 'pow' | 'bam' | 'none';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  href?: string;
  target?: string;
}

const ComicButton: React.FC<ComicButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  effect = 'none',
  disabled = false,
  loading = false,
  icon,
  onClick,
  type = 'button',
  className = '',
  href,
  target
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'comic-btn--primary';
      case 'secondary': return 'comic-btn--secondary';
      case 'accent': return 'comic-btn--accent';
      case 'success': return 'comic-btn--success';
      case 'warning': return 'comic-btn--warning';
      case 'danger': return 'comic-btn--danger';
      case 'outline': return 'comic-btn--outline';
      case 'ghost': return 'comic-btn--ghost';
      default: return 'comic-btn--primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'comic-btn--small';
      case 'medium': return '';
      case 'large': return 'comic-btn--large';
      case 'xlarge': return 'comic-btn--xlarge';
      default: return '';
    }
  };

  const getEffectClass = () => {
    switch (effect) {
      case 'explosion': return 'comic-btn--explosion';
      case 'pow': return 'comic-btn--pow';
      case 'bam': return 'comic-btn--bam';
      default: return '';
    }
  };

  const getLoadingClass = () => {
    return loading ? 'comic-btn--loading' : '';
  };

  const getDisabledClass = () => {
    return disabled ? 'comic-btn:disabled' : '';
  };

  const buttonClasses = [
    'comic-btn',
    getVariantClass(),
    getSizeClass(),
    getEffectClass(),
    getLoadingClass(),
    getDisabledClass(),
    className
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={buttonClasses}
        onClick={handleClick}
      >
        {icon && <span className="comic-btn-icon">{icon}</span>}
        {!loading && children}
        {loading && <span className="comic-btn-loading-text">Carregando...</span>}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {icon && <span className="comic-btn-icon">{icon}</span>}
      {!loading && children}
      {loading && <span className="comic-btn-loading-text">Carregando...</span>}
    </button>
  );
};

export default ComicButton;
