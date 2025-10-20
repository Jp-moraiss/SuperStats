"use client";
import { FaSearch } from 'react-icons/fa';
import styles from './AddHqForm.module.css';

type AddHqFormProps = {
  query: string;
  onQueryChange: (query: string) => void;
  isLoading: boolean;
};

export default function AddHqForm({ query, onQueryChange, isLoading }: AddHqFormProps) {
  return (
    <div className={`card ${styles.addFormContainer}`}>
      <h2 className="cardTitle">Adicionar Nova HQ</h2>
      <p>Busque na Comic Vine pelo título original (em inglês).</p>
      <div className={styles.searchWrapper}>
        <div className={styles.searchInputContainer}>
          <FaSearch className={styles.searchIcon} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className={styles.searchInput}
            placeholder="Ex: The Killing Joke, Batman Year One..."
            autoComplete="off"
          />
          {isLoading && <div className={styles.spinner}></div>}
        </div>
      </div>
    </div>
  );
}