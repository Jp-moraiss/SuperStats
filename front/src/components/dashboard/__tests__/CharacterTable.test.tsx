// src/components/dashboard/__tests__/CharacterTable.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CharacterTable from '../CharacterTable';
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

describe('CharacterTable', () => {
  const mockOnCharacterSelect = jest.fn();

  beforeEach(() => {
    mockOnCharacterSelect.mockClear();
  });

  it('renders character table with data', () => {
    render(<CharacterTable data={mockCharacters} onCharacterSelect={mockOnCharacterSelect} />);
    
    expect(screen.getByText('Explorador de Personagens')).toBeInTheDocument();
    expect(screen.getByText('Spider-Man')).toBeInTheDocument();
    expect(screen.getByText('Batman')).toBeInTheDocument();
  });

  it('displays correct table headers', () => {
    render(<CharacterTable data={mockCharacters} onCharacterSelect={mockOnCharacterSelect} />);
    
    expect(screen.getByText(/Nome/)).toBeInTheDocument();
    expect(screen.getByText(/Editora/)).toBeInTheDocument();
    expect(screen.getByText(/Alinhamento/)).toBeInTheDocument();
    expect(screen.getByText(/Poder Total/)).toBeInTheDocument();
    expect(screen.getByText(/Inteligência/)).toBeInTheDocument();
    expect(screen.getByText(/Força/)).toBeInTheDocument();
  });

  it('calls onCharacterSelect when row is clicked', () => {
    render(<CharacterTable data={mockCharacters} onCharacterSelect={mockOnCharacterSelect} />);
    
    const spiderManRow = screen.getByText('Spider-Man').closest('tr');
    fireEvent.click(spiderManRow!);
    
    expect(mockOnCharacterSelect).toHaveBeenCalledWith(mockCharacters[0]);
  });

  it('filters characters based on search input', async () => {
    const user = userEvent.setup();
    render(<CharacterTable data={mockCharacters} onCharacterSelect={mockOnCharacterSelect} />);
    
    const searchInput = screen.getByPlaceholderText('Pesquisar por nome...');
    await user.type(searchInput, 'Spider');
    
    expect(screen.getByText('Spider-Man')).toBeInTheDocument();
    expect(screen.queryByText('Batman')).not.toBeInTheDocument();
  });

  it('shows limited results when search is empty', () => {
    const manyCharacters = Array.from({ length: 60 }, (_, i) => ({
      ...mockCharacters[0],
      id: i + 1,
      Name: `Character ${i + 1}`
    }));
    
    render(<CharacterTable data={manyCharacters} onCharacterSelect={mockOnCharacterSelect} />);
    
    // Should show only first 50 characters
    expect(screen.getByText('Character 1')).toBeInTheDocument();
    expect(screen.getByText('Character 50')).toBeInTheDocument();
    expect(screen.queryByText('Character 51')).not.toBeInTheDocument();
  });

  it('shows all matching results when searching', async () => {
    const user = userEvent.setup();
    const manyCharacters = Array.from({ length: 60 }, (_, i) => ({
      ...mockCharacters[0],
      id: i + 1,
      Name: `Spider-Man ${i + 1}`
    }));
    
    render(<CharacterTable data={manyCharacters} onCharacterSelect={mockOnCharacterSelect} />);
    
    const searchInput = screen.getByPlaceholderText('Pesquisar por nome...');
    await user.type(searchInput, 'Spider-Man');
    
    // Should show all matching results, not limited to 50
    expect(screen.getByText('Spider-Man 1')).toBeInTheDocument();
    expect(screen.getByText('Spider-Man 60')).toBeInTheDocument();
  });
});
