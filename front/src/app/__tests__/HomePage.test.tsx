import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from '../page';

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

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
    
    const batmanCards = screen.getAllByText('Batman');
    const batmanCard = batmanCards.find(card => card.closest('.hero-card'));
    if (batmanCard) {
      const heroCard = batmanCard.closest('.hero-card');
      if (heroCard) {
        fireEvent.click(heroCard);
      }
    }
    
    expect(HTMLAudioElement.prototype.play).toHaveBeenCalled();
  });

  it('shows CTA section when user is logged in', () => {
    localStorageMock.getItem.mockReturnValue('fake-token');
    
    render(<HomePage />);
    
    expect(screen.getByText('Participe da Pesquisa!')).toBeInTheDocument();
  });

  it('shows CTA section when user is not logged in', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Participe da Pesquisa!')).toBeInTheDocument();
  });

  it('has correct links', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Explorar Agora')).toHaveAttribute('href', '/dashboard/todos');
    expect(screen.getByText('Comparar Stats')).toHaveAttribute('href', '/comparar');
  });

  it('renders hero images with correct attributes', () => {
    render(<HomePage />);
    
    const images = screen.getAllByTestId('next-image-mock');
    const batmanImage = images.find(img => img.getAttribute('data-src') === '/batman.png');
    expect(batmanImage).toHaveAttribute('data-src', '/batman.png');
    expect(batmanImage).toHaveAttribute('data-width', '200');
    expect(batmanImage).toHaveAttribute('data-height', '200');
  });

  it('handles different hero clicks', () => {
    render(<HomePage />);
    
    const heroCards = screen.getAllByText('Batman').concat(
      screen.getAllByText('Homem-Aranha'),
      screen.getAllByText('Superman'),
      screen.getAllByText('Os Vingadores')
    );
    
    heroCards.forEach(card => {
      const heroCard = card.closest('.hero-card, .hero-horizontal');
      if (heroCard) {
        fireEvent.click(heroCard);
      }
    });
    
    expect(HTMLAudioElement.prototype.play).toHaveBeenCalled();
  });
});
