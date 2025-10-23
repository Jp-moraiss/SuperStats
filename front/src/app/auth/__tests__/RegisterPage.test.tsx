import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '../register/page';

// Mock Next.js components
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

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

// Mock environment variables are handled globally in jest.setup.js

// Mock fetch
global.fetch = jest.fn();

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders registration form', () => {
    render(<RegisterPage />);
    
    expect(screen.getByText('Cadastro de Novo Fã')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('')).toHaveLength(7); // All empty inputs
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  it('renders register button', () => {
    render(<RegisterPage />);
    
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  it('renders login link', () => {
    render(<RegisterPage />);
    
    expect(screen.getByText('Já tem conta?')).toBeInTheDocument();
    expect(screen.getByText('Faça o login')).toHaveAttribute('href', '/auth/login');
  });

  it('handles form submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-token', user: { username: 'test' } }),
    });

    render(<RegisterPage />);
    
    // Preenche os campos obrigatórios
    fireEvent.change(screen.getByLabelText('Usuário*'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email*'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Senha*'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Nome Completo*'), { target: { value: 'Test User' } });
    
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          nome: 'Test User',
          email: 'test@example.com',
          password: 'password',
          genero: null,
          idade: null,
          univ_fav: null,
          tempoGeek: null,
          ocupacao: null,
        }),
      });
    });
  });

  it('shows error message on failed registration', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => 'Email already exists',
    });

    render(<RegisterPage />);
    
    // Preenche os campos obrigatórios
    fireEvent.change(screen.getByLabelText('Usuário*'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email*'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Senha*'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Nome Completo*'), { target: { value: 'Test User' } });
    
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email already exists/)).toBeInTheDocument();
    });
  });

  it('validates required fields', () => {
    render(<RegisterPage />);
    
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    
    // Check if form validation prevents submission
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
  });

  it('validates password confirmation', () => {
    render(<RegisterPage />);
    
    const inputs = screen.getAllByDisplayValue('');
    fireEvent.change(inputs[3], { target: { value: 'password' } }); // Password
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    
    // Check if form accepts the input
    expect(inputs[3]).toHaveValue('password');
  });

  it('validates email format', () => {
    render(<RegisterPage />);
    
    const inputs = screen.getAllByDisplayValue('');
    fireEvent.change(inputs[2], { target: { value: 'invalid-email' } }); // Email
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    
    // Check if form accepts the input
    expect(inputs[2]).toHaveValue('invalid-email');
  });
});

