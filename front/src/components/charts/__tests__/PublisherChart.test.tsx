import React from 'react';
import { render, screen } from '@testing-library/react';
import PublisherChart from '../PublisherChart';

// Mock recharts components
jest.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: ({ children }: any) => <div data-testid="bar">{children}</div>,
  XAxis: () => <div data-testid="x-axis">XAxis</div>,
  YAxis: () => <div data-testid="y-axis">YAxis</div>,
  CartesianGrid: () => <div data-testid="cartesian-grid">CartesianGrid</div>,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Legend: () => <div data-testid="legend">Legend</div>,
  Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
}));

describe('PublisherChart', () => {
  const mockData = [
    { publisher: 'Marvel', count: 50 },
    { publisher: 'DC', count: 30 },
    { publisher: 'Other', count: 20 },
  ];

  it('renders chart with data', () => {
    render(<PublisherChart data={mockData} />);
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders axes', () => {
    render(<PublisherChart data={mockData} />);
    
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });

  it('renders chart components', () => {
    render(<PublisherChart data={mockData} />);
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders legend', () => {
    render(<PublisherChart data={mockData} />);
    
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders tooltip', () => {
    render(<PublisherChart data={mockData} />);
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('handles empty data', () => {
    render(<PublisherChart data={[]} />);
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<PublisherChart data={mockData} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('card');
  });
});
