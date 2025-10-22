import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../page';

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock HTMLVideoElement methods
Object.defineProperty(HTMLVideoElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockResolvedValue(undefined),
});

Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLVideoElement.prototype, 'load', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLVideoElement.prototype, 'currentTime', {
  writable: true,
  value: 0,
});

// Mock is handled globally in jest.setup.js

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock audio elements
const mockAudio = {
  play: jest.fn(),
  pause: jest.fn(),
  currentTime: 0,
};

Object.defineProperty(HTMLAudioElement.prototype, 'play', {
  value: mockAudio.play,
  writable: true,
});

Object.defineProperty(HTMLAudioElement.prototype, 'pause', {
  value: mockAudio.pause,
  writable: true,
});

Object.defineProperty(HTMLAudioElement.prototype, 'currentTime', {
  value: 0,
  writable: true,
});

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

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

  it('renders hero gallery', () => {
    render(<HomePage />);
    
    expect(screen.getAllByText('Batman')).toHaveLength(2); // Image mock + label
    expect(screen.getAllByText('Homem-Aranha')).toHaveLength(2);
    expect(screen.getAllByText('Superman')).toHaveLength(2);
    expect(screen.getAllByText('Os Vingadores')).toHaveLength(1); // Only label for Avengers
  });

  it('renders speech bubbles', () => {
    render(<HomePage />);
    
    expect(screen.getByText('WOW!')).toBeInTheDocument();
    expect(screen.getByText('Clique nos heróis e tenha uma experiência única!')).toBeInTheDocument();
  });

  it('plays audio when hero is clicked', () => {
    render(<HomePage />);
    
    const batmanCard = screen.getByText('Batman').closest('.hero-card');
    fireEvent.click(batmanCard!);
    
    expect(mockAudio.play).toHaveBeenCalled();
  });

  it('shows CTA section when user is logged in', () => {
    localStorageMock.getItem.mockReturnValue('fake-token');
    
    render(<HomePage />);
    
    expect(screen.getByText('Participe da Pesquisa!')).toBeInTheDocument();
  });

  it('does not show CTA section when user is not logged in', () => {
    render(<HomePage />);
    
    expect(screen.queryByText('Participe da Pesquisa!')).not.toBeInTheDocument();
  });

  it('has correct links', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Explorar Agora')).toHaveAttribute('href', '/todos');
    expect(screen.getByText('Comparar Stats')).toHaveAttribute('href', '/comparar');
  });

  it('renders hero images with correct attributes', () => {
    render(<HomePage />);
    
    const batmanImage = screen.getByText('Batman').closest('[data-testid="next-image-mock"]');
    expect(batmanImage).toHaveAttribute('data-src', '/batman.png');
    expect(batmanImage).toHaveAttribute('data-width', '200');
    expect(batmanImage).toHaveAttribute('data-height', '200');
  });

  it('handles different hero clicks', () => {
    render(<HomePage />);
    
    const heroImages = screen.getAllByTestId('next-image-mock');
    
    heroImages.forEach(image => {
      fireEvent.click(image);
    });
    
    expect(mockAudio.play).toHaveBeenCalledTimes(4);
  });
});
