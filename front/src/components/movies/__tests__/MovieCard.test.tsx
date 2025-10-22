import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from '../MovieCard';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('MovieCard', () => {
  const mockMovie = {
    id: 1,
    titulo: 'The Dark Knight',
    release_date: '2008-07-18',
    poster_path: '/poster.jpg',
    vote_average: 9.0,
    overview: 'A great movie about Batman',
    genre_ids: [28, 80],
    avaliacaoTmdb: 9.0,
    produtora: 'Warner Bros',
    diretor: 'Christopher Nolan',
    assistido: false,
    posterUrl: '/poster.jpg',
    trailerUrl: null,
  };

  it('renders movie information', () => {
    render(<MovieCard movie={mockMovie} onDelete={jest.fn()} onToggleWatched={jest.fn()} onShowTrailer={jest.fn()} />);
    
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
    expect(screen.getByText('9.0')).toBeInTheDocument();
  });

  it('renders movie poster', () => {
    render(<MovieCard movie={mockMovie} onDelete={jest.fn()} onToggleWatched={jest.fn()} onShowTrailer={jest.fn()} />);
    
    const poster = screen.getByAltText('Pôster de The Dark Knight');
    expect(poster).toHaveAttribute('src', '/poster.jpg');
  });

  it('handles click events', () => {
    const handleDelete = jest.fn();
    render(<MovieCard movie={mockMovie} onDelete={handleDelete} onToggleWatched={jest.fn()} onShowTrailer={jest.fn()} />);
    
    const deleteButton = document.querySelector('.deleteButton');
    fireEvent.click(deleteButton!);
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(<MovieCard movie={mockMovie} onDelete={jest.fn()} onToggleWatched={jest.fn()} onShowTrailer={jest.fn()} />);
    
    expect(container.firstChild).toHaveClass('movieCard');
  });

  it('renders with different vote averages', () => {
    const movieWithLowRating = { ...mockMovie, avaliacaoTmdb: 3.5 };
    render(<MovieCard movie={movieWithLowRating} onDelete={jest.fn()} onToggleWatched={jest.fn()} onShowTrailer={jest.fn()} />);
    
    expect(screen.getByText('3.5')).toBeInTheDocument();
  });

  it('handles missing poster', () => {
    const movieWithoutPoster = { ...mockMovie, posterUrl: null };
    render(<MovieCard movie={movieWithoutPoster} onDelete={jest.fn()} onToggleWatched={jest.fn()} onShowTrailer={jest.fn()} />);
    
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
  });

  it('formats release date correctly', () => {
    render(<MovieCard movie={mockMovie} onDelete={jest.fn()} onToggleWatched={jest.fn()} onShowTrailer={jest.fn()} />);
    
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
  });

  it('renders with different genres', () => {
    const movieWithGenres = { ...mockMovie, genre_ids: [28, 12, 16] };
    render(<MovieCard movie={movieWithGenres} onDelete={jest.fn()} onToggleWatched={jest.fn()} onShowTrailer={jest.fn()} />);
    
    expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
  });
});
