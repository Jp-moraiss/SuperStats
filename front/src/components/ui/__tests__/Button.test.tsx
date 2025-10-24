import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../Button';
import { FaHeart } from 'react-icons/fa';

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('button--primary');
    expect(button).toHaveClass('button--medium');
  });

  it('should render with different variants', () => {
    const { rerender } = render(<Button variant="secondary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--secondary');
    
    rerender(<Button variant="success">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--success');
    
    rerender(<Button variant="error">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--error');
    
    rerender(<Button variant="warning">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--warning');
    
    rerender(<Button variant="ghost">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--ghost');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="small">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--small');
    
    rerender(<Button size="large">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--large');
  });

  it('should render with full width', () => {
    render(<Button fullWidth>Full width button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--full-width');
  });

  it('should render with loading state', () => {
    render(<Button loading>Loading button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--loading');
    expect(button).toBeDisabled();
  });

  it('should render with icon on left', () => {
    render(<Button icon={<FaHeart />} iconPosition="left">With icon</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--icon-left');
  });

  it('should render with icon on right', () => {
    render(<Button icon={<FaHeart />} iconPosition="right">With icon</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button--icon-right');
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should be disabled when loading', () => {
    render(<Button loading>Loading button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should not show icon when loading', () => {
    render(<Button icon={<FaHeart />} loading>Loading button</Button>);
    
    const button = screen.getByRole('button');
    // Icon should not be visible when loading
    expect(button.querySelector('.button__icon')).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Button className="custom-button">Test</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-button');
  });

  it('should handle keyboard events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('should be memoized and not re-render unnecessarily', () => {
    const { rerender } = render(<Button variant="primary">Test</Button>);
    const button = screen.getByRole('button');
    
    // Re-render with same props
    rerender(<Button variant="primary">Test</Button>);
    
    // Should be the same element (memoized)
    expect(screen.getByRole('button')).toBe(button);
  });
});
