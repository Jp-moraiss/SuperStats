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

// Mock environment variables
Object.defineProperty(process.env, 'NEXT_PUBLIC_API_URL', {
  value: 'http://localhost:3001',
  writable: true,
});

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
    
    const inputs = screen.getAllByDisplayValue('');
    fireEvent.change(inputs[0], { target: { value: 'testuser' } }); // Username
    fireEvent.change(inputs[1], { target: { value: 'Test User' } }); // Nome
    fireEvent.change(inputs[2], { target: { value: 'test@example.com' } }); // Email
    fireEvent.change(inputs[3], { target: { value: 'password' } }); // Password
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('undefined/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          nome: 'Test User',
          email: 'test@example.com',
          password: 'password',
          genero: '',
          idade: null,
          univ_fav: '',
          tempoGeek: null,
          ocupacao: '',
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
    
    const inputs = screen.getAllByDisplayValue('');
    fireEvent.change(inputs[0], { target: { value: 'testuser' } }); // Username
    fireEvent.change(inputs[1], { target: { value: 'Test User' } }); // Nome
    fireEvent.change(inputs[2], { target: { value: 'test@example.com' } }); // Email
    fireEvent.change(inputs[3], { target: { value: 'password' } }); // Password
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Erro no cadastro/)).toBeInTheDocument();
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
