/**
 * Barrel file para exportações de componentes
 * 
 * @description Centraliza todas as exportações de componentes,
 * facilitando imports e mantendo a API limpa.
 */

// UI Components - Componentes reutilizáveis
export { default as ComicButton } from './ui/ComicButton';
export { default as HeroVideoOverlay } from './ui/HeroVideoOverlay';
export { default as ModernFooter } from './ui/ModernFooter';
export { default as SpeechBubble } from './ui/SpeechBubble';
export { LoadingSpinner } from './ui/LoadingSpinner';
export { Card } from './ui/Card';
export { Button } from './ui/Button';
export { ChartSkeleton } from './ui/ChartSkeleton';
export { TableSkeleton } from './ui/TableSkeleton';

// Layout Components
export { default as ClientLayout } from './layout/ClientLayout';

// Optimized Components
export { OptimizedImage } from './optimized/OptimizedImage';

// Lazy Components
export { default as GraficosContent } from './lazy/GraficosContent';
export { default as GraficosLazy } from './lazy/GraficosLazy';
export { LazyPowerRadarChart, LazyAlignmentChart, LazyPublisherChart } from './lazy/LazyCharts';
export { LazyTrailerModal, LazyHeroVideoOverlay } from './lazy/LazyModals';
export { LazyCharacterTable } from './lazy/LazyTables';

// Chart Components
export { default as AlignmentChart } from './charts/AlignmentChart';
export { default as AlterEgoChart } from './charts/AlterEgoChart';
export { default as ComparisonRadarChart } from './charts/ComparisonRadarChart';
export { default as PhysicalStatsCharts } from './charts/PhysicalStatsCharts';
export { default as PowerDistributionChart } from './charts/PowerDistributionChart';
export { default as PowerRadarChart } from './charts/PowerRadarChart';
export { default as PublisherChart } from './charts/PublisherChart';

// Feature-specific components will be moved to features/ directory
// These exports will be updated after restructuring
