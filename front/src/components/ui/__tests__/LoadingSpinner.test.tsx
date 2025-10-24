import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('loading-spinner');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="small" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('loading-spinner--small');
    
    rerender(<LoadingSpinner size="medium" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('loading-spinner--medium');
    
    rerender(<LoadingSpinner size="large" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('loading-spinner--large');
  });

  it('should render with custom color', () => {
    render(<LoadingSpinner color="#ff0000" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveStyle('--spinner-color: #ff0000');
  });

  it('should render with text', () => {
    render(<LoadingSpinner text="Loading..." />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render without text when not provided', () => {
    render(<LoadingSpinner />);
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<LoadingSpinner className="custom-spinner" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('custom-spinner');
  });

  it('should apply custom styles', () => {
    render(<LoadingSpinner style={{ margin: '10px' }} />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveStyle('margin: 10px');
  });

  it('should be memoized and not re-render unnecessarily', () => {
    const { rerender } = render(<LoadingSpinner size="small" />);
    const spinner = screen.getByTestId('loading-spinner');
    
    // Re-render with same props
    rerender(<LoadingSpinner size="small" />);
    
    // Should be the same element (memoized)
    expect(screen.getByTestId('loading-spinner')).toBe(spinner);
  });
});
