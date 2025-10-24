import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HqCard } from '../../../features/hqs';

// Mock is handled globally in jest.setup.js

describe('HqCard', () => {
  const mockHq = {
    id: 1,
    titulo: 'Batman: The Dark Knight Returns',
    issue_number: 1,
    cover_date: '1986-06-01',
    coverUrl: '/hq-cover.jpg',
    volumeName: 'The Dark Knight Returns',
    editora: 'DC Comics',
    lido: false,
  };

  it('renders HQ information', () => {
    render(<HqCard hq={mockHq} onToggleRead={jest.fn()} />);
    
    expect(screen.getByText('Batman: The Dark Knight Returns')).toBeInTheDocument();
    expect(screen.getByText('The Dark Knight Returns')).toBeInTheDocument();
    expect(screen.getByText('DC Comics')).toBeInTheDocument();
  });

  it('renders HQ cover image', () => {
    render(<HqCard hq={mockHq} onToggleRead={jest.fn()} />);
    
    const cover = screen.getByTestId('next-image-mock');
    expect(cover).toHaveAttribute('data-src', '/hq-cover.jpg');
    expect(cover).toHaveAttribute('data-alt', 'Capa de Batman: The Dark Knight Returns');
  });

  it('renders volume information', () => {
    render(<HqCard hq={mockHq} onToggleRead={jest.fn()} />);
    
    expect(screen.getByText('The Dark Knight Returns')).toBeInTheDocument();
  });

  it('renders publisher information', () => {
    render(<HqCard hq={mockHq} onToggleRead={jest.fn()} />);
    
    expect(screen.getByText('DC Comics')).toBeInTheDocument();
  });

  it('handles toggle read events', () => {
    const handleToggleRead = jest.fn();
    render(<HqCard hq={mockHq} onToggleRead={handleToggleRead} />);
    
    const readButton = screen.getByRole('button', { name: /marcar como lida/i });
    fireEvent.click(readButton);
    expect(handleToggleRead).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<HqCard hq={mockHq} onToggleRead={jest.fn()} />);
    
    expect(container.firstChild).toHaveClass('hqCard');
  });

  it('handles missing cover image', () => {
    const hqWithoutImage = { ...mockHq, coverUrl: null };
    render(<HqCard hq={hqWithoutImage} onToggleRead={jest.fn()} />);
    
    expect(screen.getByText('Batman: The Dark Knight Returns')).toBeInTheDocument();
  });

  it('renders HQ title correctly', () => {
    render(<HqCard hq={mockHq} onToggleRead={jest.fn()} />);
    
    expect(screen.getByText('Batman: The Dark Knight Returns')).toBeInTheDocument();
  });

  it('renders different publishers', () => {
    const hqWithDifferentPublisher = {
      ...mockHq,
      editora: 'Marvel Comics',
    };
    render(<HqCard hq={hqWithDifferentPublisher} onToggleRead={jest.fn()} />);
    
    expect(screen.getByText('Marvel Comics')).toBeInTheDocument();
  });

  it('handles missing volume information', () => {
    const hqWithoutVolume = { ...mockHq, volumeName: null };
    render(<HqCard hq={hqWithoutVolume} onToggleRead={jest.fn()} />);
    
    expect(screen.getByText('Batman: The Dark Knight Returns')).toBeInTheDocument();
  });
});
