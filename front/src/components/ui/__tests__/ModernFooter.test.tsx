import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('renders social media links', () => {
    render(<ModernFooter />);
    
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<ModernFooter />);
    
    expect(screen.getByText('Todos Personagens')).toBeInTheDocument();
    expect(screen.getByText('Heróis')).toBeInTheDocument();
    expect(screen.getByText('Vilões')).toBeInTheDocument();
    expect(screen.getByText('Marvel')).toBeInTheDocument();
    expect(screen.getByText('DC Comics')).toBeInTheDocument();
  });

  it('renders newsletter section', () => {
    render(<ModernFooter />);
    
    expect(screen.getByText('Mantenha-se Atualizado')).toBeInTheDocument();
    expect(screen.getByText('Receba as últimas notícias sobre super-heróis e novidades do portal')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Seu e-mail')).toBeInTheDocument();
    expect(screen.getByText('Inscrever-se')).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    render(<ModernFooter />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} SuperStats. Todos os direitos reservados.`)).toBeInTheDocument();
  });

  it('renders bottom links', () => {
    render(<ModernFooter />);
    
    expect(screen.getByText('Termos de Uso')).toBeInTheDocument();
    expect(screen.getAllByText('Privacidade')).toHaveLength(2); // One in support section, one in bottom
    expect(screen.getByText('Cookies')).toBeInTheDocument();
  });

  it('handles newsletter form input', () => {
    render(<ModernFooter />);
    
    const emailInput = screen.getByPlaceholderText('Seu e-mail');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Check if input value is set correctly
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<ModernFooter />);
    
    expect(container.firstChild).toHaveClass('footer');
  });

  it('renders all link groups', () => {
    render(<ModernFooter />);
    
    expect(screen.getByText('Explorar')).toBeInTheDocument();
    expect(screen.getByText('Universos')).toBeInTheDocument();
    expect(screen.getByText('Suporte')).toBeInTheDocument();
  });

  it('has accessible social media links', () => {
    render(<ModernFooter />);
    
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
  });
});
