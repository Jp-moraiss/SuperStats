"use client";

import { FaFilm } from "react-icons/fa";
import styles from './SearchResults.module.css';
import { TmdbMovie } from "../../../types/movies";
import Image from "next/image";

type SearchResultsProps = {
  results: TmdbMovie[];
  onAddMovie: (title: string, tmdbId: number) => void;
  isLoading: boolean;
  searchQuery: string;
  addingMovieId: number | null;
};

export default function SearchResults({ results, onAddMovie, isLoading, searchQuery, addingMovieId }: SearchResultsProps) {
  
  if (!isLoading && searchQuery.length < 3) {
    return null;
  }

  if (!isLoading && results.length === 0 && searchQuery.length >= 3) {
    return (
      <div className={styles.emptyState}>
        <h3>Nenhum resultado encontrado para {searchQuery}</h3>
      </div>
    );
  }

  // Previne que a área de resultados "pisque" enquanto carrega
  if (results.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className={styles.resultsContainer}>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}
      <div className={styles.resultsGrid}>
        {results.map((movie) => {
          const isAdding = addingMovieId === movie.id;
          return (
            <div key={movie.id} className={`${styles.resultCard} ${isAdding ? styles.disabled : ''}`}>
              <Image 
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w185${movie.poster_path}` : '/placeholder.png'} 
                alt={`Pôster de ${movie.title}`}
                width={185}
                height={278}
              />
              <div className={styles.cardContent}>
                <p className={styles.movieTitle}>{movie.title}</p>
                <p className={styles.movieYear}>{movie.release_date?.split('-')[0]}</p>
                <button 
                  className="btn-cta"
                  onClick={() => onAddMovie(movie.title, movie.id)}
                  disabled={isAdding}
                >
                  <FaFilm/> {isAdding ? 'Adicionando...' : 'Adicionar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

