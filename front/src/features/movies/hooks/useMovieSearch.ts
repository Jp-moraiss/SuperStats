"use client";

import { useState, useCallback, useMemo } from 'react';
import { TmdbMovie } from '../../../types/movies';
import { API_CONFIG, UI_CONSTANTS } from '../../../constants';

interface UseMovieSearchProps {
  debounceDelay?: number;
}

interface UseMovieSearchReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: TmdbMovie[];
  isLoading: boolean;
  error: string | null;
  searchMovies: (query: string) => Promise<void>;
  clearSearch: () => void;
}

/**
 * Hook customizado para busca de filmes na TMDB
 * 
 * @param debounceDelay - Delay para debounce da busca (padrão: 300ms)
 * @returns Objeto com estado e funções para busca de filmes
 */
export const useMovieSearch = ({ 
  debounceDelay = UI_CONSTANTS.DEBOUNCE_DELAY 
}: UseMovieSearchProps = {}): UseMovieSearchReturn => {
  // TODO: Implementar debounce com o debounceDelay
  console.log('Debounce delay configurado:', debounceDelay);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TmdbMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca filmes na TMDB
   */
  const searchMovies = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/movies/search?query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Falha na busca de filmes');
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Limpa a busca atual
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
  }, []);

  // Memoizar resultados para evitar re-renderizações desnecessárias
  const memoizedResults = useMemo(() => searchResults, [searchResults]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults: memoizedResults,
    isLoading,
    error,
    searchMovies,
    clearSearch,
  };
};