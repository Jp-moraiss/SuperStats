"use client";

import { useState, useEffect, useCallback } from 'react';

interface UseVillainInvasionProps {
  isLoggedIn: boolean;
  selectedAffiliation: 'all' | 'marvel' | 'dc';
  playAudio: (audioId: string) => Promise<boolean>;
}

export const useVillainInvasion = ({ 
  isLoggedIn, 
  selectedAffiliation, 
  playAudio 
}: UseVillainInvasionProps) => {
  const [villainInvasion, setVillainInvasion] = useState(false);
  const [showVillains, setShowVillains] = useState(false);

  const triggerVillainInvasion = useCallback(async () => {
    try {
      setVillainInvasion(true);
      
      // Toca o som do vilão baseado na afiliação
      const audioSuccess = selectedAffiliation === 'dc' 
        ? await playAudio('villainLaugh')
        : selectedAffiliation === 'marvel' 
        ? await playAudio('thanosSnap')
        : false;
      
      if (!audioSuccess) {
        console.warn('Failed to play villain invasion audio');
      }
      
      // Timer da duração do evento (5.5 segundos)
      setTimeout(() => {
        setVillainInvasion(false);
        setShowVillains(true);
      }, 5500);
    } catch (error) {
      console.error('Error triggering villain invasion:', error);
      // Fallback: ainda mostra os vilões mesmo se o áudio falhar
      setVillainInvasion(false);
      setShowVillains(true);
    }
  }, [selectedAffiliation, playAudio]);

  // Easter Egg de Vilões - Timer de 60 segundos
  useEffect(() => {
    if (!isLoggedIn || selectedAffiliation === 'all') return;

    const invasionTimer = setTimeout(() => {
      triggerVillainInvasion();
    }, 600000); // 600 segundos

    return () => clearTimeout(invasionTimer);
  }, [isLoggedIn, selectedAffiliation, triggerVillainInvasion]);

  return {
    villainInvasion,
    showVillains,
    setShowVillains
  };
};
