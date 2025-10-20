// src/components/movies/AddMovieForm.tsx
"use client";

import { FaSearch } from 'react-icons/fa';
import styles from './AddMovieForm.module.css';

type AddMovieFormProps = {
  query: string;
  onQueryChange: (query: string) => void;
  isLoading: boolean;
};

export default function AddMovieForm({ query, onQueryChange, isLoading }: AddMovieFormProps) {
  return (
    <div className={`card ${styles.addFormContainer}`}>
      <h2 className="cardTitle">Adicionar Filme</h2>
      
      <div className={styles.searchWrapper}>
        <div className={styles.searchInputContainer}>
          <FaSearch className={styles.searchIcon} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className={styles.searchInput}
            placeholder="Ex: Spider-Man, Batman..."
            autoComplete="off"
          />
          {isLoading && <div className={styles.spinner}></div>}
        </div>
      </div>
    </div>
  );
}