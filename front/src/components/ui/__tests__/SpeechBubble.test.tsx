import React from 'react';
import { render, screen } from '@testing-library/react';
import SpeechBubble from '../SpeechBubble';

describe('SpeechBubble', () => {
  it('renders children correctly', () => {
    render(<SpeechBubble type="speech">Hello World</SpeechBubble>);
    
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies speech type class', () => {
    const { container } = render(<SpeechBubble type="speech">Test</SpeechBubble>);
    
    expect(container.firstChild).toHaveClass('bubble', 'speech');
  });

  it('applies electric type class', () => {
    const { container } = render(<SpeechBubble type="electric">Test</SpeechBubble>);
    
    expect(container.firstChild).toHaveClass('bubble', 'electric');
  });

  it('applies thought type class', () => {
    const { container } = render(<SpeechBubble type="thought">Test</SpeechBubble>);
    
    expect(container.firstChild).toHaveClass('bubble', 'thought');
  });

  it('renders with different types', () => {
    const types = ['speech', 'electric', 'thought'];
    
    types.forEach(type => {
      const { container } = render(<SpeechBubble type={type as 'speech' | 'electric' | 'thought'}>Test</SpeechBubble>);
      expect(container.firstChild).toHaveClass('bubble', type);
    });
  });

  it('handles empty children', () => {
    render(<SpeechBubble type="speech"></SpeechBubble>);
    
    const bubble = screen.getByRole('generic');
    expect(bubble).toBeInTheDocument();
  });

  it('handles multiple children', () => {
    render(
      <SpeechBubble type="speech">
        <span>First</span>
        <span>Second</span>
      </SpeechBubble>
    );
    
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('renders with correct structure', () => {
    const { container } = render(<SpeechBubble type="speech">Test</SpeechBubble>);
    
    expect(container.firstChild).toHaveClass('bubble', 'speech');
  });
});
