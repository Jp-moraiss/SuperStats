import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroVideoOverlay from '../HeroVideoOverlay';

// Mock HTMLVideoElement
const mockVideo = {
  currentTime: 0,
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  load: jest.fn(),
};

Object.defineProperty(HTMLVideoElement.prototype, 'play', {
  value: mockVideo.play,
  writable: true,
});

Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
  value: mockVideo.pause,
  writable: true,
});

Object.defineProperty(HTMLVideoElement.prototype, 'load', {
  value: mockVideo.load,
  writable: true,
});

Object.defineProperty(HTMLVideoElement.prototype, 'currentTime', {
  value: 0,
  writable: true,
});

describe('HeroVideoOverlay', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when hero is provided', () => {
    render(<HeroVideoOverlay hero="batman" onClose={mockOnClose} />);
    
    expect(screen.getByText('Clique para fechar')).toBeInTheDocument();
  });

  it('does not render when hero is null', () => {
    render(<HeroVideoOverlay hero={null} onClose={mockOnClose} />);
    
    expect(screen.queryByText('Clique para fechar')).not.toBeInTheDocument();
  });

  it('renders correct video source for batman', () => {
    render(<HeroVideoOverlay hero="batman" onClose={mockOnClose} />);
    
    const video = document.querySelector('video');
    expect(video).toHaveAttribute('src', 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/batman.mp4');
  });

  it('renders correct video source for spiderman', () => {
    render(<HeroVideoOverlay hero="spiderman" onClose={mockOnClose} />);
    
    const video = document.querySelector('video');
    expect(video).toHaveAttribute('src', 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/spiderman.mp4');
  });

  it('renders correct video source for superman', () => {
    render(<HeroVideoOverlay hero="superman" onClose={mockOnClose} />);
    
    const video = document.querySelector('video');
    expect(video).toHaveAttribute('src', 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/superman.mp4');
  });

  it('renders correct video source for avengers', () => {
    render(<HeroVideoOverlay hero="avengers" onClose={mockOnClose} />);
    
    const video = document.querySelector('video');
    expect(video).toHaveAttribute('src', 'https://cnhmrnnhplpomdszzpxn.supabase.co/storage/v1/object/public/videos/avengers.mp4');
  });

  it('calls onClose when overlay is clicked', () => {
    render(<HeroVideoOverlay hero="batman" onClose={mockOnClose} />);
    
    const overlay = screen.getByText('Clique para fechar').closest('div');
    fireEvent.click(overlay!);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when video ends', () => {
    render(<HeroVideoOverlay hero="batman" onClose={mockOnClose} />);
    
    const video = document.querySelector('video');
    fireEvent.ended(video!);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('has correct video attributes', () => {
    render(<HeroVideoOverlay hero="batman" onClose={mockOnClose} />);
    
    const video = document.querySelector('video');
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('src');
  });

  it('plays video when hero changes', () => {
    const { rerender } = render(<HeroVideoOverlay hero="batman" onClose={mockOnClose} />);
    
    expect(mockVideo.play).toHaveBeenCalled();
    
    rerender(<HeroVideoOverlay hero="spiderman" onClose={mockOnClose} />);
    
    expect(mockVideo.play).toHaveBeenCalledTimes(2);
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<HeroVideoOverlay hero="batman" onClose={mockOnClose} />);
    
    expect(container.firstChild).toHaveClass('heroVideoOverlay');
    expect(container.querySelector('video')).toHaveClass('heroVideo');
    expect(container.querySelector('.closeHint')).toHaveClass('closeHint');
  });
});
