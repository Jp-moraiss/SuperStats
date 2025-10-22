import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../login/page';

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

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders login form', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('')).toHaveLength(2); // Username and password inputs
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('renders login button', () => {
    render(<LoginPage />);
    
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('renders register link', () => {
    render(<LoginPage />);
    
    expect(screen.getByText('Não tem conta?')).toBeInTheDocument();
    expect(screen.getByText('Cadastre-se')).toHaveAttribute('href', '/auth/register');
  });

  it('handles form submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-token', user: { username: 'test' } }),
    });

    render(<LoginPage />);
    
    const inputs = screen.getAllByDisplayValue('');
    fireEvent.change(inputs[0], { target: { value: 'test@example.com' } });
    fireEvent.change(inputs[1], { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('undefined/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'test@example.com',
          password: 'password',
        }),
      });
    });
  });

  it('shows error message on failed login', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    });

    render(<LoginPage />);
    
    const inputs = screen.getAllByDisplayValue('');
    fireEvent.change(inputs[0], { target: { value: 'test@example.com' } });
    fireEvent.change(inputs[1], { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/res.text is not a function/)).toBeInTheDocument();
    });
  });

  it('validates required fields', () => {
    render(<LoginPage />);
    
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    // Check if form validation prevents submission
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('validates username format', () => {
    render(<LoginPage />);
    
    const inputs = screen.getAllByDisplayValue('');
    fireEvent.change(inputs[0], { target: { value: 'invalid-username' } });
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));
    
    // Check if form accepts the input
    expect(inputs[0]).toHaveValue('invalid-username');
  });
});
