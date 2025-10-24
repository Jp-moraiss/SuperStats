import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useAudioManager } from '../useAudioManager';

// Mock HTMLAudioElement
const mockAudioElement = {
  pause: jest.fn(),
  play: jest.fn(),
  currentTime: 0,
  paused: false,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};

// Mock React hooks with proper typing
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn((fn) => fn),
  useMemo: jest.fn((fn) => fn()),
}));

describe('useAudioManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock audio element
    mockAudioElement.pause.mockClear();
    mockAudioElement.play.mockClear();
  });

  it('should create audio refs for all heroes and villains', () => {
    const { result } = renderHook(() => useAudioManager());
    
    expect(result.current.audioRefs).toBeDefined();
    expect(Object.keys(result.current.audioRefs)).toContain('batman');
    expect(Object.keys(result.current.audioRefs)).toContain('spiderman');
    expect(Object.keys(result.current.audioRefs)).toContain('joker');
    expect(Object.keys(result.current.audioRefs)).toContain('thanos');
  });

  it('should stop all audio when stopAllAudio is called', () => {
    // Mock the audio refs to have actual elements
    const mockRefs = {
      batman: { current: mockAudioElement },
      spiderman: { current: mockAudioElement }
    };
    
    // Mock useMemo to return our mock refs
    (React.useMemo as jest.Mock).mockReturnValue(mockRefs);
    
    const { result } = renderHook(() => useAudioManager());

    act(() => {
      result.current.stopAllAudio();
    });

    // Should call pause on all audio elements
    expect(mockAudioElement.pause).toHaveBeenCalled();
  });

  it('should play audio successfully', async () => {
    mockAudioElement.play.mockResolvedValue(undefined);
    
    // Mock the audio refs to have actual elements
    const mockRefs = {
      batman: { current: mockAudioElement }
    };
    
    // Mock useMemo to return our mock refs
    (React.useMemo as jest.Mock).mockReturnValue(mockRefs);
    
    const { result } = renderHook(() => useAudioManager());
    
    let playResult: boolean = false;
    await act(async () => {
      playResult = await result.current.playAudio('batman');
    });
    
    expect(playResult).toBe(true);
    expect(mockAudioElement.play).toHaveBeenCalled();
  });

  it('should handle audio play errors', async () => {
    mockAudioElement.play.mockRejectedValue(new Error('Play failed'));
    
    const { result } = renderHook(() => useAudioManager());
    
    let playResult: boolean = true;
    await act(async () => {
      playResult = await result.current.playAudio('batman');
    });
    
    expect(playResult).toBe(false);
  });

  it('should handle missing audio ref', async () => {
    const { result } = renderHook(() => useAudioManager());
    
    let playResult: boolean = true;
    await act(async () => {
      playResult = await result.current.playAudio('nonexistent');
    });
    
    expect(playResult).toBe(false);
  });

  it('should get audio ref correctly', () => {
    const { result } = renderHook(() => useAudioManager());
    
    const audioRef = result.current.getAudioRef('batman');
    expect(audioRef).toBeDefined();
  });
});
