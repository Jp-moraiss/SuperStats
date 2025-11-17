"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import styles from './MoviesPage.module.css';
import { debounce } from 'lodash';
import { FaFilm, FaCheckCircle, FaStar, FaPlus, FaEye } from 'react-icons/fa';

// Componentes
import MovieCard from "../../components/movies/MovieCard";
import AddMovieForm from "../../components/movies/AddMovieForm";
import SearchResults from "../../components/movies/SearchResults";
import TrailerModal from "../../components/movies/TrailerModal";

// Tipos
import { Movie, TmdbMovie, MovieWithCount } from "../../types/movies";

// Serviços centralizados
import { ApiService, API_ENDPOINTS } from "../../shared";



export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<MovieWithCount[]>([]);
  const [activeTab, setActiveTab] = useState('catalogo');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TmdbMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingMovieId, setAddingMovieId] = useState<number | null>(null);

  // <-- NOVO: Estado para o filtro do catálogo
  const [filterQuery, setFilterQuery] = useState('');

  const isFirstRender = useRef(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  // Refresh automático quando muda de aba (mas não na primeira renderização)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (activeTab) {
      loadInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [moviesRes, watchedRes, popularityRes] = await Promise.all([
        ApiService.get(API_ENDPOINTS.MOVIES),
        ApiService.get(API_ENDPOINTS.MOVIES_WATCHED),
        ApiService.get(API_ENDPOINTS.MOVIES_POPULARITY),
      ]);
      setMovies(await moviesRes.json());
      setWatchedMovies(await watchedRes.json());
      setPopularMovies(await popularityRes.json());
    } catch (error) {
      console.error("Falha ao carregar dados iniciais:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPopularMovies = async () => {
    try {
      const res = await ApiService.get(API_ENDPOINTS.MOVIES_POPULARITY);
      setPopularMovies(await res.json());
    } catch (error) {
      console.error("Erro ao buscar filmes populares:", error);
    }
  };
  
  // A lógica de fetchSuggestions, handleAddMovie, handleDeleteMovie, etc., permanece a mesma...
  const fetchSuggestions = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 3) {
          setSearchResults([]);
          return;
        }
        setIsSearching(true);
        try {
          const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
          const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
            query
          )}&language=pt-BR`;
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
      await ApiService.post(API_ENDPOINTS.MOVIES, { tmdbId: tmdbId });
      await loadInitialData();
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
    const originalPopularMovies = [...popularMovies];

    setMovies(prev => prev.filter(m => m.id !== id));
    setWatchedMovies(prev => prev.filter(m => m.id !== id));
    setPopularMovies(prev => prev.filter(item => item.filme.id !== id));

    try {
      await ApiService.delete(`${API_ENDPOINTS.MOVIES}/${id}`);
      // Atualizar filmes populares após deletar
      await fetchPopularMovies();
    } catch (error) {
       console.error("Erro ao deletar:", error);
       alert("Não foi possível deletar o filme. Tente novamente.");
       setMovies(originalMovies);
       setWatchedMovies(originalWatchedMovies);
       setPopularMovies(originalPopularMovies);
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
      await ApiService.post(API_ENDPOINTS.MOVIES_TOGGLE_WATCHED(id));
      // Atualizar filmes populares após mudança
      await fetchPopularMovies();
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

  // <-- NOVO: Lógica para filtrar os filmes do catálogo
  const filteredMovies = useMemo(() => {
    if (!filterQuery) {
      return movies;
    }
    const lowercasedFilter = filterQuery.toLowerCase();
    return movies.filter(movie => 
      movie.titulo.toLowerCase().includes(lowercasedFilter) ||
      movie.produtora.toLowerCase().includes(lowercasedFilter) ||
      movie.diretor.toLowerCase().includes(lowercasedFilter)
    );
  }, [movies, filterQuery]);


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Carregando filmes...</p>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'catalogo':
        return (
          <>
            {/* <-- NOVO: Campo de input para o filtro --> */}
            <div className={styles.filterContainer}>
                <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Filtrar por título, diretor, produtora..."
                    className={styles.filterInput}
                />
            </div>
            {/* <-- ALTERADO: Usa filteredMovies em vez de movies --> */}
            <div className={styles.moviesGrid}>
              {filteredMovies.map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie}
                  onDelete={handleDeleteMovie}
                  onToggleWatched={handleToggleWatched}
                  onShowTrailer={openTrailerModal}
                />
              ))}
            </div>
            {/* <-- NOVO: Mensagem para quando não há resultados --> */}
            {filteredMovies.length === 0 && !isLoading && (
                <p className={styles.noResults}>Nenhum filme encontrado com o filtro atual.</p>
            )}
          </>
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
      case 'popularidade':
        return (
          <div className={styles.popularidadeSection}>
            <div className={styles.popularidadeHeader}>
              <div className={styles.headerContent}>
                <h2 className={styles.sectionTitle}>Filmes Mais Assistidos</h2>
                <p className={styles.sectionDescription}>
                  Descubra os filmes mais populares entre os membros da comunidade. 
                  Veja quais produções estão fazendo sucesso e inspire-se para sua próxima sessão!
                </p>
              </div>
              <div className={styles.statsBadge}>
                <span className={styles.statsNumber}>{popularMovies.length}</span>
                <span className={styles.statsLabel}>Filmes no Ranking</span>
              </div>
            </div>
            {popularMovies.length === 0 ? (
              <p className={styles.noResults}>Nenhum filme foi assistido ainda para gerar um ranking.</p>
            ) : (
              <div className={styles.moviesGrid}>
                {popularMovies.map(item => (
                  <div key={item.filme.id} className={styles.popularMovieCard}>
                    <MovieCard 
                      movie={item.filme}
                      onShowTrailer={openTrailerModal}
                      showDelete={false}
                      showWatch={false}
                      showTrailer={true}
                    />
                    <div className={styles.popularityBadge}>
                      <span className={styles.popularityCount}>
                        <FaEye /> {item.totalAssistido}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
        <button onClick={() => setActiveTab('catalogo')} className={activeTab === 'catalogo' ? styles.active : ''}>
          <FaFilm /> Catálogo
        </button>
        <button onClick={() => setActiveTab('assistidos')} className={activeTab === 'assistidos' ? styles.active : ''}>
          <FaCheckCircle /> Meus Assistidos
        </button>
        <button onClick={() => setActiveTab('popularidade')} className={activeTab === 'popularidade' ? styles.active : ''}>
          <FaStar /> Populares
        </button>
        <button onClick={() => setActiveTab('gerenciar')} className={activeTab === 'gerenciar' ? styles.active : ''}>
          <FaPlus /> Adicionar Filme
        </button>
      </div>

      <div className={styles.tabContent}>
        {renderContent()}
      </div>
    </div>
  );
}