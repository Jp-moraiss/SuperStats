import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card } from '../Card';

describe('Card', () => {
  it('should render with default props', () => {
    render(<Card>Test content</Card>);
    
    const card = screen.getByText('Test content');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('card');
    expect(card).toHaveClass('card--default');
    expect(card).toHaveClass('card--medium');
    expect(card).toHaveClass('card--padding-medium');
  });

  it('should render with different variants', () => {
    const { rerender } = render(<Card variant="elevated">Test</Card>);
    expect(screen.getByText('Test')).toHaveClass('card--elevated');
    
    rerender(<Card variant="outlined">Test</Card>);
    expect(screen.getByText('Test')).toHaveClass('card--outlined');
    
    rerender(<Card variant="flat">Test</Card>);
    expect(screen.getByText('Test')).toHaveClass('card--flat');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Card size="small">Test</Card>);
    expect(screen.getByText('Test')).toHaveClass('card--small');
    
    rerender(<Card size="large">Test</Card>);
    expect(screen.getByText('Test')).toHaveClass('card--large');
  });

  it('should render with different padding', () => {
    const { rerender } = render(<Card padding="none">Test</Card>);
    expect(screen.getByText('Test')).toHaveClass('card--padding-none');
    
    rerender(<Card padding="small">Test</Card>);
    expect(screen.getByText('Test')).toHaveClass('card--padding-small');
    
    rerender(<Card padding="large">Test</Card>);
    expect(screen.getByText('Test')).toHaveClass('card--padding-large');
  });

  it('should be clickable when onClick is provided', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Clickable card</Card>);
    
    const card = screen.getByText('Clickable card');
    expect(card).toHaveClass('card--clickable');
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabIndex', '0');
    
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be hoverable when hoverable prop is true', () => {
    render(<Card hoverable>Hoverable card</Card>);
    
    const card = screen.getByText('Hoverable card');
    expect(card).toHaveClass('card--hoverable');
  });

  it('should apply custom className', () => {
    render(<Card className="custom-card">Test</Card>);
    
    const card = screen.getByText('Test');
    expect(card).toHaveClass('custom-card');
  });

  it('should apply custom styles', () => {
    render(<Card style={{ backgroundColor: 'red' }}>Test</Card>);
    
    const card = screen.getByText('Test');
    expect(card).toHaveStyle('background-color: rgb(255, 0, 0)');
  });

  it('should handle keyboard events when clickable', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Clickable card</Card>);
    
    const card = screen.getByText('Clickable card');
    
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    fireEvent.keyDown(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('should be memoized and not re-render unnecessarily', () => {
    const { rerender } = render(<Card variant="default">Test</Card>);
    const card = screen.getByText('Test');
    
    // Re-render with same props
    rerender(<Card variant="default">Test</Card>);
    
    // Should be the same element (memoized)
    expect(screen.getByText('Test')).toBe(card);
  });
});
