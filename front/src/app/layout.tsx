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
  const noLayoutRoutes = ["/auth/login", "/auth/register"];
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
                <Link href="/hqs" className="animated-link">HQs</Link> 

                {username ? (
                  <span className="user-label">Olá, {username}!</span>
                ) : (
                  <a href="/auth/login" className="animated-link">Login</a>
                )}
              </nav>
            </header>

            {/* SIDEBAR + MAIN */}
            <div className="content">
              <aside className="sidebar">
                <ul className="sidebar-list">
                  {/* Verificamos se o pathname é igual ao href e adicionamos a classe 'active' */}
                  <li>
                    <Link href="/todos" className={pathname === "/todos" ? "active" : ""}>
                      Todos Personagens
                    </Link>
                  </li>
                  <li>
                    <Link href="/herois" className={pathname === "/herois" ? "active" : ""}>
                      Heróis
                    </Link>
                  </li>
                  <li>
                    <Link href="/viloes" className={pathname === "/viloes" ? "active" : ""}>
                      Vilões
                    </Link>
                  </li>
                  <li>
                    <Link href="/antiherois" className={pathname === "/antiherois" ? "active" : ""}>
                      Anti-Heróis
                    </Link>
                  </li>
                  <li>
                    <Link href="/dc" className={pathname === "/dc" ? "active" : ""}>
                      DC
                    </Link>
                  </li>
                  <li>
                    <Link href="/marvel" className={pathname === "/marvel" ? "active" : ""}>
                      Marvel
                    </Link>
                  </li>
                  <li>
                    <Link href="/comparar" className={pathname === "/comparar" ? "active" : ""}>
                      Comparar Stats
                    </Link>
                  </li>
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
