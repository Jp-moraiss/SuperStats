"use client";

import HeroVideoOverlay from "../ui/HeroVideoOverlay";
import { useHomeLogic } from "../../hooks/useHomeLogic";
import { HeroSection } from "./HeroSection";
import { UserGallery } from "./UserGallery";
import { CTASection } from "./CTASection";

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
  } = useHomeLogic();

  return (
    <div className="home-container page-transition">
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
