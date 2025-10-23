"use client";

import React, { useMemo } from 'react';
import { HeroCard } from './HeroCard';
import { Hero } from '../../data/heroes';

interface HeroGridProps {
  heroes: Hero[];
  villains: Hero[];
  onHeroClick: (hero: Hero) => void;
  showVillains: boolean;
}

const HeroGridComponent: React.FC<HeroGridProps> = ({
  heroes,
  villains,
  onHeroClick,
  showVillains
}) => {
  const allCharacters = useMemo(() => {
    const characters = [...heroes];
    if (showVillains) {
      characters.push(...villains);
    }
    return characters;
  }, [heroes, villains, showVillains]);

  const villainIds = useMemo(() => 
    new Set(villains.map(villain => villain.id)), 
    [villains]
  );

  if (allCharacters.length === 0) {
    return (
      <div className="hero-grid-empty">
        <p>Nenhum personagem encontrado.</p>
      </div>
    );
  }

  return (
    <div className="hero-grid">
      {allCharacters.map((character) => {
        const isVillain = villainIds.has(character.id);
        
        return (
          <HeroCard
            key={character.id}
            hero={character}
            onClick={onHeroClick}
            isVillain={isVillain}
          />
        );
      })}
    </div>
  );
};

export const HeroGrid = React.memo(HeroGridComponent);
