import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeroCard } from '../HeroCard';
import { Hero } from '../../../data/heroes';

// Mock Next.js Image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: Record<string, unknown>) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  };
});

const mockHero: Hero = {
  id: 'batman',
  nome: 'Batman',
  afiliacao: 'dc',
  imagemSrc: '/batman.png',
  audioSrc: '/audio/batman-theme.mp3',
  videoSrc: '/videos/batman.mp4',
  layout: 'card'
};

describe('HeroCard', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders hero information correctly', () => {
    render(<HeroCard hero={mockHero} onClick={mockOnClick} />);
    
    expect(screen.getByText('Batman')).toBeInTheDocument();
    expect(screen.getByAltText('Batman')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders as villain when isVillain is true', () => {
    render(<HeroCard hero={mockHero} onClick={mockOnClick} isVillain={true} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveClass('villain-card');
  });

  it('calls onClick when clicked', () => {
    render(<HeroCard hero={mockHero} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalledWith(mockHero);
  });

  it('calls onClick when Enter key is pressed', () => {
    render(<HeroCard hero={mockHero} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(mockOnClick).toHaveBeenCalledWith(mockHero);
  });

  it('calls onClick when Space key is pressed', () => {
    render(<HeroCard hero={mockHero} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: ' ' });
    
    expect(mockOnClick).toHaveBeenCalledWith(mockHero);
  });

  it('does not call onClick for other keys', () => {
    render(<HeroCard hero={mockHero} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Tab' });
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('has correct accessibility attributes', () => {
    render(<HeroCard hero={mockHero} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('aria-label', 'Clique para interagir com Batman');
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('handles click errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const errorOnClick = jest.fn(() => {
      throw new Error('Click error');
    });

    render(<HeroCard hero={mockHero} onClick={errorOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(errorOnClick).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Error handling hero click:', expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  it('handles image error gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<HeroCard hero={mockHero} onClick={mockOnClick} />);
    
    const image = screen.getByAltText('Batman');
    fireEvent.error(image);
    
    expect(consoleSpy).toHaveBeenCalledWith('Error loading image for Batman:', expect.any(Object));
    
    consoleSpy.mockRestore();
  });

  it('applies correct CSS classes', () => {
    render(<HeroCard hero={mockHero} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveClass('hero-card', 'batman');
  });

  it('applies villain classes when isVillain is true', () => {
    render(<HeroCard hero={mockHero} onClick={mockOnClick} isVillain={true} />);
    
    const card = screen.getByRole('button');
    expect(card).toHaveClass('hero-card', 'villain-card', 'batman');
  });
});
