"use client";

import { useState, useCallback } from 'react';

interface UseJusticeLeagueEasterEggProps {
  playAudio: (audioId: string) => Promise<boolean>;
  stopAllAudio: () => void;
}

export const useJusticeLeagueEasterEgg = ({ 
  playAudio, 
  stopAllAudio 
}: UseJusticeLeagueEasterEggProps) => {
  const [justiceLeagueClickCount, setJusticeLeagueClickCount] = useState(0);

  const handleJusticeLeagueClick = useCallback(async () => {
    try {
      const newClickCount = justiceLeagueClickCount + 1;
      setJusticeLeagueClickCount(newClickCount);
      
      // Se chegou a 3 cliques, toca a música especial
      if (newClickCount === 3) {
        setJusticeLeagueClickCount(0); // Reset do contador
        
        // Para todas as outras músicas
        stopAllAudio();
        
        // Toca a música especial
        const audioSuccess = await playAudio('justiceLeagueSpecial');
        if (!audioSuccess) {
          console.warn('Failed to play Justice League special audio');
        }
        return true; // Indica que o easter egg foi ativado
      }
      
      return false; // Easter egg não foi ativado
    } catch (error) {
      console.error('Error handling Justice League easter egg:', error);
      return false;
    }
  }, [justiceLeagueClickCount, playAudio, stopAllAudio]);

  const resetJusticeLeagueCount = useCallback(() => {
    setJusticeLeagueClickCount(0);
  }, []);

  return {
    justiceLeagueClickCount,
    handleJusticeLeagueClick,
    resetJusticeLeagueCount
  };
};
