"use client";

import "./globals.css";
import Link from "next/link";
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
                <Link href="/" className="animated-link">Início</Link>
                <Link href="/graficos" className="animated-link">Pesquisa</Link>
                <Link href="/filmes" className="animated-link">Filmes</Link>
                <Link href="/quadrinhos" className="animated-link">HQs</Link> 

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
                  <li><Link href="/todos">Todos Personagens</Link></li>
                  <li><Link href="/herois">Heróis</Link></li>
                  <li><Link href="/viloes">Vilões</Link></li>
                  <li><Link href="/antiherois">Anti-Heróis</Link></li>
                  <li><Link href="/dc">DC</Link></li>
                  <li><Link href="/marvel">Marvel</Link></li>
                  <li><Link href="/comparar">Comparar Stats</Link></li>
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
