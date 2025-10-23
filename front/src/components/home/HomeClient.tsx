"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import SpeechBubble from "../ui/SpeechBubble";
import HeroVideoOverlay from "../ui/HeroVideoOverlay";
import { useUser } from "../../hooks/useUser";
import { heroesData, filterHeroesByAffiliation, getVillainsByAffiliation, Hero } from "../../data/heroes";
import { useAudioManager } from "../../hooks/useAudioManager";
import { useVillainInvasion } from "../../hooks/useVillainInvasion";
import { useJusticeLeagueEasterEgg } from "../../hooks/useJusticeLeagueEasterEgg";
import { HeroGrid } from "./HeroGrid";
import { VillainInvasionOverlay } from "./VillainInvasionOverlay";
import { AudioElements } from "./AudioElements";
import { getAudioRefId, getSpeechBubbleText, filterHeroesOnly } from "../../utils/heroUtils";

function HomeClient() {
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

  // Função para obter texto do SpeechBubble baseado na afiliação
  const speechBubbleText = useMemo(() => 
    getSpeechBubbleText(selectedAffiliation), 
    [selectedAffiliation]
  );

  return (
    <div className="home-container page-transition">
      {/* Overlay de Invasão de Vilão */}
      <VillainInvasionOverlay isActive={villainInvasion} />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Bem-vindo ao <span>SuperStats!</span>
          </h1>
          <p className="hero-subtitle">
            Seu <strong>portal de fãs</strong> para explorar <em>Heróis</em>, <em>Vilões</em> e todas as estatísticas que fazem os quadrinhos ganharem vida!
          </p>
          <div className="hero-buttons">
            <Link href="/dashboard/todos" className="btn-cta">
              <i className="fas fa-chart-line"></i> Explorar Agora
            </Link>
            <Link href="/comparar" className="btn-secondary">
              <i className="fas fa-fist-raised"></i> Comparar Stats
            </Link>
          </div>
        </div>
        <SpeechBubble type="electric">
          <span>WOW!</span>
        </SpeechBubble>
      </section>

      {/* Galeria de heróis - só mostra se o usuário estiver logado */}
      {isLoggedIn && (
        <>
          <SpeechBubble type="speech">
            {speechBubbleText}
          </SpeechBubble>

          <div className="hero-gallery">
            <HeroGrid
              heroes={filteredHeroes}
              villains={filteredVillains}
              onHeroClick={handleHeroClick}
              showVillains={showVillains}
            />
            <AudioElements audioRefs={audioRefs} />
          </div>
        </>
      )}

      {/* Video Overlay */}
      {activeHero && (
        <HeroVideoOverlay 
          hero={activeHero} 
          onClose={() => setActiveHero(null)} 
        />
      )}

      {/* CTA Section - só aparece se o usuário estiver logado */}
      {isLoggedIn && (
        <section className="cta-section">
          <div className="cta-content">
            <h2>Participe da Pesquisa!</h2>
            <p>Suas respostas moldam o futuro do nosso universo de estatísticas. Junte-se à liga!</p>
            <div className="cta-buttons">
              <Link href="/pesquisa" className="btn-cta-final">
                <i className="fas fa-pencil-alt"></i> Começar Pesquisa
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default HomeClient;
