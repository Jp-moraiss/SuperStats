import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock todos os módulos antes de importar HomePage
jest.mock('../../hooks/useUser', () => ({
  useUser: () => ({
    user: null,
    isLoggedIn: false,
    loading: false,
    error: null,
    logout: jest.fn()
  })
}));

jest.mock('../../hooks/useAudioManager', () => ({
  useAudioManager: () => ({
    audioRefs: {},
    playAudio: jest.fn(),
    stopAllAudio: jest.fn(),
    getAudioRef: jest.fn()
  })
}));

jest.mock('../../hooks/useVillainInvasion', () => ({
  useVillainInvasion: () => ({
    villainInvasion: false,
    showVillains: false,
    setShowVillains: jest.fn()
  })
}));

jest.mock('../../hooks/useJusticeLeagueEasterEgg', () => ({
  useJusticeLeagueEasterEgg: () => ({
    handleJusticeLeagueClick: jest.fn(),
    resetJusticeLeagueCount: jest.fn()
  })
}));

jest.mock('../../components/ui/SpeechBubble');
jest.mock('../../components/ui/HeroVideoOverlay');
jest.mock('../../components/home/HeroGrid');
jest.mock('../../components/home/VillainInvasionOverlay');
jest.mock('../../components/home/AudioElements');

// Mock dos dados
jest.mock('../../data/heroes', () => ({
  heroesData: [],
  filterHeroesByAffiliation: () => [],
  getVillainsByAffiliation: () => [],
  filterHeroesOnly: () => []
}));

// Mock dos utilitários
jest.mock('../../utils/heroUtils', () => ({
  getAudioRefId: () => 'test',
  getSpeechBubbleText: () => 'Test',
  filterHeroesOnly: () => []
}));

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Import HomePage após todos os mocks
import HomePage from '../page';

describe('HomePage', () => {
  it('renders hero section', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Bem-vindo ao')).toBeInTheDocument();
    expect(screen.getByText('SuperStats!')).toBeInTheDocument();
  });

  it('renders hero buttons', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Explorar Agora')).toBeInTheDocument();
    expect(screen.getByText('Comparar Stats')).toBeInTheDocument();
  });

  it('renders hero section content', () => {
    render(<HomePage />);
    
    expect(screen.getByText('portal de fãs')).toBeInTheDocument();
    expect(screen.getByText('Heróis')).toBeInTheDocument();
    expect(screen.getByText('Vilões')).toBeInTheDocument();
  });

  it('has correct links', () => {
    render(<HomePage />);
    
    const exploreLink = screen.getByText('Explorar Agora').closest('a');
    const compareLink = screen.getByText('Comparar Stats').closest('a');
    
    expect(exploreLink).toHaveAttribute('href', '/dashboard/todos');
    expect(compareLink).toHaveAttribute('href', '/comparar');
  });
});
