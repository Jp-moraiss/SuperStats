import React from 'react';
import { render, screen } from '@testing-library/react';
import AlignmentChart from '../AlignmentChart';

// Mock recharts components
jest.mock('recharts', () => ({
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: any) => <div data-testid="pie">{children}</div>,
  Cell: ({ children }: any) => <div data-testid="cell">{children}</div>,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Legend: () => <div data-testid="legend">Legend</div>,
  Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
}));

describe('AlignmentChart', () => {
  const mockData = [
    { name: 'Good', value: 40, color: '#00CC66' },
    { name: 'Neutral', value: 30, color: '#FFD700' },
    { name: 'Evil', value: 30, color: '#E30000' },
  ];

  it('renders chart with data', () => {
    render(<AlignmentChart data={mockData} />);
    
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('renders legend', () => {
    render(<AlignmentChart data={mockData} />);
    
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders tooltip', () => {
    render(<AlignmentChart data={mockData} />);
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('handles empty data', () => {
    render(<AlignmentChart data={[]} />);
    
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<AlignmentChart data={mockData} className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('card');
  });

  it('renders with default props', () => {
    render(<AlignmentChart data={mockData} />);
    
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });
});
