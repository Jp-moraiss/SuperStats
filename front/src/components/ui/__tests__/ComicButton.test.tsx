import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ComicButton from '../ComicButton';

describe('ComicButton', () => {
  it('renders with children', () => {
    render(<ComicButton>Click me</ComicButton>);
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders as button by default', () => {
    render(<ComicButton>Click me</ComicButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('renders as link when href is provided', () => {
    render(<ComicButton href="/test">Click me</ComicButton>);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<ComicButton onClick={handleClick}>Click me</ComicButton>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    const { container } = render(<ComicButton variant="primary">Click me</ComicButton>);
    
    expect(container.firstChild).toHaveClass('comic-btn', 'comic-btn--primary');
  });

  it('applies size classes correctly', () => {
    const { container } = render(<ComicButton size="large">Click me</ComicButton>);
    
    expect(container.firstChild).toHaveClass('comic-btn', 'comic-btn--large');
  });

  it('applies disabled state', () => {
    render(<ComicButton disabled>Click me</ComicButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies custom className', () => {
    const { container } = render(<ComicButton className="custom-class">Click me</ComicButton>);
    
    expect(container.firstChild).toHaveClass('comic-btn', 'custom-class');
  });

  it('renders with icon', () => {
    render(<ComicButton icon="fas fa-star">Click me</ComicButton>);
    
    const icon = screen.getByText('fas fa-star');
    expect(icon).toHaveClass('comic-btn-icon');
  });

  it('handles different variants', () => {
    const variants = ['primary', 'secondary', 'accent', 'success', 'warning', 'danger'];
    
    variants.forEach(variant => {
      const { container } = render(<ComicButton variant={variant as any}>Click me</ComicButton>);
      expect(container.firstChild).toHaveClass('comic-btn', `comic-btn--${variant}`);
    });
  });

  it('handles different sizes', () => {
    const sizes = ['small', 'medium', 'large'];
    
    sizes.forEach(size => {
      const { container } = render(<ComicButton size={size as any}>Click me</ComicButton>);
      if (size === 'medium') {
        expect(container.firstChild).toHaveClass('comic-btn', 'comic-btn--primary');
      } else {
        expect(container.firstChild).toHaveClass('comic-btn', `comic-btn--${size}`);
      }
    });
  });
});
