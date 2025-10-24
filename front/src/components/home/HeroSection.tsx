"use client";

import React from "react";
import Link from "next/link";
import SpeechBubble from "../ui/SpeechBubble";

/**
 * Seção principal do hero da página inicial
 * 
 * @description Componente focado apenas na apresentação inicial,
 * sem lógica de negócio complexa.
 */
export const HeroSection = React.memo(() => {
  return (
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
  );
});

HeroSection.displayName = 'HeroSection';
