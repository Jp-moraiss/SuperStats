"use client";
import { useState, useEffect } from "react";
import { FaFilm, FaTrash, FaYoutube, FaCheck, FaUndo } from "react-icons/fa";

// --- TIPAGEM ---
type Movie = {
  id: number;
  titulo: string;
  produtora: string;
  diretor: string;
  posterUrl: string;
  trailerUrl?: string;
  avaliacaoTmdb: number;
  assistido: boolean;
};

// --- FUNÇÕES DE API ---
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('jwtToken');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, ...options.headers };
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('jwtToken');
    window.location.href = '/login';
  }
  return response;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Componente Principal da Página
export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [producers, setProducers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('catalogo');
  const [isLoading, setIsLoading] = useState(true);
  
  // Efeito para carregar todos os dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [moviesRes, watchedRes, producersRes] = await Promise.all([
          fetchWithAuth(`${API_URL}/filmes`),
          fetchWithAuth(`${API_URL}/filmes/assistidos`),
          fetchWithAuth(`${API_URL}/filmes/produtoras`)
        ]);
        setMovies(await moviesRes.json());
        setWatchedMovies(await watchedRes.json());
        setProducers(await producersRes.json());
      } catch (error) {
        console.error("Falha ao carregar dados iniciais:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Função para recarregar os dados após uma ação
  const refreshData = async () => {
     try {
        const [moviesRes, watchedRes] = await Promise.all([
          fetchWithAuth(`${API_URL}/filmes`),
          fetchWithAuth(`${API_URL}/filmes/assistidos`),
        ]);
        setMovies(await moviesRes.json());
        setWatchedMovies(await watchedRes.json());
      } catch (error) {
        console.error("Falha ao atualizar dados:", error);
      }
  };

  const handleAddMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    
    try {
      const res = await fetchWithAuth(`${API_URL}/filmes`, {
        method: 'POST',
        body: JSON.stringify({ titulo: title })
      });
      if (!res.ok) throw new Error(await res.text());
      await refreshData();
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Erro ao adicionar filme:", error);
      alert(`Erro: ${error.message}`);
    }
  };
  
  const handleDeleteMovie = async (id: number) => {
    if (!confirm(`Tem certeza que deseja deletar o filme com ID ${id}?`)) return;
    try {
      await fetchWithAuth(`${API_URL}/filmes/${id}`, { method: 'DELETE' });
      await refreshData();
    } catch (error) {
       console.error("Erro ao deletar:", error);
    }
  };
  
  const handleToggleWatched = async (id: number, isWatched: boolean) => {
    try {
      await fetchWithAuth(`${API_URL}/filmes/${id}/assistir`, { 
        method: isWatched ? 'DELETE' : 'POST' 
      });
      await refreshData();
    } catch (error) {
      console.error("Erro ao marcar como assistido:", error);
    }
  };

  return (
    // ALTERADO: className agora usa strings diretas
    <div className="movies-container page-transition">
      <div className="tabs-container">
        <button onClick={() => setActiveTab('catalogo')} className={activeTab === 'catalogo' ? 'active' : ''}>Catálogo</button>
        <button onClick={() => setActiveTab('assistidos')} className={activeTab === 'assistidos' ? 'active' : ''}>Assistidos</button>
        <button onClick={() => setActiveTab('gerenciar')} className={activeTab === 'gerenciar' ? 'active' : ''}>Adicionar</button>
      </div>

      <div className="tab-content">
        {/* ABA CATÁLOGO */}
        {activeTab === 'catalogo' && (
          <div className="movies-grid">
            {isLoading ? <p>Carregando filmes...</p> : movies.map(movie => (
              <div key={movie.id} className="movie-card hero-card">
                <img src={movie.posterUrl || '/placeholder.png'} alt={`Pôster de ${movie.titulo}`} />
                <h3 className="movie-title hero-label">{movie.titulo}</h3>
                <p className="movie-producer">{movie.produtora}</p>
                <div className="movie-rating">
                  {movie.avaliacaoTmdb.toFixed(1)} ⭐
                </div>
                <div className="card-actions">
                  <button className="btn-secondary" onClick={() => handleToggleWatched(movie.id, movie.assistido)}>
                    {movie.assistido ? <FaUndo/> : <FaCheck/>}
                  </button>
                  {movie.trailerUrl && <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="btn-cta"><FaYoutube /></a>}
                  <button className="delete-button" onClick={() => handleDeleteMovie(movie.id)}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABA ASSISTIDOS */}
        {activeTab === 'assistidos' && (
          <div className="card">
             <h2 className="cardTitle">Minha Lista de Assistidos</h2>
             <div className="tableContainer">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Produtora</th>
                      <th>Avaliação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchedMovies.length > 0 ? watchedMovies.map(movie => (
                      <tr key={movie.id}>
                        <td>{movie.titulo}</td>
                        <td>{movie.produtora}</td>
                        <td>{movie.avaliacaoTmdb.toFixed(1)} ⭐</td>
                      </tr>
                    )) : <tr><td colSpan={3}>Nenhum filme assistido ainda.</td></tr>}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {/* ABA GERENCIAR */}
        {activeTab === 'gerenciar' && (
          <div className="card">
            <h2 className="cardTitle">Adicionar Filme do TMDB</h2>
            <p>Digite o título para buscar e adicionar ao catálogo.</p>
            <form onSubmit={handleAddMovie} className="add-form">
              <input 
                type="text" 
                name="title" 
                className="searchInput" 
                placeholder="Ex: The Dark Knight" 
                required 
              />
              <button type="submit" className="btn-cta"><FaFilm/> Adicionar</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}