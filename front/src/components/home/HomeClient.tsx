"use client";

import HeroVideoOverlay from "../ui/HeroVideoOverlay";
import { useHomeLogic } from "../../hooks/useHomeLogic";
import { HeroSection } from "./HeroSection";
import { UserGallery } from "./UserGallery";
import { CTASection } from "./CTASection";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useState, useEffect } from "react";
import styles from "./HomeClient.module.css";

function HomeClient() {
  const {
    isLoggedIn,
    activeHero,
    filteredHeroes,
    filteredVillains,
    showVillains,
    speechBubbleText,
    audioRefs,
    villainInvasion,
    handleHeroClick,
    handleCloseVideo,
    stopAllAudio,
  } = useHomeLogic();

  const [isMuted, setIsMuted] = useState(true);

  // Verificar se há áudio tocando
  useEffect(() => {
    const checkAudioPlaying = () => {
      const anyPlaying = Object.values(audioRefs).some(ref => {
        const audio = ref.current;
        return audio && !audio.paused && !audio.ended && audio.currentTime > 0 && audio.readyState > 2;
      });
      setIsMuted(!anyPlaying);
    };

    // Verificar imediatamente
    checkAudioPlaying();

    // Verificar periodicamente
    const interval = setInterval(checkAudioPlaying, 300);
    
    // Adicionar listeners nos elementos de áudio
    const audioElements = Object.values(audioRefs)
      .map(ref => ref.current)
      .filter(Boolean) as HTMLAudioElement[];

    const handlePlay = () => setIsMuted(false);
    const handlePause = () => setIsMuted(true);
    const handleEnded = () => setIsMuted(true);

    audioElements.forEach(audio => {
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
    });

    return () => {
      clearInterval(interval);
      audioElements.forEach(audio => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      });
    };
  }, [audioRefs]);

  const handleStopMusic = () => {
    stopAllAudio();
    setIsMuted(true);
  };

  return (
    <div className="home-container page-transition">
      {/* Botão para parar músicas */}
      <button 
        className={`${styles.stopMusicButton} ${isMuted ? styles.muted : ''}`}
        onClick={handleStopMusic}
        title={isMuted ? "Nenhuma música tocando" : "Parar todas as músicas"}
        aria-label="Parar todas as músicas"
      >
        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        <span className={styles.buttonText}>{isMuted ? "Música Parada" : "Parar Música"}</span>
      </button>

      {/* Hero Section */}
      <HeroSection />

      {/* Galeria de heróis - só mostra se o usuário estiver logado */}
      <UserGallery
        isLoggedIn={isLoggedIn}
        filteredHeroes={filteredHeroes}
        filteredVillains={filteredVillains}
        showVillains={showVillains}
        speechBubbleText={speechBubbleText}
        audioRefs={audioRefs}
        onHeroClick={handleHeroClick}
        villainInvasion={villainInvasion}
      />

      {/* Video Overlay */}
      {activeHero && (
        <HeroVideoOverlay 
          hero={activeHero} 
          onClose={handleCloseVideo} 
        />
      )}

      {/* CTA Section - só aparece se o usuário estiver logado */}
      <CTASection isLoggedIn={isLoggedIn} />
    </div>
  );
}

export default HomeClient;
