"use client";

import { FaTrash, FaYoutube, FaEye, FaUndo, FaStar } from 'react-icons/fa';
import { Movie } from '../../../types/movies';
import styles from './MovieCard.module.css';
import Image from 'next/image';

type MovieCardProps = {
  movie: Movie;
  onDelete: (id: number) => void;
  onToggleWatched: (id: number, isWatched: boolean) => void;
  onShowTrailer: (trailerUrl: string) => void;
};

export default function MovieCard({ movie, onDelete, onToggleWatched, onShowTrailer }: MovieCardProps) {
  return (
    <div className={styles.movieCard}>
      <div className={styles.posterContainer}>
        <Image src={movie.posterUrl || '/placeholder.png'} alt={`Pôster de ${movie.titulo}`} className={styles.posterImage} width={200} height={300} />
        <div className={styles.overlay}>
          <h3 className={styles.movieTitle}>{movie.titulo}</h3>
          <p className={styles.movieProducer}>{movie.produtora}</p>
        </div>
        <div className={styles.rating}>
          <span>{movie.avaliacaoTmdb.toFixed(1)}</span>
          <FaStar />
        </div>
        
        <div className={styles.cardActions}>
          <button 
            className={`${styles.actionButton} ${styles.watchButton}`} 
            onClick={() => onToggleWatched(movie.id, movie.assistido)}
          >
            {movie.assistido ? <FaUndo/> : <FaEye/>}
          </button>
          {movie.trailerUrl && (
            <button 
              className={`${styles.actionButton} ${styles.trailerButton}`} 
              onClick={() => {
                if (movie.trailerUrl) {
                  onShowTrailer(movie.trailerUrl);
                }
              }}
            >
              <FaYoutube />
            </button>
          )}
          <button 
            className={`${styles.actionButton} ${styles.deleteButton}`} 
            onClick={() => onDelete(movie.id)}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
}

