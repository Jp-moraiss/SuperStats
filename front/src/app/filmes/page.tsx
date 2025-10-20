"use client";
import { useState, useEffect, useCallback } from "react";
import styles from './MoviesPage.module.css';
import { debounce } from 'lodash';

// Componentes
import MovieCard from "../../components/movies/MovieCard";
import AddMovieForm from "../../components/movies/AddMovieForm";
import TrailerModal from "../../components/movies/TrailerModal";
import SearchResults from "../../components/movies/SearchResults";

// Tipos
import { Movie, TmdbMovie } from "../../types/movies";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('jwtToken');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('jwtToken');
    window.location.href = '/login';
    throw new Error('Sessão expirada ou não autorizada. Redirecionando para login...');
  }

  if (!response.ok) {
    const errorText = await response.text();
    // detecta se o backend mandou um erro de token expirado
    if (errorText.includes("JWT expired")) {
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    throw new Error(`Erro na requisição: ${response.statusText || response.status} - ${errorText}`);
  }

  return response;
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState('catalogo');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TmdbMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingMovieId, setAddingMovieId] = useState<number | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [moviesRes, watchedRes] = await Promise.all([
        fetchWithAuth(`${API_URL}/filmes`),
        fetchWithAuth(`${API_URL}/filmes/assistidos`),
      ]);
      setMovies(await moviesRes.json());
      setWatchedMovies(await watchedRes.json());
    } catch (error) {
      console.error("Falha ao carregar dados iniciais:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR`;
        const response = await fetch(url);
        const data = await response.json();
        setSearchResults(data.results ?? []);
      } catch (error) {
        console.error("Erro ao buscar sugestões no TMDB:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchSuggestions(searchQuery);
  }, [searchQuery, fetchSuggestions]);

  const handleAddMovie = async (title: string, tmdbId: number) => {
    setAddingMovieId(tmdbId);
    try {
      await fetchWithAuth(`${API_URL}/filmes`, {
        method: 'POST',
        body: JSON.stringify({ titulo: title })
      });
      await loadInitialData(); // Recarrega tudo após adicionar um novo para obter o ID correto do DB
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error("Erro ao adicionar filme:", error);
      alert(`Erro: ${error instanceof Error ? error.message : 'Ocorreu um problema'}`);
    } finally {
      setAddingMovieId(null);
    }
  };

  const handleDeleteMovie = async (id: number) => {
    if (!confirm(`Tem certeza que deseja deletar o filme?`)) return;

    const originalMovies = [...movies];
    const originalWatchedMovies = [...watchedMovies];

    setMovies(prev => prev.filter(m => m.id !== id));
    setWatchedMovies(prev => prev.filter(m => m.id !== id));

    try {
      await fetchWithAuth(`${API_URL}/filmes/${id}`, { method: 'DELETE' });
    } catch (error) {
       console.error("Erro ao deletar:", error);
       alert("Não foi possível deletar o filme. Tente novamente.");
       setMovies(originalMovies);
       setWatchedMovies(originalWatchedMovies);
    }
  };
  
  const handleToggleWatched = async (id: number, isWatched: boolean) => {
    const originalMovies = [...movies];
    const originalWatchedMovies = [...watchedMovies];

    const updatedMovies = movies.map(movie => 
      movie.id === id ? { ...movie, assistido: !isWatched } : movie
    );
    setMovies(updatedMovies);

    if (!isWatched) {
      const movieToAdd = movies.find(m => m.id === id);
      if(movieToAdd) setWatchedMovies(prev => [...prev, {...movieToAdd, assistido: true}].sort((a,b) => a.titulo.localeCompare(b.titulo)));
    } else {
      setWatchedMovies(prev => prev.filter(m => m.id !== id));
    }

    try {
      await fetchWithAuth(`${API_URL}/filmes/${id}/assistir`, { 
        method: isWatched ? 'DELETE' : 'POST' 
      });
    } catch (error) {
      console.error("Erro ao marcar como assistido:", error);
      alert("Não foi possível alterar o status do filme. Tente novamente.");
      setMovies(originalMovies);
      setWatchedMovies(originalWatchedMovies);
    }
  };

  const openTrailerModal = (trailerUrl: string) => {
    const videoId = new URL(trailerUrl).searchParams.get('v');
    if (videoId) {
      setSelectedTrailer(`https://www.youtube.com/embed/${videoId}`);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className={styles.loadingSpinner}></div>;
    }
    
    switch (activeTab) {
      case 'catalogo':
        return (
          <div className={styles.moviesGrid}>
            {movies.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                onDelete={handleDeleteMovie}
                onToggleWatched={handleToggleWatched}
                onShowTrailer={openTrailerModal}
              />
            ))}
          </div>
        );
      case 'assistidos':
        return (
          <div className="card">
             <h2 className="cardTitle">Minha Lista de Assistidos</h2>
              <div className="tableContainer">
                <table className="table">
                  <thead><tr><th>Título</th><th>Produtora</th><th>Avaliação</th></tr></thead>
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
        );
      case 'gerenciar':
        return (
          <>
            <AddMovieForm 
              query={searchQuery}
              onQueryChange={setSearchQuery}
              isLoading={isSearching}
            />
            <SearchResults 
              results={searchResults}
              onAddMovie={handleAddMovie}
              isLoading={isSearching}
              searchQuery={searchQuery}
              addingMovieId={addingMovieId}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.moviesContainer}>
      {selectedTrailer && <TrailerModal trailerUrl={selectedTrailer} onClose={() => setSelectedTrailer(null)} />}
      
      <div className={styles.tabsContainer}>
        <button onClick={() => setActiveTab('catalogo')} className={activeTab === 'catalogo' ? styles.active : ''}>Catálogo</button>
        <button onClick={() => setActiveTab('assistidos')} className={activeTab === 'assistidos' ? styles.active : ''}>Assistidos</button>
        <button onClick={() => setActiveTab('gerenciar')} className={activeTab === 'gerenciar' ? styles.active : ''}>Adicionar</button>
      </div>

      <div className={styles.tabContent}>
        {renderContent()}
      </div>
    </div>
  );
}