"use client";

import Link from "next/link"; 
import { usePathname } from "next/navigation";  
import { useEffect, useState } from "react";
import { ThemeProvider } from "../../styles/ThemeProvider";
import ModernFooter from "../ui/ModernFooter";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();

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
    const checkAuth = () => {
      const token = localStorage.getItem("jwtToken");
      const storedUsername = localStorage.getItem("username");
      
      if (token && storedUsername) {
        setUsername(storedUsername);
      } else {
        setUsername(null);
      }
    };

    // Verifica autenticação inicial
    checkAuth();

    // Listener para mudanças no localStorage (login/logout)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jwtToken' || e.key === 'username') {
        checkAuth();
      }
    };

    // Listener para mudanças de rota
    const handleRouteChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleRouteChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleRouteChange);
    };
  }, [pathname]);

  useEffect(() => {
    // Adiciona classe de transição baseada na rota
    const body = document.body;
    body.className = `route-${pathname.replace(/\//g, '-')}`;
    
    return () => {
      body.className = '';
    };
  }, [pathname]);

  return (
    <ThemeProvider>
      {isAuthPage ? (
        <>{children}</>
      ) : (
        <div className="app-container">
          {/* HEADER */}
          <header className="header">
            <div className="header-content">
              <div className="logo">
                <Link href="/" className="logo-link">
                  <span className="logo-text">SuperStats</span>
                </Link>
              </div>

              <nav className="nav">
                {username ? (
                  <>
                    <Link href="/" className="animated-link">Início</Link>
                    <Link href="/graficos" className="animated-link">Gráficos</Link>
                    <Link href="/personagens" className="animated-link">Personagens</Link>
                    <Link href="/filmes" className="animated-link">Filmes</Link>
                    <Link href="/hqs" className="animated-link">HQs</Link> 

                    <div className="user-session">
                      <Link href="/usuario" className="user-btn">
                        {username}!
                      </Link>
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
              </nav>
            </div>
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
                  <Link href="/dashboard/marvel" className={pathname === "/dashboard/marvel" ? "active" : ""}>
                    Marvel
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/dc" className={pathname === "/dashboard/dc" ? "active" : ""}>
                    DC Comics
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
          <ModernFooter />
        </div>
      )}
    </ThemeProvider>
  );
}
