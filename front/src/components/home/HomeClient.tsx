"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import SpeechBubble from "../ui/SpeechBubble";
import HeroVideoOverlay from "../ui/HeroVideoOverlay";
import Image from "next/image";

export default function HomeClient() {
  const spidermanAudio = useRef<HTMLAudioElement>(null);
  const supermanAudio = useRef<HTMLAudioElement>(null);
  const batmanAudio = useRef<HTMLAudioElement>(null);
  const avengersAudio = useRef<HTMLAudioElement>(null);

  const [activeHero, setActiveHero] = useState<string | null>(null);

  const handleHeroClick = (hero: string, audioRef: React.RefObject<HTMLAudioElement | null>) => {
    setActiveHero(hero);
    
    // Para todas as outras músicas que possam estar tocando
    const allAudioRefs = [spidermanAudio, supermanAudio, batmanAudio, avengersAudio];
    
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

      <SpeechBubble type="speech">
        Clique nos heróis e tenha uma experiência única!
      </SpeechBubble>

      <div className="hero-gallery">
        <div className="hero-grid">
          <div 
            className="hero-card batman"
            onClick={() => handleHeroClick('batman', batmanAudio)}
          >
            <Image src="/batman.png" alt="Batman" width={200} height={200} />
            <span className="hero-label">Batman</span>
          </div>
          <div 
            className="hero-card spiderman"
            onClick={() => handleHeroClick('spiderman', spidermanAudio)}
          >
            <Image src="/spiderman.png" alt="Homem-Aranha" width={200} height={200} />
            <span className="hero-label">Homem-Aranha</span>
          </div>
          <div 
            className="hero-card superman"
            onClick={() => handleHeroClick('superman', supermanAudio)}
          >
            <Image src="/superman.png" alt="Superman" width={200} height={200} />
            <span className="hero-label">Superman</span>
          </div>
        </div>
        <div 
          className="hero-horizontal avengers"
          onClick={() => handleHeroClick('avengers', avengersAudio)}
        >
          <Image src="/avengers.png" alt="Vingadores" width={225} height={250} />
          <span className="hero-label">Os Vingadores</span>
        </div>
        <audio ref={batmanAudio} src="/audio/batman-theme.mp3" />
        <audio ref={spidermanAudio} src="/audio/spiderman-theme.mp3" />
        <audio ref={supermanAudio} src="/audio/superman-theme.mp3" />
        <audio ref={avengersAudio} src="/audio/avengers-theme.mp3" />
      </div>

      {activeHero && (
        <HeroVideoOverlay 
          hero={activeHero} 
          onClose={() => setActiveHero(null)} 
        />
      )}

      {/* CTA Section - sempre visível */}
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
    </div>
  );
}
