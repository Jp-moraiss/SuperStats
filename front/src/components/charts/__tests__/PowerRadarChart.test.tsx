// src/components/charts/__tests__/PowerRadarChart.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import PowerRadarChart from '../PowerRadarChart';
import { Character } from '@/types';

const mockCharacters: Character[] = [
  {
    id: 1,
    Name: 'Spider-Man',
    Publisher: 'Marvel Comics',
    Alignment: 'good',
    TotalPower: 85,
    Intelligence: 90,
    Strength: 55,
    Speed: 67,
    Durability: 75,
    Power: 74,
    Combat: 85,
    Gender: 'Male',
    Height: 178,
    Weight: 75,
    'Alter Egos': 'No Alter Egos'
  },
  {
    id: 2,
    Name: 'Batman',
    Publisher: 'DC Comics',
    Alignment: 'good',
    TotalPower: 100,
    Intelligence: 100,
    Strength: 26,
    Speed: 27,
    Durability: 50,
    Power: 47,
    Combat: 100,
    Gender: 'Male',
    Height: 188,
    Weight: 95,
    'Alter Egos': 'No Alter Egos'
  }
];

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  RadarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="radar-chart">{children}</div>
  ),
  PolarGrid: () => <div data-testid="polar-grid" />,
  PolarAngleAxis: () => <div data-testid="polar-angle-axis" />,
  PolarRadiusAxis: () => <div data-testid="polar-radius-axis" />,
  Radar: () => <div data-testid="radar" />,
  Legend: () => <div data-testid="legend" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe('PowerRadarChart', () => {
  it('renders chart with title', () => {
    render(<PowerRadarChart data={mockCharacters} selectedCharacter={null} />);
    
    expect(screen.getByText('Comparativo de Atributos de Poder')).toBeInTheDocument();
  });

  it('renders chart components', () => {
    render(<PowerRadarChart data={mockCharacters} selectedCharacter={null} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('polar-grid')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('shows selection prompt when no character is selected', () => {
    render(<PowerRadarChart data={mockCharacters} selectedCharacter={null} />);
    
    expect(screen.getByText('Clique em um personagem na tabela para ver seus detalhes aqui!')).toBeInTheDocument();
  });

  it('shows selected character details when character is selected', () => {
    const selectedCharacter = mockCharacters[0];
    render(<PowerRadarChart data={mockCharacters} selectedCharacter={selectedCharacter} />);
    
    expect(screen.getByText('Spider-Man')).toBeInTheDocument();
    expect(screen.getByText('Marvel Comics')).toBeInTheDocument();
    expect(screen.getByText('good')).toBeInTheDocument();
  });

  it('displays character stats when character is selected', () => {
    const selectedCharacter = mockCharacters[0];
    render(<PowerRadarChart data={mockCharacters} selectedCharacter={selectedCharacter} />);
    
    // Check if stat bars are rendered
    expect(screen.getByText('Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Strength')).toBeInTheDocument();
    expect(screen.getByText('Speed')).toBeInTheDocument();
    expect(screen.getByText('Durability')).toBeInTheDocument();
    expect(screen.getByText('Power')).toBeInTheDocument();
    expect(screen.getByText('Combat')).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(<PowerRadarChart data={[]} selectedCharacter={null} />);
    
    expect(screen.getByText('Comparativo de Atributos de Poder')).toBeInTheDocument();
    expect(screen.getByText('Clique em um personagem na tabela para ver seus detalhes aqui!')).toBeInTheDocument();
  });
});
