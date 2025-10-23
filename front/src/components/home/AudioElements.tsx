"use client";

import React from 'react';
import { AudioRefs } from '../../hooks/useAudioManager';

interface AudioElementsProps {
  audioRefs: AudioRefs;
}

export const AudioElements: React.FC<AudioElementsProps> = ({ audioRefs }) => {
  return (
    <>
      {/* Áudios dos heróis */}
      <audio ref={audioRefs.batman} src="/audio/batman-theme.mp3" preload="none" />
      <audio ref={audioRefs.spiderman} src="/audio/spiderman-theme.mp3" preload="none" />
      <audio ref={audioRefs.superman} src="/audio/superman-theme.mp3" preload="none" />
      <audio ref={audioRefs.avengers} src="/audio/avengers-theme.mp3" preload="none" />
      <audio ref={audioRefs.ironman} src="/audio/ironman-theme.mp3" preload="none" />
      <audio ref={audioRefs.captainamerica} src="/audio/captainamerica-theme.mp3" preload="none" />
      <audio ref={audioRefs.blackpanther} src="/audio/blackpanther-theme.mp3" preload="none" />
      <audio ref={audioRefs.deadpool} src="/audio/deadpool-theme.mp3" preload="none" />
      <audio ref={audioRefs.flash} src="/audio/flash-theme.mp3" preload="none" />
      <audio ref={audioRefs.wonderwoman} src="/audio/wonderwoman-theme.mp3" preload="none" />
      <audio ref={audioRefs.greenlantern} src="/audio/greenlantern-theme.mp3" preload="none" />
      <audio ref={audioRefs.justiceleague} src="/audio/justiceleague-theme.mp3" preload="none" />
      <audio ref={audioRefs.justiceLeagueSpecial} src="/audio/justiceleague-special-theme.mp3" preload="none" />
      
      {/* Áudios dos vilões */}
      <audio ref={audioRefs.joker} src="/audio/joker-theme.mp3" preload="none" />
      <audio ref={audioRefs.harleyquinn} src="/audio/harleyquinn-theme.mp3" preload="none" />
      <audio ref={audioRefs.lexluthor} src="/audio/lexluthor-theme.mp3" preload="none" />
      <audio ref={audioRefs.bane} src="/audio/bane-theme.mp3" preload="none" />
      <audio ref={audioRefs.darkseid} src="/audio/darkseid-theme.mp3" preload="none" />
      <audio ref={audioRefs.suicidesquad} src="/audio/suicidesquad-theme.mp3" preload="none" />
      <audio ref={audioRefs.thanos} src="/audio/thanos-theme.mp3" preload="none" />
      <audio ref={audioRefs.doom} src="/audio/doom-theme.mp3" preload="none" />
      <audio ref={audioRefs.greengoblin} src="/audio/greengoblin-theme.mp3" preload="none" />
      <audio ref={audioRefs.loki} src="/audio/loki-theme.mp3" preload="none" />
      <audio ref={audioRefs.redskull} src="/audio/redskull-theme.mp3" preload="none" />
      <audio ref={audioRefs.ultron} src="/audio/ultron-theme.mp3" preload="none" />
      
      {/* Áudios do evento de invasão */}
      <audio ref={audioRefs.villainLaugh} src="/audio/joker-laugh.mp3" preload="none" />
      <audio ref={audioRefs.thanosSnap} src="/audio/thanos-snap.mp3" preload="none" />
    </>
  );
};
