import { FaTrash, FaYoutube, FaCheck, FaUndo } from 'react-icons/fa';
import { Movie } from '../../app/filmes/page'; // Importando o tipo
import styles from './MovieCard.module.css';

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
        <img src={movie.posterUrl || '/placeholder.png'} alt={`Pôster de ${movie.titulo}`} className={styles.posterImage} />
        <div className={styles.overlay}>
          <h3 className={styles.movieTitle}>{movie.titulo}</h3>
          <p className={styles.movieProducer}>{movie.produtora}</p>
        </div>
        <div className={styles.rating}>
            {movie.avaliacaoTmdb.toFixed(1)} ⭐
        </div>
      </div>
      <div className={styles.cardActions}>
        <button 
            className={`${styles.actionButton} ${styles.watchButton}`} 
            onClick={() => onToggleWatched(movie.id, movie.assistido)}
            aria-label={movie.assistido ? "Marcar como não assistido" : "Marcar como assistido"}
        >
          {movie.assistido ? <FaUndo/> : <FaCheck/>}
        </button>
        {movie.trailerUrl && (
          <button 
            className={`${styles.actionButton} ${styles.trailerButton}`} 
            onClick={() => onShowTrailer(movie.trailerUrl)}
            aria-label="Assistir trailer"
          >
            <FaYoutube />
          </button>
        )}
        <button 
            className={`${styles.actionButton} ${styles.deleteButton}`} 
            onClick={() => onDelete(movie.id)}
            aria-label="Deletar filme"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}