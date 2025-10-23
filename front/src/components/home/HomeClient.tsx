"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import SpeechBubble from "../ui/SpeechBubble";
import HeroVideoOverlay from "../ui/HeroVideoOverlay";
import Image from "next/image";
import { useUser } from "../../hooks/useUser";
import { heroesData, filterHeroesByAffiliation, getVillainsByAffiliation, Hero } from "../../data/heroes";

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
  
  // Audio refs para vilões
  const jokerAudio = useRef<HTMLAudioElement>(null);
  const harleyquinnAudio = useRef<HTMLAudioElement>(null);
  const lexluthorAudio = useRef<HTMLAudioElement>(null);
  const baneAudio = useRef<HTMLAudioElement>(null);
  const darkseidAudio = useRef<HTMLAudioElement>(null);
  const suicidesquadAudio = useRef<HTMLAudioElement>(null);
  const thanosAudio = useRef<HTMLAudioElement>(null);
  const doomAudio = useRef<HTMLAudioElement>(null);
  const greengoblinAudio = useRef<HTMLAudioElement>(null);
  const lokiAudio = useRef<HTMLAudioElement>(null);
  const redskullAudio = useRef<HTMLAudioElement>(null);
  const ultronAudio = useRef<HTMLAudioElement>(null);
  const villainLaughAudio = useRef<HTMLAudioElement>(null);
  const thanosSnapAudio = useRef<HTMLAudioElement>(null);

  // State management
  const [activeHero, setActiveHero] = useState<string | null>(null);
  const [selectedAffiliation, setSelectedAffiliation] = useState<'all' | 'marvel' | 'dc'>('all');
  const [justiceLeagueClickCount, setJusticeLeagueClickCount] = useState(0);
  const [villainInvasion, setVillainInvasion] = useState(false);
  const [showVillains, setShowVillains] = useState(false);

  // Auto-set affiliation based on user's favorite universe when logged in
  useEffect(() => {
    if (isLoggedIn && user?.univ_fav) {
      const favoriteUniverse = user.univ_fav.toLowerCase();
      if (favoriteUniverse === 'marvel' || favoriteUniverse === 'dc') {
        setSelectedAffiliation(favoriteUniverse);
      }
    }
  }, [isLoggedIn, user?.univ_fav]);

  // Easter Egg de Vilões - Lógica de Sincronia Corrigida
  useEffect(() => {
    if (!isLoggedIn) return;

    // Timer principal de 15 segundos para iniciar o evento
    const invasionTimer = setTimeout(() => {
      // 1. Ativa a invasão (overlay, flash e bubble)
      setVillainInvasion(true);
      
      // 2. Toca o som do vilão baseado na afiliação
      if (selectedAffiliation === 'dc' && villainLaughAudio.current) {
        villainLaughAudio.current.currentTime = 0;
        villainLaughAudio.current.play().catch(console.error);
      } else if (selectedAffiliation === 'marvel' && thanosSnapAudio.current) {
        thanosSnapAudio.current.currentTime = 0;
        thanosSnapAudio.current.play().catch(console.error);
      }
      
      // 3. Timer da DURAÇÃO do evento (5.5 segundos)
      const eventDurationTimer = setTimeout(() => {
        // 4. Termina o evento de invasão (desliga o overlay)
        setVillainInvasion(false);
        // 5. MOSTRA permanentemente os cards dos vilões
        setShowVillains(true);
      }, 5500); // Duração da animação de flash

      // Limpeza do timer de duração
      return () => clearTimeout(eventDurationTimer);

    }, 60000); // 60 segundos

    // Limpeza do timer principal
    return () => clearTimeout(invasionTimer);
  }, [isLoggedIn, selectedAffiliation]);

  // Filter heroes based on selected affiliation - APENAS heróis (sem vilões)
  const allHeroes = heroesData.filter(hero => 
    !['joker', 'harleyquinn', 'lexluthor', 'bane', 'darkseid', 'suicidesquad', 
      'thanos', 'doom', 'greengoblin', 'loki', 'redskull', 'ultron'].includes(hero.id)
  );
  const filteredHeroes = filterHeroesByAffiliation(allHeroes, selectedAffiliation);
  
  // Obtém a lista de vilões APENAS se o evento já rodou
  const filteredVillains = showVillains && selectedAffiliation !== 'all' ? getVillainsByAffiliation(selectedAffiliation) : [];

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
    const allAudioRefs = [
      spidermanAudio, supermanAudio, batmanAudio, avengersAudio, ironmanAudio, captainamericaAudio, 
      blackpantherAudio, deadpoolAudio, flashAudio, wonderwomanAudio, greenlanternAudio, 
      justiceleagueAudio, justiceLeagueSpecialAudio, jokerAudio, harleyquinnAudio, lexluthorAudio, 
      baneAudio, darkseidAudio, suicidesquadAudio, thanosAudio, doomAudio, greengoblinAudio, 
      lokiAudio, redskullAudio, ultronAudio, villainLaughAudio, thanosSnapAudio
    ];
    
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
      
      {/* Overlay de Invasão de Vilão (Flash e Bubble Centralizado) */}
      {villainInvasion && (
        <div className="villain-invasion-overlay">
          <div className="villain-invasion-bubble">
            <h2 className="villain-invasion-text">
                Achou que era só sobre os &apos;mocinhos&apos;?
            </h2>
          </div>
        </div>
      )}
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

      {/* O SpeechBubble do vilão foi movido para o overlay acima */}

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
              
              {/* Renderizar vilões SÓ SE 'showVillains' for true */}
              {showVillains && filteredVillains.map((villain) => {
                const audioRef = villain.id === 'joker' ? jokerAudio :
                               villain.id === 'harleyquinn' ? harleyquinnAudio :
                               villain.id === 'lexluthor' ? lexluthorAudio :
                               villain.id === 'bane' ? baneAudio :
                               villain.id === 'darkseid' ? darkseidAudio :
                               villain.id === 'suicidesquad' ? suicidesquadAudio :
                               villain.id === 'thanos' ? thanosAudio :
                               villain.id === 'doom' ? doomAudio :
                               villain.id === 'greengoblin' ? greengoblinAudio :
                               villain.id === 'loki' ? lokiAudio :
                               villain.id === 'redskull' ? redskullAudio :
                               villain.id === 'ultron' ? ultronAudio : jokerAudio;
                
                return (
                  <div 
                    key={villain.id}
                    className={`hero-card villain-card ${villain.id}`}
                    onClick={() => handleHeroClick(villain, audioRef)}
                  >
                    <Image src={villain.imagemSrc} alt={villain.nome} width={200} height={200} />
                    <span className="hero-label">{villain.nome}</span>
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
        
        {/* Áudios dos vilões */}
        <audio ref={jokerAudio} src="/audio/joker-theme.mp3" />
        <audio ref={harleyquinnAudio} src="/audio/harleyquinn-theme.mp3" />
        <audio ref={lexluthorAudio} src="/audio/lexluthor-theme.mp3" />
        <audio ref={baneAudio} src="/audio/bane-theme.mp3" />
        <audio ref={darkseidAudio} src="/audio/darkseid-theme.mp3" />
        <audio ref={suicidesquadAudio} src="/audio/suicidesquad-theme.mp3" />
        <audio ref={thanosAudio} src="/audio/thanos-theme.mp3" />
        <audio ref={doomAudio} src="/audio/doom-theme.mp3" />
        <audio ref={greengoblinAudio} src="/audio/greengoblin-theme.mp3" />
        <audio ref={lokiAudio} src="/audio/loki-theme.mp3" />
        <audio ref={redskullAudio} src="/audio/redskull-theme.mp3" />
        <audio ref={ultronAudio} src="/audio/ultron-theme.mp3" />
        {/* Áudios do EVENTO de invasão */}
        <audio ref={villainLaughAudio} src="/audio/joker-laugh.mp3" />
        <audio ref={thanosSnapAudio} src="/audio/thanos-snap.mp3" />
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
