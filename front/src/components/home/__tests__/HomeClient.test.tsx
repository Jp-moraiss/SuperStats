import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock todos os módulos antes de importar HomeClient
jest.mock('../../../hooks/useUser', () => ({
  useUser: () => ({
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    logout: jest.fn()
  })
}));

jest.mock('../../../hooks/useAudioManager', () => ({
  useAudioManager: () => ({
    audioRefs: {},
    playAudio: jest.fn(),
    stopAllAudio: jest.fn(),
    getAudioRef: jest.fn()
  })
}));

jest.mock('../../../hooks/useVillainInvasion', () => ({
  useVillainInvasion: () => ({
    villainInvasion: false,
    showVillains: false,
    setShowVillains: jest.fn()
  })
}));

jest.mock('../../../hooks/useJusticeLeagueEasterEgg', () => ({
  useJusticeLeagueEasterEgg: () => ({
    handleJusticeLeagueClick: jest.fn(),
    resetJusticeLeagueCount: jest.fn()
  })
}));
jest.mock('../../ui/SpeechBubble');
jest.mock('../../ui/HeroVideoOverlay');
jest.mock('../HeroGrid');
jest.mock('../VillainInvasionOverlay');
jest.mock('../AudioElements');

// Mock dos dados
jest.mock('../../../data/heroes', () => ({
  heroesData: [],
  filterHeroesByAffiliation: () => [],
  getVillainsByAffiliation: () => [],
  filterHeroesOnly: () => []
}));

// Mock dos utilitários
jest.mock('../../../utils/heroUtils', () => ({
  getAudioRefId: () => 'test',
  getSpeechBubbleText: () => 'Test',
  filterHeroesOnly: () => []
}));

// Import HomeClient após todos os mocks
import HomeClient from '../HomeClient';

describe('HomeClient', () => {
  it('renders hero section for non-logged in users', () => {
    render(<HomeClient />);
    
    expect(screen.getByText('Bem-vindo ao')).toBeInTheDocument();
    expect(screen.getByText('SuperStats!')).toBeInTheDocument();
    expect(screen.getByText('Explorar Agora')).toBeInTheDocument();
    expect(screen.getByText('Comparar Stats')).toBeInTheDocument();
  });

  it('does not show CTA section for non-logged in users', () => {
    render(<HomeClient />);
    
    expect(screen.queryByText('Participe da Pesquisa!')).not.toBeInTheDocument();
  });

  it('renders hero section content', () => {
    render(<HomeClient />);
    
    expect(screen.getByText('portal de fãs')).toBeInTheDocument();
    expect(screen.getByText('Heróis')).toBeInTheDocument();
    expect(screen.getByText('Vilões')).toBeInTheDocument();
  });
});
