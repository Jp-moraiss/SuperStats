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

// Mock useRef
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn((initialValue) => ({
    current: initialValue,
  })),
  useCallback: jest.fn((fn) => fn),
  useMemo: jest.fn((fn) => fn()),
}));

describe('useAudioManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock useRef to return mock audio elements
    (jest.requireActual('react').useRef as jest.Mock).mockImplementation(() => ({
      current: mockAudioElement,
    }));
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
    const { result } = renderHook(() => useAudioManager());
    
    act(() => {
      result.current.stopAllAudio();
    });
    
    // Should call pause on all audio elements
    expect(mockAudioElement.pause).toHaveBeenCalled();
  });

  it('should play audio successfully', async () => {
    mockAudioElement.play.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useAudioManager());
    
    let playResult: boolean;
    await act(async () => {
      playResult = await result.current.playAudio('batman');
    });
    
    expect(playResult).toBe(true);
    expect(mockAudioElement.play).toHaveBeenCalled();
  });

  it('should handle audio play errors', async () => {
    mockAudioElement.play.mockRejectedValue(new Error('Play failed'));
    
    const { result } = renderHook(() => useAudioManager());
    
    let playResult: boolean;
    await act(async () => {
      playResult = await result.current.playAudio('batman');
    });
    
    expect(playResult).toBe(false);
  });

  it('should handle missing audio ref', async () => {
    // Mock useRef to return null for missing audio
    (jest.requireActual('react').useRef as jest.Mock).mockImplementation(() => ({
      current: null,
    }));
    
    const { result } = renderHook(() => useAudioManager());
    
    let playResult: boolean;
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
