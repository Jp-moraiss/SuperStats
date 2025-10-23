"use client";

import React from 'react';
import styles from './ModernFooter.module.css';

const ModernFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <h3 className={styles.logo}>SuperStats</h3>
          <p className={styles.tagline}>
            O portal definitivo para fãs de super-heróis
          </p>
        </div>

        {/* Main Content Grid */}
        <div className={styles.mainContent}>
          
          {/* Coluna 2: Sobre o Projeto */}
          <div className={styles.linkGroup}>
            <h4 className={styles.linkTitle}>Sobre o Projeto</h4>
            <p className={styles.projectDescription}>
              Este é um projeto acadêmico desenvolvido como parte do Bacharelado em Ciência da Computação da <strong>CESAR School</strong>.
            </p>
            <a 
              href="https://github.com/Jp-moraiss/SuperStats"
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.githubButton}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Ver Repositório
            </a>
          </div>

          {/* Coluna 3: Fontes de Dados (APIs) */}
          <div className={styles.linkGroup}>
            <h4 className={styles.linkTitle}>Fontes de Dados</h4>
            <p className={styles.projectDescription}>
              Todos os dados de personagens, filmes e quadrinhos são fornecidos por estas incríveis APIs:
            </p>
            <ul className={styles.apiList}>
              <li>
                <a href="https://comicvine.gamespot.com" target="_blank" rel="noopener noreferrer" className={styles.apiLink}>
                  Comic Vine API
                </a>
              </li>
              <li>
                <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className={styles.apiLink}>
                  TMDB (The Movie Database)
                </a>
              </li>
              <li>
                <a href="https://superheroapi.com" target="_blank" rel="noopener noreferrer" className={styles.apiLink}>
                  SuperHero API
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar Simplificado */}
      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {currentYear} SuperStats. Um Projeto Acadêmico da CESAR School.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;