import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TrailerModal } from '../../../features/movies';

describe('TrailerModal', () => {
  const mockTrailerUrl = 'https://www.youtube.com/embed/abc123';

  it('renders when trailerUrl is provided', () => {
    render(<TrailerModal trailerUrl={mockTrailerUrl} onClose={jest.fn()} />);
    
    expect(screen.getByTitle('YouTube video player')).toBeInTheDocument();
  });

  it('renders iframe with correct src', () => {
    render(<TrailerModal trailerUrl={mockTrailerUrl} onClose={jest.fn()} />);
    
    const iframe = screen.getByTitle('YouTube video player');
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/abc123');
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<TrailerModal trailerUrl={mockTrailerUrl} onClose={handleClose} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const handleClose = jest.fn();
    render(<TrailerModal trailerUrl={mockTrailerUrl} onClose={handleClose} />);
    
    const modalOverlay = document.querySelector('.modalOverlay');
    if (modalOverlay) {
      fireEvent.click(modalOverlay);
    }
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders iframe with correct attributes', () => {
    render(<TrailerModal trailerUrl={mockTrailerUrl} onClose={jest.fn()} />);
    
    const iframe = screen.getByTitle('YouTube video player');
    expect(iframe).toHaveAttribute('allowfullscreen');
  });

  it('renders modal with correct structure', () => {
    render(<TrailerModal trailerUrl={mockTrailerUrl} onClose={jest.fn()} />);
    
    expect(screen.getByTitle('YouTube video player')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <TrailerModal trailerUrl={mockTrailerUrl} onClose={jest.fn()} />
    );
    
    expect(container.firstChild).toHaveClass('modalOverlay');
  });

  it('handles different trailer URLs', () => {
    const differentUrl = 'https://www.youtube.com/embed/xyz789';
    render(<TrailerModal trailerUrl={differentUrl} onClose={jest.fn()} />);
    
    const iframe = screen.getByTitle('YouTube video player');
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/xyz789');
  });
});
