/**
 * Barrel file para a feature Movies
 * 
 * @description Centraliza todas as exportações da feature Movies,
 * facilitando imports e mantendo a API limpa.
 */

// Components
export { default as MovieCard } from './components/MovieCard';
export { default as AddMovieForm } from './components/AddMovieForm';
export { default as SearchResults } from './components/SearchResults';
export { default as TrailerModal } from './components/TrailerModal';

// Hooks
export { useMovieSearch } from './hooks/useMovieSearch';
// export { useMovieFilters } from './hooks/useMovieFilters';

// Types (to be moved from global types)
// export type { Movie, MovieFilters } from './types';

// Utils (to be implemented)
// export { formatMovieDate, validateMovieData } from './utils';
