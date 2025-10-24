import { renderHook, act } from '@testing-library/react';
import { useHomeLogic } from '../useHomeLogic';

// Mock dos hooks dependentes
jest.mock('../useUser', () => ({
  useUser: () => ({
    user: { univ_fav: 'marvel' },
    isLoggedIn: true,
    loading: false,
    error: null,
    logout: jest.fn()
  })
}));

jest.mock('../useAudioManager', () => ({
  useAudioManager: () => ({
    audioRefs: { batman: { current: null } },
    playAudio: jest.fn().mockResolvedValue(true),
    stopAllAudio: jest.fn(),
    getAudioRef: jest.fn()
  })
}));

jest.mock('../useVillainInvasion', () => ({
  useVillainInvasion: () => ({
    villainInvasion: false,
    showVillains: false,
    setShowVillains: jest.fn()
  })
}));

jest.mock('../useJusticeLeagueEasterEgg', () => ({
  useJusticeLeagueEasterEgg: () => ({
    handleJusticeLeagueClick: jest.fn().mockResolvedValue(false),
    resetJusticeLeagueCount: jest.fn()
  })
}));

// Mock dos dados e utilitários
jest.mock('../../data/heroes', () => ({
  heroesData: [
    { id: 'batman', nome: 'Batman', afiliacao: 'dc' },
    { id: 'spiderman', nome: 'Spider-Man', afiliacao: 'marvel' }
  ],
  filterHeroesByAffiliation: jest.fn((heroes, affiliation) => 
    affiliation === 'all' ? heroes : heroes.filter(h => h.afiliacao === affiliation)
  ),
  getVillainsByAffiliation: jest.fn(() => []),
  filterHeroesOnly: jest.fn((heroes) => heroes)
}));

jest.mock('../../utils/heroUtils', () => ({
  getAudioRefId: jest.fn((id) => id),
  getSpeechBubbleText: jest.fn((affiliation) => 
    affiliation === 'marvel' ? 'Avante, Vingadores!' : 'Clique nos heróis!'
  ),
  filterHeroesOnly: jest.fn((heroes) => heroes)
}));

describe('useHomeLogic', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useHomeLogic());
    
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.activeHero).toBeNull();
    expect(result.current.selectedAffiliation).toBe('marvel');
    expect(result.current.filteredHeroes).toBeDefined();
    expect(result.current.filteredVillains).toEqual([]);
    expect(result.current.showVillains).toBe(false);
    expect(result.current.speechBubbleText).toBe('Avante, Vingadores!');
    expect(result.current.audioRefs).toBeDefined();
    expect(result.current.villainInvasion).toBe(false);
  });

  it('should handle hero click correctly', async () => {
    const { result } = renderHook(() => useHomeLogic());
    
    const mockHero = { id: 'batman', nome: 'Batman' };
    
    await act(async () => {
      await result.current.handleHeroClick(mockHero);
    });
    
    expect(result.current.activeHero).toBe('batman');
  });

  it('should handle close video correctly', () => {
    const { result } = renderHook(() => useHomeLogic());
    
    // Primeiro define um herói ativo
    act(() => {
      result.current.setActiveHero('batman');
    });
    
    expect(result.current.activeHero).toBe('batman');
    
    // Depois fecha o vídeo
    act(() => {
      result.current.handleCloseVideo();
    });
    
    expect(result.current.activeHero).toBeNull();
  });

  it('should filter heroes by affiliation', () => {
    const { result } = renderHook(() => useHomeLogic());
    
    expect(result.current.filteredHeroes).toBeDefined();
    expect(Array.isArray(result.current.filteredHeroes)).toBe(true);
  });

  it('should provide all required handlers', () => {
    const { result } = renderHook(() => useHomeLogic());
    
    expect(typeof result.current.handleHeroClick).toBe('function');
    expect(typeof result.current.handleCloseVideo).toBe('function');
    expect(typeof result.current.setActiveHero).toBe('function');
    expect(typeof result.current.setSelectedAffiliation).toBe('function');
  });

  it('should handle speech bubble text based on affiliation', () => {
    const { result } = renderHook(() => useHomeLogic());
    
    // Testa mudança de afiliação
    act(() => {
      result.current.setSelectedAffiliation('marvel');
    });
    
    // O texto deve ser atualizado baseado na nova afiliação
    expect(result.current.speechBubbleText).toBeDefined();
  });
});

