// src/components/hqs/HqSearchResults.tsx

"use client";
import { FaPlusCircle, FaFolderOpen } from "react-icons/fa";
import styles from './HqSearchResults.module.css';
import { ComicVineSearchResult } from '../../types/hqs';
import Image from 'next/image';

type HqSearchResultsProps = {
  results: ComicVineSearchResult[];
  onSelectResult: (item: ComicVineSearchResult) => void;
  onBackToSearch: () => void;
  view: 'search' | 'volume';
  isSearching: boolean;
  isLoadingVolume: boolean;
  searchQuery: string;
  volumeTitle: string | null;
  addingHqUrl: string | null;
};

export default function HqSearchResults({ 
  results, 
  onSelectResult, 
  onBackToSearch,
  view,
  isSearching,
  isLoadingVolume,
  searchQuery,
  volumeTitle,
  addingHqUrl 
}: HqSearchResultsProps) {

  const isLoading = isSearching || isLoadingVolume;

  // Não mostra nada se a busca for muito curta e não estivermos vendo um volume
  if (view === 'search' && !isSearching && searchQuery.length < 3) {
    return null;
  }

  // Estado de "nada encontrado"
  if (!isLoading && results.length === 0 && (searchQuery.length >= 3 || view === 'volume')) {
    return (
      <div className={styles.emptyState}>
        {view === 'search' ? (
          <h3>Nenhum resultado para {searchQuery}</h3>
        ) : (
          <h3>Nenhuma edição encontrada para {volumeTitle}</h3>
        )}
      </div>
    );
  }
  
  // Não mostra se não houver resultados e não estiver carregando
  if (results.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className={styles.resultsContainer}>
      {/* Cabeçalho com Título e Botão Voltar */}
      <div className={styles.header}>
        {view === 'volume' && (
          <button onClick={onBackToSearch} className={styles.backButton}>
            &larr; Voltar
          </button>
        )}
        <h3 className={styles.resultsTitle}>
          {view === 'search' ? `Resultados da Busca` : `Edições de "${volumeTitle}"`}
        </h3>
      </div>

      {/* Overlay de Loading */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {/* Grid de Resultados */}
      <div className={styles.resultsGrid}>
        {results.map((item) => {
          const isAdding = addingHqUrl === item.apiDetailUrl;
          const isIssue = item.resourceType === 'issue';
          const resourceType = view === 'volume' ? 'issue' : item.resourceType;

          return (
            <div 
              key={item.apiDetailUrl || `volume-${item.id}`} 
              className={`
                ${styles.resultCard} 
                ${resourceType === 'volume' ? styles.volumeCard : ''}
                ${isAdding ? styles.adding : ''}
              `}
              onClick={!isAdding ? () => onSelectResult(item) : undefined}
              title={resourceType === 'issue' ? "Clique para adicionar ao seu catálogo" : "Clique para ver edições"}
            >
              <Image 
                src={item.imageUrl || '/placeholder.png'} 
                alt={`Capa de ${item.title}`} 
                width={185} 
                height={278} 
                className={styles.resultImage}
              />
              <div className={styles.cardContent}>
                <p className={styles.hqVolumeName}>{item.volumeName}</p>
                <p className={styles.hqTitle}>{item.title}</p>
                <p className={styles.hqYear}>{item.year || 'N/A'}</p>
              </div>

              {/* Overlay de Adicionar (para issues) */}
              {resourceType === 'issue' && (
                <div className={styles.addOverlay}>
                  <FaPlusCircle />
                  <span>{isAdding ? 'Adicionando...' : 'Adicionar'}</span>
                </div>
              )}

              {/* Overlay de Ver (para volumes) */}
              {resourceType === 'volume' && (
                <div className={styles.viewOverlay}>
                  <FaFolderOpen />
                  <span>Ver Edições</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}