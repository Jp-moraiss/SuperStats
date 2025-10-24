/**
 * Constantes centralizadas da aplicação
 * 
 * @description Centraliza todas as constantes da aplicação,
 * evitando magic numbers e strings espalhadas pelo código.
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  CACHE_DURATION: 3600, // 1 hora em segundos
  TIMEOUT: 10000, // 10 segundos
} as const;

// UI Constants
export const UI_CONSTANTS = {
  MAX_SEARCH_RESULTS: 10,
  ITEMS_PER_PAGE: 50,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  ANIMATION_DURATION: 300,
} as const;

// Audio Configuration
export const AUDIO_CONFIG = {
  HERO_AUDIO_IDS: [
    'batman', 'spiderman', 'superman', 'avengers', 'ironman', 
    'captainamerica', 'blackpanther', 'deadpool', 'flash', 
    'wonderwoman', 'greenlantern', 'justiceleague', 'justiceLeagueSpecial'
  ] as const,
  
  VILLAIN_AUDIO_IDS: [
    'joker', 'harleyquinn', 'lexluthor', 'bane', 'darkseid', 
    'suicidesquad', 'thanos', 'doom', 'greengoblin', 'loki', 
    'redskull', 'ultron', 'villainLaugh', 'thanosSnap'
  ] as const,
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  DEFAULT: 'light',
} as const;

// Character Alignment
export const ALIGNMENT = {
  GOOD: 'good',
  BAD: 'bad',
  NEUTRAL: 'neutral',
} as const;

// Publisher Constants
export const PUBLISHER = {
  MARVEL: 'Marvel Comics',
  DC: 'DC Comics',
} as const;

// Affiliation Constants
export const AFFILIATION = {
  ALL: 'all',
  MARVEL: 'marvel',
  DC: 'dc',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'superstats_user_preferences',
  THEME: 'superstats_theme',
  FILTERS: 'superstats_filters',
  UI_STATE: 'superstats_ui_state',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  NOT_FOUND: 'Recurso não encontrado.',
  UNAUTHORIZED: 'Acesso não autorizado.',
  GENERIC: 'Algo deu errado. Tente novamente.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  MOVIE_ADDED: 'Filme adicionado com sucesso!',
  MOVIE_DELETED: 'Filme deletado com sucesso!',
  MOVIE_UPDATED: 'Status atualizado com sucesso!',
  HQ_ADDED: 'HQ adicionada com sucesso!',
  HQ_DELETED: 'HQ deletada com sucesso!',
  HQ_UPDATED: 'Status atualizado com sucesso!',
  CHARACTER_ADDED: 'Personagem adicionado com sucesso!',
} as const;

// Performance Constants
export const PERFORMANCE_CONFIG = {
  VIRTUAL_SCROLL_THRESHOLD: 100,
  LAZY_LOAD_THRESHOLD: 0.1,
  PRELOAD_MARGIN: '50px',
  DEBOUNCE_SEARCH: 300,
  THROTTLE_SCROLL: 100,
} as const;

