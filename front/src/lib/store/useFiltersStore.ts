import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface FiltersState {
  // Filtros de personagens
  characterAlignment: string;
  characterPublisher: string;
  characterSearch: string;
  
  // Filtros de filmes
  movieYear: string;
  movieRating: string;
  movieWatched: boolean | null;
  
  // Filtros de HQs
  hqPublisher: string;
  hqRead: boolean | null;
  
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  setCharacterAlignment: (alignment: string) => void;
  setCharacterPublisher: (publisher: string) => void;
  setCharacterSearch: (search: string) => void;
  
  setMovieYear: (year: string) => void;
  setMovieRating: (rating: string) => void;
  setMovieWatched: (watched: boolean | null) => void;
  
  setHqPublisher: (publisher: string) => void;
  setHqRead: (read: boolean | null) => void;
  
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  resetFilters: () => void;
  resetCharacterFilters: () => void;
  resetMovieFilters: () => void;
  resetHqFilters: () => void;
}

const initialState = {
  characterAlignment: '',
  characterPublisher: '',
  characterSearch: '',
  movieYear: '',
  movieRating: '',
  movieWatched: null,
  hqPublisher: '',
  hqRead: null,
  sidebarOpen: false,
  theme: 'light' as const,
};

export const useFiltersStore = create<FiltersState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        // Character filters
        setCharacterAlignment: (alignment) => 
          set({ characterAlignment: alignment }, false, 'setCharacterAlignment'),
        
        setCharacterPublisher: (publisher) => 
          set({ characterPublisher: publisher }, false, 'setCharacterPublisher'),
        
        setCharacterSearch: (search) => 
          set({ characterSearch: search }, false, 'setCharacterSearch'),
        
        // Movie filters
        setMovieYear: (year) => 
          set({ movieYear: year }, false, 'setMovieYear'),
        
        setMovieRating: (rating) => 
          set({ movieRating: rating }, false, 'setMovieRating'),
        
        setMovieWatched: (watched) => 
          set({ movieWatched: watched }, false, 'setMovieWatched'),
        
        // HQ filters
        setHqPublisher: (publisher) => 
          set({ hqPublisher: publisher }, false, 'setHqPublisher'),
        
        setHqRead: (read) => 
          set({ hqRead: read }, false, 'setHqRead'),
        
        // UI state
        setSidebarOpen: (open) => 
          set({ sidebarOpen: open }, false, 'setSidebarOpen'),
        
        setTheme: (theme) => 
          set({ theme }, false, 'setTheme'),
        
        // Reset functions
        resetFilters: () => 
          set(initialState, false, 'resetFilters'),
        
        resetCharacterFilters: () => 
          set({ 
            characterAlignment: '', 
            characterPublisher: '', 
            characterSearch: '' 
          }, false, 'resetCharacterFilters'),
        
        resetMovieFilters: () => 
          set({ 
            movieYear: '', 
            movieRating: '', 
            movieWatched: null 
          }, false, 'resetMovieFilters'),
        
        resetHqFilters: () => 
          set({ 
            hqPublisher: '', 
            hqRead: null 
          }, false, 'resetHqFilters'),
      }),
      {
        name: 'filters-store',
        partialize: (state) => ({
          characterAlignment: state.characterAlignment,
          characterPublisher: state.characterPublisher,
          characterSearch: state.characterSearch,
          movieYear: state.movieYear,
          movieRating: state.movieRating,
          movieWatched: state.movieWatched,
          hqPublisher: state.hqPublisher,
          hqRead: state.hqRead,
          theme: state.theme,
        }),
      }
    ),
    {
      name: 'filters-store',
    }
  )
);
