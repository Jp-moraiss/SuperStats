"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import SpeechBubble from "../ui/SpeechBubble";
import HeroVideoOverlay from "../ui/HeroVideoOverlay";
import Image from "next/image";
import { useUser } from "../../hooks/useUser";
import { heroesData, filterHeroesByAffiliation, Hero } from "../../data/heroes";

export default function HomeClient() {
  // User data and authentication
  const { user, isLoggedIn } = useUser();
  
  // Audio refs
  const spidermanAudio = useRef<HTMLAudioElement>(null);
  const supermanAudio = useRef<HTMLAudioElement>(null);
  const batmanAudio = useRef<HTMLAudioElement>(null);
  const avengersAudio = useRef<HTMLAudioElement>(null);
  const ironmanAudio = useRef<HTMLAudioElement>(null);
  const captainamericaAudio = useRef<HTMLAudioElement>(null);
  const blackpantherAudio = useRef<HTMLAudioElement>(null);
  const deadpoolAudio = useRef<HTMLAudioElement>(null);
  const flashAudio = useRef<HTMLAudioElement>(null);
  const wonderwomanAudio = useRef<HTMLAudioElement>(null);
  const greenlanternAudio = useRef<HTMLAudioElement>(null);
  const justiceleagueAudio = useRef<HTMLAudioElement>(null);
  const justiceLeagueSpecialAudio = useRef<HTMLAudioElement>(null);

  // State management
  const [activeHero, setActiveHero] = useState<string | null>(null);
  const [selectedAffiliation, setSelectedAffiliation] = useState<'all' | 'marvel' | 'dc'>('all');
  const [justiceLeagueClickCount, setJusticeLeagueClickCount] = useState(0);

  // Auto-set affiliation based on user's favorite universe when logged in
  useEffect(() => {
    if (isLoggedIn && user?.univ_fav) {
      const favoriteUniverse = user.univ_fav.toLowerCase();
      if (favoriteUniverse === 'marvel' || favoriteUniverse === 'dc') {
        setSelectedAffiliation(favoriteUniverse);
      }
    }
  }, [isLoggedIn, user?.univ_fav]);

  // Filter heroes based on selected affiliation
  const filteredHeroes = filterHeroesByAffiliation(heroesData, selectedAffiliation);

  const handleHeroClick = (hero: Hero, audioRef: React.RefObject<HTMLAudioElement | null>) => {
    setActiveHero(hero.id);
    
    // Lógica especial para Liga da Justiça - 3 cliques
    if (hero.id === 'justiceleague') {
      const newClickCount = justiceLeagueClickCount + 1;
      setJusticeLeagueClickCount(newClickCount);
      
      // Se chegou a 3 cliques, toca a música especial
      if (newClickCount === 3) {
        setJusticeLeagueClickCount(0); // Reset do contador
        
        // Para todas as outras músicas
        const allAudioRefs = [spidermanAudio, supermanAudio, batmanAudio, avengersAudio, ironmanAudio, captainamericaAudio, blackpantherAudio, deadpoolAudio, flashAudio, wonderwomanAudio, greenlanternAudio, justiceleagueAudio];
        
        allAudioRefs.forEach(ref => {
          if (ref.current) {
            ref.current.pause();
            ref.current.currentTime = 0;
          }
        });
        
        // Toca a música especial
        if (justiceLeagueSpecialAudio.current) {
          justiceLeagueSpecialAudio.current.currentTime = 0;
          justiceLeagueSpecialAudio.current.play().catch(console.error);
        }
        return; // Sai da função para não executar o resto
      }
    } else {
      // Se clicou em outro herói, reseta o contador da Liga da Justiça
      setJusticeLeagueClickCount(0);
    }
    
    // Para todas as outras músicas que possamsk estar tocando
    const allAudioRefs = [spidermanAudio, supermanAudio, batmanAudio, avengersAudio, ironmanAudio, captainamericaAudio, blackpantherAudio, deadpoolAudio, flashAudio, wonderwomanAudio, greenlanternAudio, justiceleagueAudio, justiceLeagueSpecialAudio];
    
    allAudioRefs.forEach(ref => {
      if (ref.current && ref !== audioRef) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
    
    // Toca a música do herói selecionado
    if (audioRef.current) {
      // Se a música já está tocando, para e reinicia
      if (!audioRef.current.paused) {
        audioRef.current.pause();
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
  };

  // Função para obter texto do SpeechBubble baseado na afiliação
  const getSpeechBubbleText = () => {  
    if (selectedAffiliation === 'marvel') return "Avante, Vingadores!";
    if (selectedAffiliation === 'dc') return "Pela Justiça!";
    return "Clique nos heróis!";
  };

  return (
    <div className="home-container page-transition">
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

      {/* Só mostra a galeria de heróis se o usuário estiver logado */}
      {isLoggedIn ? (
        <>
      <SpeechBubble type="speech">
            {getSpeechBubbleText()}
      </SpeechBubble>

      <div className="hero-gallery">
        <div className="hero-grid">
              {filteredHeroes.map((hero) => {
                const audioRef = hero.id === 'batman' ? batmanAudio : 
                               hero.id === 'spiderman' ? spidermanAudio : 
                               hero.id === 'superman' ? supermanAudio : 
                               hero.id === 'avengers' ? avengersAudio :
                               hero.id === 'ironman' ? ironmanAudio :
                               hero.id === 'captainamerica' ? captainamericaAudio :
                               hero.id === 'blackpanther' ? blackpantherAudio :
                               hero.id === 'deadpool' ? deadpoolAudio :
                               hero.id === 'flash' ? flashAudio :
                               hero.id === 'wonderwoman' ? wonderwomanAudio :
                               hero.id === 'greenlantern' ? greenlanternAudio :
                               hero.id === 'justiceleague' ? justiceleagueAudio : avengersAudio;
                
                return (
                  <div 
                    key={hero.id}
                    className={`hero-card ${hero.id}`}
                    onClick={() => handleHeroClick(hero, audioRef)}
                  >
                    <Image src={hero.imagemSrc} alt={hero.nome} width={200} height={200} />
                    <span className="hero-label">{hero.nome}</span>
          </div>
                );
              })}
          </div>
            
            <audio ref={batmanAudio} src="/audio/batman-theme.mp3" />
            <audio ref={spidermanAudio} src="/audio/spiderman-theme.mp3" />
            <audio ref={supermanAudio} src="/audio/superman-theme.mp3" />
            <audio ref={avengersAudio} src="/audio/avengers-theme.mp3" />
            <audio ref={ironmanAudio} src="/audio/ironman-theme.mp3" />
            <audio ref={captainamericaAudio} src="/audio/captainamerica-theme.mp3" />
            <audio ref={blackpantherAudio} src="/audio/blackpanther-theme.mp3" />
            <audio ref={deadpoolAudio} src="/audio/deadpool-theme.mp3" />
            <audio ref={flashAudio} src="/audio/flash-theme.mp3" />
            <audio ref={wonderwomanAudio} src="/audio/wonderwoman-theme.mp3" />
            <audio ref={greenlanternAudio} src="/audio/greenlantern-theme.mp3" />
            <audio ref={justiceleagueAudio} src="/audio/justiceleague-theme.mp3" />
            <audio ref={justiceLeagueSpecialAudio} src="/audio/justiceleague-special-theme.mp3" />
      </div>
        </>
      ) : null}

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