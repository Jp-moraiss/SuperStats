"use client";

import React from "react";
import SpeechBubble from "../ui/SpeechBubble";
import { HeroGrid } from "./HeroGrid";
import { AudioElements } from "./AudioElements";
import { VillainInvasionOverlay } from "./VillainInvasionOverlay";
import { Hero } from "../../data/heroes";

interface UserGalleryProps {
  isLoggedIn: boolean;
  filteredHeroes: Hero[];
  filteredVillains: Hero[];
  showVillains: boolean;
  speechBubbleText: string;
  audioRefs: Record<string, React.RefObject<HTMLAudioElement | null>>;
  onHeroClick: (hero: Hero) => void;
  villainInvasion: boolean;
}

/**
 * Galeria de heróis para usuários logados
 * 
 * @description Componente que gerencia a exibição da galeria de heróis,
 * incluindo filtros, áudio e overlays especiais.
 */
export const UserGallery = React.memo(({
  isLoggedIn,
  filteredHeroes,
  filteredVillains,
  showVillains,
  speechBubbleText,
  audioRefs,
  onHeroClick,
  villainInvasion
}: UserGalleryProps) => {
  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <VillainInvasionOverlay isActive={villainInvasion} />
      
      <SpeechBubble type="speech">
        {speechBubbleText}
      </SpeechBubble>

      <div className="hero-gallery">
        <HeroGrid
          heroes={filteredHeroes}
          villains={filteredVillains}
          onHeroClick={onHeroClick}
          showVillains={showVillains}
        />
        <AudioElements audioRefs={audioRefs} />
      </div>
    </>
  );
});

UserGallery.displayName = 'UserGallery';
