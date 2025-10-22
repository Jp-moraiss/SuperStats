// src/components/dashboard/__tests__/StatCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';

describe('StatCard', () => {
  it('renders with title and value', () => {
    render(<StatCard title="Total Characters" value={100} />);
    
    expect(screen.getByText('Total Characters')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders with zero value when value is undefined', () => {
    render(<StatCard title="Total Characters" value={undefined} />);
    
    expect(screen.getByText('Total Characters')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('formats numbers with Brazilian locale', () => {
    render(<StatCard title="Total Characters" value={1234} />);
    
    expect(screen.getByText('1.234')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<StatCard title="Test" value={50} />);
    
    const card = container.firstChild;
    expect(card).toHaveClass('card');
  });
});
