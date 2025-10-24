/**
 * Barrel file para exportações compartilhadas
 * 
 * @description Centraliza todas as exportações do módulo shared,
 * facilitando imports e mantendo a API limpa.
 */

// Services
export { ApiService, API_ENDPOINTS } from './services/api';
export type { ApiResponse } from './services/api';

// Utils
export { formatDate, formatTableDate, isValidDate } from './utils/dateUtils';
