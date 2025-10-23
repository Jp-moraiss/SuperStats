"use client";

import React, { useCallback } from 'react';
import Image from 'next/image';
import { Hero } from '../../data/heroes';

interface HeroCardProps {
  hero: Hero;
  onClick: (hero: Hero) => void;
  isVillain?: boolean;
}

const HeroCardComponent: React.FC<HeroCardProps> = ({ 
  hero, 
  onClick, 
  isVillain = false 
}) => {
  const handleClick = useCallback(() => {
    try {
      onClick(hero);
    } catch (error) {
      console.error('Error handling hero click:', error);
    }
  }, [onClick, hero]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Error loading image for ${hero.nome}:`, e);
  }, [hero.nome]);

  return (
    <div 
      className={`hero-card ${isVillain ? 'villain-card' : ''} ${hero.id}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Clique para interagir com ${hero.nome}`}
    >
      {/* NOVO: Wrapper para padronizar a imagem */}
      <div className="hero-image-wrapper">
        <Image 
          src={hero.imagemSrc} 
          alt={hero.nome} 
          fill
          // ATUALIZADO: 'sizes' ajuda o Next.js a otimizar a imagem
          sizes="(max-width: 600px) 45vw, (max-width: 1024px) 30vw, 220px" 
          loading="lazy"
          onError={handleImageError}
          // As props 'width' e 'height' foram removidas
        />
      </div>
      <span className="hero-label">{hero.nome}</span>
    </div>
  );
};

export const HeroCard = React.memo(HeroCardComponent);