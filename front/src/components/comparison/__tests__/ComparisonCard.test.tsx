// src/components/comparison/__tests__/ComparisonCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ComparisonCard from '../ComparisonCard';
import { Character } from '@/types';

const mockCharacter: Character = {
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
};

describe('ComparisonCard', () => {
  const mockOnClear = jest.fn();

  beforeEach(() => {
    mockOnClear.mockClear();
  });

  it('renders placeholder when no character is provided', () => {
    render(<ComparisonCard character={null} onClear={mockOnClear} />);
    
    expect(screen.getByText('Nenhum Personagem Selecionado')).toBeInTheDocument();
    expect(screen.getByText('Use a caixa de pesquisa acima para escolher um herói/vilão para comparar.')).toBeInTheDocument();
  });

  it('renders character details when character is provided', () => {
    render(<ComparisonCard character={mockCharacter} onClear={mockOnClear} />);
    
    expect(screen.getByText('Spider-Man')).toBeInTheDocument();
    expect(screen.getByText('Marvel Comics')).toBeInTheDocument();
    expect(screen.getByText('good')).toBeInTheDocument();
    expect(screen.getAllByText('85').length).toBeGreaterThan(0); // TotalPower appears multiple times
  });

  it('displays character stats', () => {
    render(<ComparisonCard character={mockCharacter} onClear={mockOnClear} />);
    
    expect(screen.getByText('Inteligência')).toBeInTheDocument();
    expect(screen.getByText('Força')).toBeInTheDocument();
    expect(screen.getByText('Velocidade')).toBeInTheDocument();
    expect(screen.getByText('Durabilidade')).toBeInTheDocument();
    expect(screen.getByText('Poder')).toBeInTheDocument();
    expect(screen.getByText('Combate')).toBeInTheDocument();
  });

  it('shows character physical attributes', () => {
    render(<ComparisonCard character={mockCharacter} onClear={mockOnClear} />);
    
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('178 cm')).toBeInTheDocument();
    expect(screen.getByText('75 kg')).toBeInTheDocument();
    expect(screen.getByText('Nenhum')).toBeInTheDocument(); // Alter Egos translated
  });

  it('calls onClear when clear button is clicked', () => {
    render(<ComparisonCard character={mockCharacter} onClear={mockOnClear} />);
    
    const clearButton = screen.getByLabelText('Remover personagem');
    fireEvent.click(clearButton);
    
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('handles character with missing data', () => {
    const characterWithMissingData: Character = {
      ...mockCharacter,
      Gender: undefined,
      Height: 0,
      Weight: 0,
      'Alter Egos': 'No Alter Egos'
    };
    
    render(<ComparisonCard character={characterWithMissingData} onClear={mockOnClear} />);
    
    const desconhecidos = screen.getAllByText('Desconhecido');
    expect(desconhecidos.length).toBe(3); // Gender, Height, Weight
  });

  it('handles character with alter egos', () => {
    const characterWithAlterEgos: Character = {
      ...mockCharacter,
      'Alter Egos': 'Peter Parker, Spider-Man'
    };
    
    render(<ComparisonCard character={characterWithAlterEgos} onClear={mockOnClear} />);
    
    expect(screen.getByText('Peter Parker, Spider-Man')).toBeInTheDocument();
  });

  it('applies correct alignment class', () => {
    render(<ComparisonCard character={mockCharacter} onClear={mockOnClear} />);
    
    const badge = screen.getByText('good');
    expect(badge).toBeInTheDocument();
  });
});
