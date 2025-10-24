"use client";

import React from "react";
import Link from "next/link";

interface CTASectionProps {
  isLoggedIn: boolean;
}

/**
 * Seção de Call-to-Action para usuários logados
 * 
 * @description Componente simples para exibir CTA de pesquisa,
 * apenas para usuários autenticados.
 */
export const CTASection = React.memo(({ isLoggedIn }: CTASectionProps) => {
  if (!isLoggedIn) {
    return null;
  }

  return (
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
  );
});

CTASection.displayName = 'CTASection';
