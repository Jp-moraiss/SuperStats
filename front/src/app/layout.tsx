"use client";

import "../styles/globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation"; // NOVO: Importa o useRouter
import router from "next/router";
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

  // rotas que não devem usar o layout global
  const noLayoutRoutes = ["/auth/login", "/auth/register"];
  const isAuthPage = noLayoutRoutes.includes(pathname);

  const [username, setUsername] = useState<string | null>(null);

    // NOVO: Função de Logout
  const handleLogout = () => {
    // Limpa os dados do localStorage
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");

    // Atualiza o estado para refletir o logout na UI
    setUsername(null);

    // Redireciona o usuário para a página de login
    router.push("/auth/login");
  };

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
        <ThemeProvider>
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
                  <div className="user-session">
                    <span className="user-greeting">{username}!</span>
                    <button onClick={handleLogout} className="logout-btn">
                      Sair
                    </button>
                  </div>
                ) : (
                  <Link href="/auth/login" className="login-btn">Login</Link>
                )}
              </nav>
            </header>

            {/* SIDEBAR + MAIN */}
            <div className="content">
              <aside className="sidebar">
                <ul className="sidebar-list">
                  {/* Verificamos se o pathname é igual ao href e adicionamos a classe 'active' */}
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
