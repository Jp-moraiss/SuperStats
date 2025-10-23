import React from 'react';
import { render, screen } from '@testing-library/react';
import ModernFooter from '../ModernFooter';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('ModernFooter', () => {
  it('renders footer with logo and tagline', () => {
    render(<ModernFooter />);
    
    expect(screen.getByText('SuperStats')).toBeInTheDocument();
    expect(screen.getByText('O portal definitivo para fãs de super-heróis')).toBeInTheDocument();
  });

  it('renders project information', () => {
    render(<ModernFooter />);
    
    expect(screen.getByText('Sobre o Projeto')).toBeInTheDocument();
    expect(screen.getByText('CESAR School')).toBeInTheDocument();
    expect(screen.getByText('Ver Repositório')).toBeInTheDocument();
  });


  it('renders data sources section', () => {
    render(<ModernFooter />);
    
    expect(screen.getByText('Fontes de Dados')).toBeInTheDocument();
    expect(screen.getByText('Comic Vine API')).toBeInTheDocument();
    expect(screen.getByText('TMDB (The Movie Database)')).toBeInTheDocument();
    expect(screen.getByText('SuperHero API')).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    render(<ModernFooter />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} SuperStats. Um Projeto Acadêmico da CESAR School.`)).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<ModernFooter />);
    
    expect(container.firstChild).toHaveClass('footer');
  });
});
