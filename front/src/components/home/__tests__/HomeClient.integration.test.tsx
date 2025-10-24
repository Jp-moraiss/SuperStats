import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeClient from '../HomeClient';

// Mock dos hooks
jest.mock('../../../hooks/useHomeLogic', () => ({
  useHomeLogic: jest.fn(() => ({
    isLoggedIn: true,
    activeHero: null,
    filteredHeroes: [
      { id: 'batman', nome: 'Batman', afiliacao: 'dc' },
      { id: 'spiderman', nome: 'Spider-Man', afiliacao: 'marvel' }
    ],
    filteredVillains: [],
    showVillains: false,
    speechBubbleText: 'Clique nos heróis!',
    audioRefs: { batman: { current: null } },
    villainInvasion: false,
    handleHeroClick: jest.fn(),
    handleCloseVideo: jest.fn()
  }))
}));

// Mock dos componentes filhos
jest.mock('../HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section">Hero Section</div>
}));

jest.mock('../UserGallery', () => ({
  UserGallery: ({ isLoggedIn, filteredHeroes, onHeroClick }: { isLoggedIn: boolean; filteredHeroes: { id: string; nome: string }[]; onHeroClick: (hero: { id: string; nome: string }) => void }) => (
    <div data-testid="user-gallery">
      <div>User Gallery - Logged in: {isLoggedIn.toString()}</div>
      <div>Heroes: {filteredHeroes.length}</div>
      <button onClick={() => onHeroClick({ id: 'batman', nome: 'Batman' })}>
        Click Hero
      </button>
    </div>
  )
}));

jest.mock('../CTASection', () => ({
  CTASection: ({ isLoggedIn }: { isLoggedIn: boolean }) => (
    <div data-testid="cta-section">
      CTA Section - Logged in: {isLoggedIn.toString()}
    </div>
  )
}));

jest.mock('../../ui/HeroVideoOverlay', () => ({
  __esModule: true,
  default: ({ hero, onClose }: { hero: string; onClose: () => void }) => (
    <div data-testid="hero-video-overlay">
      Video Overlay for {hero}
      <button onClick={onClose}>Close</button>
    </div>
  )
}));

describe('HomeClient Integration Tests', () => {
  it('should render all main sections', () => {
    render(<HomeClient />);
    
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('user-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('cta-section')).toBeInTheDocument();
  });

  it('should pass correct props to UserGallery', () => {
    render(<HomeClient />);
    
    const userGallery = screen.getByTestId('user-gallery');
    expect(userGallery).toHaveTextContent('Logged in: true');
    expect(userGallery).toHaveTextContent('Heroes: 2');
  });

  it('should pass correct props to CTASection', () => {
    render(<HomeClient />);
    
    const ctaSection = screen.getByTestId('cta-section');
    expect(ctaSection).toHaveTextContent('Logged in: true');
  });

  it('should not show video overlay when no active hero', () => {
    render(<HomeClient />);
    
    expect(screen.queryByTestId('hero-video-overlay')).not.toBeInTheDocument();
  });

  it('should show video overlay when active hero is set', async () => {
    // Mock useHomeLogic to return active hero
    const mockUseHomeLogic = jest.requireMock('../../../hooks/useHomeLogic').useHomeLogic;
    mockUseHomeLogic.mockReturnValue({
      isLoggedIn: true,
      activeHero: 'batman',
      filteredHeroes: [],
      filteredVillains: [],
      showVillains: false,
      speechBubbleText: 'Clique nos heróis!',
      audioRefs: {},
      villainInvasion: false,
      handleHeroClick: jest.fn(),
      handleCloseVideo: jest.fn()
    });

    render(<HomeClient />);
    
    await waitFor(() => {
      expect(screen.getByTestId('hero-video-overlay')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('hero-video-overlay')).toHaveTextContent('Video Overlay for batman');
  });

  it('should handle hero click in UserGallery', async () => {
    const mockHandleHeroClick = jest.fn();
    const mockUseHomeLogic = jest.requireMock('../../../hooks/useHomeLogic').useHomeLogic;
    mockUseHomeLogic.mockReturnValue({
      isLoggedIn: true,
      activeHero: null,
      filteredHeroes: [],
      filteredVillains: [],
      showVillains: false,
      speechBubbleText: 'Clique nos heróis!',
      audioRefs: {},
      villainInvasion: false,
      handleHeroClick: mockHandleHeroClick,
      handleCloseVideo: jest.fn()
    });

    render(<HomeClient />);
    
    const heroButton = screen.getByText('Click Hero');
    fireEvent.click(heroButton);
    
    expect(mockHandleHeroClick).toHaveBeenCalledWith({
      id: 'batman',
      nome: 'Batman'
    });
  });

  it('should handle video close', async () => {
    const mockHandleCloseVideo = jest.fn();
    const mockUseHomeLogic = jest.requireMock('../../../hooks/useHomeLogic').useHomeLogic;
    mockUseHomeLogic.mockReturnValue({
      isLoggedIn: true,
      activeHero: 'batman',
      filteredHeroes: [],
      filteredVillains: [],
      showVillains: false,
      speechBubbleText: 'Clique nos heróis!',
      audioRefs: {},
      villainInvasion: false,
      handleHeroClick: jest.fn(),
      handleCloseVideo: mockHandleCloseVideo
    });

    render(<HomeClient />);
    
    await waitFor(() => {
      expect(screen.getByTestId('hero-video-overlay')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    expect(mockHandleCloseVideo).toHaveBeenCalled();
  });

  it('should handle user not logged in', () => {
    const mockUseHomeLogic = jest.requireMock('../../../hooks/useHomeLogic').useHomeLogic;
    mockUseHomeLogic.mockReturnValue({
      isLoggedIn: false,
      activeHero: null,
      filteredHeroes: [],
      filteredVillains: [],
      showVillains: false,
      speechBubbleText: 'Clique nos heróis!',
      audioRefs: {},
      villainInvasion: false,
      handleHeroClick: jest.fn(),
      handleCloseVideo: jest.fn()
    });

    render(<HomeClient />);
    
    const userGallery = screen.getByTestId('user-gallery');
    expect(userGallery).toHaveTextContent('Logged in: false');
    
    const ctaSection = screen.getByTestId('cta-section');
    expect(ctaSection).toHaveTextContent('Logged in: false');
  });
});
