"use client";

import "../styles/globals.css";
import Link from "next/link"; 
import { usePathname } from "next/navigation";  
import { useEffect, useState } from "react";
import { ThemeProvider } from "../styles/ThemeProvider";
import "../styles/comic-theme.css";
import "../styles/comic-buttons.css"; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // --- CORREÇÃO AQUI --- 

  const noLayoutRoutes = ["/auth/login", "/auth/register"];
  const isAuthPage = noLayoutRoutes.includes(pathname);

  const [username, setUsername] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    setUsername(null);
    
    window.location.href = "/";
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const storedUser = localStorage.getItem("username");

    if (token && storedUser) {
      setUsername(storedUser);
    } else {
      setUsername(null);
    }
  }, [pathname]);

  return (
    <html lang="pt-br">
      <body>
        <ThemeProvider>
          {isAuthPage ? (
            <>{children}</>
          ) : (
            <div className="app-container">
              {/* HEADER */}
              <header className="header">
                <h1 className="logo animated-pop">SuperStats!</h1>
                <nav className="nav">
                  
                  {username ? (
                    <>
                      <Link href="/" className="animated-link">Início</Link>
                      <Link href="/graficos" className="animated-link">Pesquisa</Link>
                      <Link href="/filmes" className="animated-link">Filmes</Link>
                      <Link href="/hqs" className="animated-link">HQs</Link> 

                      <div className="user-session">
                        <span className="user-greeting">{username}!</span>
                        <button onClick={handleLogout} className="logout-btn">
                          Sair
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/" className="animated-link">Início</Link>
                      <Link href="/auth/register" className="login-btn">Registrar</Link>
                      <Link href="/auth/login" className="login-btn">Login</Link>
                    </>
                  )}
                  {/* <-- FIM DA MUDANÇA --> */}

                </nav>
              </header>

              {/* SIDEBAR + MAIN */}
              <div className="content">
                <aside className="sidebar">
                  <ul className="sidebar-list">
                    <li>
                      <Link href="/dashboard/todos" className={pathname === "/dashboard/todos" ? "active" : ""}>
                        Todos Personagens
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/herois" className={pathname === "/dashboard/herois" ? "active" : ""}>
                        Heróis
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/viloes" className={pathname === "/dashboard/viloes" ? "active" : ""}>
                        Vilões
                      </Link>
                    </li> 
                    <li>
                      <Link href="/dashboard/dc" className={pathname === "/dashboard/dc" ? "active" : ""}>
                        DC
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/marvel" className={pathname === "/dashboard/marvel" ? "active" : ""}>
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
        </ThemeProvider>
      </body>
    </html>
  );
}