/**
 * Exemplos de como usar a nova estrutura de imports
 * 
 * @description Demonstra como usar os barrel files e a estrutura feature-based
 */

// ✅ ANTES: Imports diretos e espalhados
// import MovieCard from '../components/movies/MovieCard';
// import AddMovieForm from '../components/movies/AddMovieForm';
// import { useAudioManager } from '../hooks/useAudioManager';
// import { useUser } from '../hooks/useUser';

// ✅ DEPOIS: Imports centralizados e organizados

// 1. Imports de componentes genéricos (reutilizáveis)
import { 
  ModernFooter, 
  SpeechBubble
} from '@/components';

// 2. Imports de hooks globais
import { 
  useUser,
  useAudioManager
} from '@/hooks';

// 3. Imports de features específicas
import { 
  MovieCard,
  useMovieSearch 
} from '@/features/movies';

import { 
  HqCard
} from '@/features/hqs';

// 4. Imports de constantes centralizadas
import { 
  API_CONFIG, 
  UI_CONSTANTS
} from '@/constants';

/**
 * Exemplo de uso em um componente
 */
export const ExampleComponent = () => {
  // Usando hooks globais
  const { user, isLoggedIn } = useUser();
  const { playAudio, stopAllAudio } = useAudioManager();
  
  // Usando hooks específicos de features
  const { searchQuery, setSearchQuery, searchResults, isLoading } = useMovieSearch();
  
  // Usando constantes
  const apiUrl = API_CONFIG.BASE_URL;
  const maxResults = UI_CONSTANTS.MAX_SEARCH_RESULTS;
  
  // Usar as variáveis para evitar warnings
  console.log('User:', user, 'Logged in:', isLoggedIn);
  console.log('Audio functions:', playAudio, stopAllAudio);
  console.log('Search:', searchQuery, setSearchQuery, searchResults, isLoading);
  console.log('Config:', apiUrl, maxResults);
  
  return (
    <div>
      {/* Usando componentes genéricos */}
      <ModernFooter />
      <SpeechBubble type="electric">WOW!</SpeechBubble>
      
      {/* Usando componentes de features */}
      <MovieCard 
        movie={{
          id: 1,
          titulo: 'Example Movie',
          produtora: 'Example Studio',
          diretor: 'Example Director',
          posterUrl: 'https://example.com/poster.jpg',
          trailerUrl: 'https://example.com/trailer.mp4',
          avaliacaoTmdb: 8.5,
          assistido: false
        }}
        onDelete={() => {}}
        onToggleWatched={() => {}}
        onShowTrailer={() => {}}
      />
      
      <HqCard 
        hq={{
          id: 1,
          titulo: 'Example HQ',
          volumeName: 'Volume 1',
          editora: 'Example Publisher',
          coverUrl: 'https://example.com/cover.jpg',
          lido: false
        }}
        onToggleRead={() => {}}
      />
    </div>
  );
};

/**
 * Benefícios da nova estrutura:
 * 
 * 1. 🎯 Imports mais limpos e organizados
 * 2. 🔍 Fácil de encontrar componentes e hooks
 * 3. 🚀 Melhor tree-shaking (imports específicos)
 * 4. 🏗️ Estrutura escalável e manutenível
 * 5. 📦 Barrel files facilitam refatorações
 * 6. 🎨 Separação clara entre componentes genéricos e específicos
 */
