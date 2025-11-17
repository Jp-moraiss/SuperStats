"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useUser } from "./useUser";
import { useAudioManager } from "./useAudioManager";
import { useVillainInvasion } from "./useVillainInvasion";
import { useJusticeLeagueEasterEgg } from "./useJusticeLeagueEasterEgg";
import { 
  heroesData, 
  filterHeroesByAffiliation, 
  getVillainsByAffiliation, 
  Hero 
} from "../data/heroes";
import { 
  getAudioRefId, 
  getSpeechBubbleText, 
  filterHeroesOnly 
} from "../utils/heroUtils";

/**
 * Hook customizado para lógica da página inicial
 * 
 * @description Centraliza toda a lógica complexa do HomeClient,
 * incluindo filtros, áudio, easter eggs e gerenciamento de estado.
 */
export const useHomeLogic = () => {
  // User data and authentication
  const { user, isLoggedIn } = useUser();
  
  // State management
  const [activeHero, setActiveHero] = useState<string | null>(null);
  const [selectedAffiliation, setSelectedAffiliation] = useState<'all' | 'marvel' | 'dc'>('all');

  // Custom hooks
  const { audioRefs, playAudio, stopAllAudio } = useAudioManager();
  
  const { villainInvasion, showVillains } = useVillainInvasion({
    isLoggedIn,
    selectedAffiliation,
    playAudio
  });

  const { handleJusticeLeagueClick, resetJusticeLeagueCount } = useJusticeLeagueEasterEgg({
    playAudio,
    stopAllAudio
  });

  // Auto-set affiliation based on user's favorite universe when logged in
  useEffect(() => {
    if (isLoggedIn && user?.univ_fav) {
      const favoriteUniverse = user.univ_fav.toLowerCase();
      if (favoriteUniverse === 'marvel' || favoriteUniverse === 'dc') {
        setSelectedAffiliation(favoriteUniverse);
      }
    }
  }, [isLoggedIn, user?.univ_fav]);

  // Filter heroes based on selected affiliation - APENAS heróis (sem vilões)
  const allHeroes = useMemo(() => filterHeroesOnly(heroesData), []);
  const filteredHeroes = useMemo(() => 
    filterHeroesByAffiliation(allHeroes, selectedAffiliation), 
    [allHeroes, selectedAffiliation]
  );
  
  // Obtém a lista de vilões APENAS se o evento já rodou
  const filteredVillains = useMemo(() => 
    showVillains && selectedAffiliation !== 'all' 
      ? getVillainsByAffiliation(selectedAffiliation) 
      : [], 
    [showVillains, selectedAffiliation]
  );

  const handleHeroClick = useCallback(async (hero: Hero) => {
    try {
      setActiveHero(hero.id);
      
      // Lógica especial para Liga da Justiça - 3 cliques
      if (hero.id === 'justiceleague') {
        const easterEggActivated = await handleJusticeLeagueClick();
        if (easterEggActivated) {
          return; // Easter egg foi ativado, não toca áudio normal
        }
      } else {
        // Se clicou em outro herói, reseta o contador da Liga da Justiça
        resetJusticeLeagueCount();
      }
      
      // Toca a música do herói selecionado
      const audioRefId = getAudioRefId(hero.id);
      const audioSuccess = await playAudio(audioRefId);
      if (!audioSuccess) {
        console.warn(`Failed to play audio for ${hero.nome}`);
      }
    } catch (error) {
      console.error('Error handling hero click:', error);
    }
  }, [handleJusticeLeagueClick, resetJusticeLeagueCount, playAudio]);

  // Memoizar handlers para evitar re-criação
  const handleCloseVideo = useCallback(() => {
    setActiveHero(null);
  }, []);

  // Função para obter texto do SpeechBubble baseado na afiliação
  const speechBubbleText = useMemo(() => 
    getSpeechBubbleText(selectedAffiliation), 
    [selectedAffiliation]
  );

  return {
    // User state
    isLoggedIn,
    
    // Hero state
    activeHero,
    setActiveHero,
    selectedAffiliation,
    setSelectedAffiliation,
    
    // Filtered data
    filteredHeroes,
    filteredVillains,
    showVillains,
    speechBubbleText,
    
    // Audio
    audioRefs,
    stopAllAudio,
    
    // Special effects
    villainInvasion,
    
    // Handlers
    handleHeroClick,
    handleCloseVideo,
  };
};
