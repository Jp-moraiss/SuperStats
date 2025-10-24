/**
 * Barrel file para exportações de hooks
 * 
 * @description Centraliza todas as exportações de hooks,
 * facilitando imports e mantendo a API limpa.
 */

// Core Hooks
export { useUser } from './useUser';
export { useErrorHandler } from './useErrorHandler';
export { useLazyComponent } from './useLazyComponent';
export { usePerformanceOptimization } from './usePerformanceOptimization';

// Audio & Media Hooks
export { useAudioManager } from './useAudioManager';
export type { AudioRefs } from './useAudioManager';

// Game & Interaction Hooks
export { useVillainInvasion } from './useVillainInvasion';
export { useJusticeLeagueEasterEgg } from './useJusticeLeagueEasterEgg';

// Page-specific Hooks
export { useHomeLogic } from './useHomeLogic';
