import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock ErrorBoundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    console.error('ErrorBoundary caught an error');
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div data-testid="error-fallback">Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Component that throws error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('Error Boundary Tests', () => {
  it('should catch errors and display fallback UI', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
    expect(screen.queryByTestId('error-fallback')).not.toBeInTheDocument();
  });

  it('should display custom fallback UI', () => {
    const customFallback = <div data-testid="custom-error">Custom error message</div>;
    
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId('custom-error')).toBeInTheDocument();
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});
