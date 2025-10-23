"use client";

import { useCallback, useMemo } from 'react';

export interface AudioRefs {
  [key: string]: React.RefObject<HTMLAudioElement | null>;
}

// Constantes para evitar recriação
const HERO_AUDIO_IDS = [
  'batman', 'spiderman', 'superman', 'avengers', 'ironman', 
  'captainamerica', 'blackpanther', 'deadpool', 'flash', 
  'wonderwoman', 'greenlantern', 'justiceleague', 'justiceLeagueSpecial'
] as const;

const VILLAIN_AUDIO_IDS = [
  'joker', 'harleyquinn', 'lexluthor', 'bane', 'darkseid', 
  'suicidesquad', 'thanos', 'doom', 'greengoblin', 'loki', 
  'redskull', 'ultron', 'villainLaugh', 'thanosSnap'
] as const;

export const useAudioManager = () => {
  // Criar refs dinamicamente para todos os áudios
  const audioRefs = useMemo(() => {
    const refs: AudioRefs = {};
    
    const allAudioIds = [...HERO_AUDIO_IDS, ...VILLAIN_AUDIO_IDS];
    for (const id of allAudioIds) {
      refs[id] = { current: null };
    }
    
    return refs;
  }, []);

  const stopAllAudio = useCallback(() => {
    Object.values(audioRefs).forEach(ref => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
  }, [audioRefs]);

  const playAudio = useCallback(async (audioId: string) => {
    try {
      const audioRef = audioRefs[audioId];
      if (!audioRef?.current) {
        console.warn(`Audio ref not found for: ${audioId}`);
        return false;
      }

      // Para todos os outros áudios
      stopAllAudio();
      
      // Se o áudio já está tocando, para e reinicia
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
      
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      return true;
    } catch (error) {
      console.error(`Error playing audio ${audioId}:`, error);
      return false;
    }
  }, [audioRefs, stopAllAudio]);

  const getAudioRef = useCallback((audioId: string) => {
    return audioRefs[audioId];
  }, [audioRefs]);

  return {
    audioRefs,
    playAudio,
    stopAllAudio,
    getAudioRef
  };
};
