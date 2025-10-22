"use client";

import { useRef, useState, useEffect } from "react"; // <-- NOVO (adicionado useEffect)
import Link from "next/link";
import SpeechBubble from "../components/ui/SpeechBubble";
import HeroVideoOverlay from "../components/ui/HeroVideoOverlay";
import Image from "next/image";

export default function HomePage() {
  const spidermanAudio = useRef<HTMLAudioElement>(null);
  const supermanAudio = useRef<HTMLAudioElement>(null);
  const batmanAudio = useRef<HTMLAudioElement>(null);
  const avengersAudio = useRef<HTMLAudioElement>(null);

  const [activeHero, setActiveHero] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // <-- NOVO

  // <-- NOVO: Verifica se o usuário está logado ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []); // O array vazio [] garante que isso rode apenas uma vez, quando o componente montar

  const playTheme = (hero: "spiderman" | "superman" | "batman" | "avengers") => {
    [spidermanAudio, supermanAudio, batmanAudio, avengersAudio].forEach((ref) => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });

    if (hero === "spiderman" && spidermanAudio.current) spidermanAudio.current.play();
    if (hero === "superman" && supermanAudio.current) supermanAudio.current.play();
    if (hero === "batman" && batmanAudio.current) batmanAudio.current.play();
    if (hero === "avengers" && avengersAudio.current) avengersAudio.current.play();
    
    setActiveHero(hero);
  };

  return (
    <div className="home-container page-transition">
      <HeroVideoOverlay hero={activeHero} onClose={() => setActiveHero(null)} />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Bem-vindo ao <span>SuperStats!</span>
          </h1>
          <p className="hero-subtitle">
            Seu <strong>portal de fãs</strong> para explorar <em>Heróis</em>,{" "}
            <em>Vilões</em> e todas as estatísticas que fazem os quadrinhos
            ganharem vida!
          </p>

          <div className="hero-buttons">
            <Link href="/todos" className="btn-cta">
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

      {/* Hero Gallery */}
      <div className="hero-gallery">
        <div className="hero-grid">
          <div className="hero-card batman" onClick={() => playTheme("batman")}>
            <Image src="/batman.png" alt="Batman" width={200} height={200} />
            <span className="hero-label">Batman</span>
          </div>

          <div className="hero-card spiderman" onClick={() => playTheme("spiderman")}>
            <Image src="/spiderman.png" alt="Homem-Aranha" width={200} height={200} />
            <span className="hero-label">Homem-Aranha</span>
          </div>

          <div className="hero-card superman" onClick={() => playTheme("superman")}>
            <Image src="/superman.png" alt="Superman" width={200} height={200} />
            <span className="hero-label">Superman</span>
          </div>
        </div>

        <div className="hero-horizontal avengers" onClick={() => playTheme("avengers")}>
          <Image src="/avengers.png" alt="Vingadores" width={225} height={250} />
          <span className="hero-label">Os Vingadores</span>
        </div>

        {/* Áudios */}
        <audio ref={batmanAudio} src="/audio/batman-theme.mp3" />
        <audio ref={spidermanAudio} src="/audio/spiderman-theme.mp3" />
        <audio ref={supermanAudio} src="/audio/superman-theme.mp3" />
        <audio ref={avengersAudio} src="/audio/avengers-theme.mp3" />
      </div>

      {/* CTA Final */}
      {/* <-- NOVO: Adicionado renderização condicional --> */}
      {isLoggedIn && (
        <section className="cta-section">
          <h2>Participe da Pesquisa!</h2>
          <p>Suas respostas moldam o futuro do nosso universo de estatísticas. Junte-se à liga!</p>
          <a href="/pesquisa" className="btn-cta-final">
            <i className="fas fa-pencil-alt"></i> Começar Pesquisa
          </a>
        </section>
      )}
    </div>
  );
}