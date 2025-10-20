"use client";
import { FaPlusCircle } from "react-icons/fa";
import styles from './HqSearchResults.module.css';
import { ComicVineSearchResult } from '../../types/hqs';

type HqSearchResultsProps = {
  results: ComicVineSearchResult[];
  onAddHq: (apiDetailUrl: string) => void;
  isLoading: boolean;
  searchQuery: string;
  addingHqUrl: string | null;
};

export default function HqSearchResults({ results, onAddHq, isLoading, searchQuery, addingHqUrl }: HqSearchResultsProps) {
  if (!isLoading && searchQuery.length < 3) return null;

  if (!isLoading && results.length === 0 && searchQuery.length >= 3) {
    return <div className={styles.emptyState}><h3>Nenhum resultado para "{searchQuery}"</h3></div>;
  }
  
  if (results.length === 0 && !isLoading) return null;

  return (
    <div className={styles.resultsContainer}>
      {isLoading && <div className={styles.loadingOverlay}><div className={styles.spinner}></div></div>}
      <div className={styles.resultsGrid}>
        {results.map((item) => {
          const isAdding = addingHqUrl === item.apiDetailUrl;
          // Agora a lógica se baseia em ser uma 'issue' para ser clicável
          const isClickable = item.resourceType === 'issue'; 
          
          return (
            <div 
              key={item.apiDetailUrl} 
              className={`${styles.resultCard} ${!isClickable ? styles.disabled : ''} ${isAdding ? styles.adding : ''}`}
              onClick={isClickable && !isAdding ? () => onAddHq(item.apiDetailUrl) : undefined}
              title={!isClickable ? "Este é um volume. Apenas edições únicas podem ser adicionadas." : "Clique para adicionar ao seu catálogo"}
            >
              <img src={item.imageUrl || '/placeholder.png'} alt={`Capa de ${item.title}`} />
              <div className={styles.cardContent}>
                {/* Melhoria na exibição para dar mais contexto */}
                <p className={styles.hqVolumeName}>{item.volumeName}</p>
                <p className={styles.hqTitle}>{item.title}</p>
                <p className={styles.hqYear}>{item.year || 'N/A'}</p>
              </div>
              {isClickable && (
                <div className={styles.addOverlay}>
                  <FaPlusCircle />
                  <span>{isAdding ? 'Adicionando...' : 'Adicionar'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}