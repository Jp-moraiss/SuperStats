"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // rotas que não devem usar o layout global
  const noLayoutRoutes = ["/login", "/register"];
  const isAuthPage = noLayoutRoutes.includes(pathname);

  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const storedUser = localStorage.getItem("username");

    if (token && storedUser) {
      setUsername(storedUser);
    } else {
      setUsername(null);
    }
  }, [pathname]); // reexecuta quando trocar de rota

  return (
    <html lang="pt-br">
      <body>
        {isAuthPage ? (
          <>{children}</>
        ) : (
          <div className="app-container">
            {/* HEADER */}
            <header className="header">
              <h1 className="logo animated-pop">SuperStats!</h1>
              <nav className="nav">
                <a href="/" className="animated-link">Início</a>
                <a href="/graficos" className="animated-link">Dashboard</a>
                <a href="/filmes" className="animated-link">Filmes</a>
                <a href="/pesquisa" className="animated-link">Pesquisa</a>

                {username ? (
                  <span className="user-label">Olá, {username}!</span>
                ) : (
                  <a href="/login" className="animated-link">Login</a>
                )}
              </nav>
            </header>

            {/* SIDEBAR + MAIN */}
            <div className="content">
              <aside className="sidebar">
                <ul className="sidebar-list">
                  <li><a href="/todos">Todos Personagens</a></li>
                  <li><a href="/herois">Heróis</a></li>
                  <li><a href="/viloes">Vilões</a></li>
                  <li><a href="/antiherois">Anti-Heróis</a></li>
                  <li><a href="/dc">DC</a></li>
                  <li><a href="/marvel">Marvel</a></li>
                  <li><a href="/comparar">Comparar Stats</a></li>
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
        )}
      </body>
    </html>
  );
}
