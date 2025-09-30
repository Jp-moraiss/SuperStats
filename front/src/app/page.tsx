"use client";

import { useRef } from "react";
import SpeechBubble from "../components/SpeechBubble";

export default function HomePage() {
  const spidermanAudio = useRef<HTMLAudioElement>(null);
  const supermanAudio = useRef<HTMLAudioElement>(null);
  const batmanAudio = useRef<HTMLAudioElement>(null);
  const avengersAudio = useRef<HTMLAudioElement>(null);

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
  };

  return (
    <div className="home-container page-transition">
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
            <a href="/dashboard" className="btn-cta">
              <i className="fas fa-chart-line"></i> Explorar Agora
            </a>
            <a href="/comparar" className="btn-secondary">
              <i className="fas fa-fist-raised"></i> Comparar Stats
            </a>
          </div>
        </div>

        <SpeechBubble type="electric" style={{ padding: "12% 18% 36% 0%" }}>
          <span>WOW!</span>
        </SpeechBubble>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <h3>Herói em Alta</h3>
            <p>Descubra quem está dominando as batalhas e os corações dos fãs esta semana.</p>
            <a href="/herois" className="btn-link">Ver Heróis</a>
          </div>
          <div className="feature-card">
            <h3>Vilão Mais Temido</h3>
            <p>Qual vilão espalhou mais caos no universo? Confira o ranking!</p>
            <a href="/viloes" className="btn-link">Ver Vilões</a>
          </div>
          <div className="feature-card">
            <h3>Duelo Épico</h3>
            <p>Compare dois personagens, analise seus poderes e veja quem sai vencedor.</p>
            <a href="/comparar" className="btn-link">Comparar</a>
          </div>
        </div>
      </section>

      <SpeechBubble type="whisper">Clique nos herois e tenha uma experiência única!</SpeechBubble>

      {/* Hero Gallery */}
      <div className="hero-gallery">
        <div className="hero-grid">
          <div className="hero-card batman" onClick={() => playTheme("batman")}>
            <img src="/batman.png" alt="Batman" />
            <span className="hero-label">Batman</span>
          </div>

          <div className="hero-card spiderman" onClick={() => playTheme("spiderman")}>
            <img src="/spiderman.png" alt="Homem-Aranha" />
            <span className="hero-label">Homem-Aranha</span>
          </div>

          <div className="hero-card superman" onClick={() => playTheme("superman")}>
            <img src="/superman.png" alt="Superman" />
            <span className="hero-label">Superman</span>
          </div>
        </div>

        <div className="hero-horizontal avengers" onClick={() => playTheme("avengers")}>
          <img src="/avengers.png" alt="Vingadores" />
          <span className="hero-label">Os Vingadores</span>
        </div>

        {/* Áudios */}
        <audio ref={batmanAudio} src="/audio/batman-theme.mp3" />
        <audio ref={spidermanAudio} src="/audio/spiderman-theme.mp3" />
        <audio ref={supermanAudio} src="/audio/superman-theme.mp3" />
        <audio ref={avengersAudio} src="/audio/avengers-theme.mp3" />
      </div>

      <SpeechBubble type="speech">
        Someone say chimichangas?
      </SpeechBubble> 

      {/* CTA Final */}
      <section className="cta-section">
        <h2>Participe da Pesquisa!</h2>
        <p>Suas respostas moldam o futuro do nosso universo de estatísticas. Junte-se à liga!</p>
        <a href="/pesquisa" className="btn-cta-final">
          <i className="fas fa-pencil-alt"></i> Começar Pesquisa
        </a>
      </section>
    </div>
  );
}
