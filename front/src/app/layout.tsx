"use client";

import "./globals.css"; 
import SpeechBubble from "../components/SpeechBubble";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <div className="app-container">
          {/* HEADER */}
          <header className="header">
            <h1 className="logo animated-pop">SuperStats!</h1>
            <nav className="nav">
              <a href="/" className="animated-link">Início</a>
              <a href="/dashboard" className="animated-link">Dashboard</a>
              <a href="/pesquisa" className="animated-link">Pesquisa</a>
              <a href="/eventos" className="animated-link">Eventos</a>
            </nav> 
          </header>

          {/* SIDEBAR + MAIN */}
          <div className="content">
            <aside className="sidebar"> 
              <ul className="sidebar-list">
                <li><a href="/herois">Heróis</a></li>
                <li><a href="/viloes">Vilões</a></li>
                <li><a href="/comparar">Comparar Stats</a></li>
                <li><a href="/tendencias">Tendências</a></li>
              </ul>
            </aside>

            <main className="main page-transition"> 
            <div className="halftone-background"></div>
              {children}
            </main>
          </div>

          {/* FOOTER */}
          <footer className="footer">
            <p>© {new Date().getFullYear()} SuperStats - Portal de Fãs</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
