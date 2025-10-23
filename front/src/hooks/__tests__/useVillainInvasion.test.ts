import { renderHook, act } from '@testing-library/react';
import { useVillainInvasion } from '../useVillainInvasion';

describe('useVillainInvasion', () => {
  const mockPlayAudio = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useVillainInvasion({
      isLoggedIn: false,
      selectedAffiliation: 'all',
      playAudio: mockPlayAudio
    }));

    expect(result.current.villainInvasion).toBe(false);
    expect(result.current.showVillains).toBe(false);
  });

  it('should not trigger invasion for non-logged in users', () => {
    renderHook(() => useVillainInvasion({
      isLoggedIn: false,
      selectedAffiliation: 'dc',
      playAudio: mockPlayAudio
    }));

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(mockPlayAudio).not.toHaveBeenCalled();
  });

  it('should not trigger invasion for "all" affiliation', () => {
    renderHook(() => useVillainInvasion({
      isLoggedIn: true,
      selectedAffiliation: 'all',
      playAudio: mockPlayAudio
    }));

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(mockPlayAudio).not.toHaveBeenCalled();
  });

  it('should trigger DC villain invasion after 60 seconds', async () => {
    mockPlayAudio.mockResolvedValue(true);

    const { result } = renderHook(() => useVillainInvasion({
      isLoggedIn: true,
      selectedAffiliation: 'dc',
      playAudio: mockPlayAudio
    }));

    // Wait for the useEffect to set up the timer
    await act(async () => {
      await Promise.resolve();
    });

    // Fast-forward time to trigger invasion
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    // Wait for the async operations to complete
    await act(async () => {
      await Promise.resolve();
    });

    expect(mockPlayAudio).toHaveBeenCalledWith('villainLaugh');
    expect(result.current.villainInvasion).toBe(true);

    // Fast-forward to end of invasion
    act(() => {
      jest.advanceTimersByTime(5500);
    });

    expect(result.current.villainInvasion).toBe(false);
    expect(result.current.showVillains).toBe(true);
  });

  it('should trigger Marvel villain invasion after 60 seconds', async () => {
    mockPlayAudio.mockResolvedValue(true);

    const { result } = renderHook(() => useVillainInvasion({
      isLoggedIn: true,
      selectedAffiliation: 'marvel',
      playAudio: mockPlayAudio
    }));

    // Wait for the useEffect to set up the timer
    await act(async () => {
      await Promise.resolve();
    });

    // Fast-forward time to trigger invasion
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    await act(async () => {
      await Promise.resolve(); // Wait for async operations
    });

    expect(mockPlayAudio).toHaveBeenCalledWith('thanosSnap');
    expect(result.current.villainInvasion).toBe(true);
  });

  it('should handle audio play failure gracefully', async () => {
    mockPlayAudio.mockResolvedValue(false);

    const { result } = renderHook(() => useVillainInvasion({
      isLoggedIn: true,
      selectedAffiliation: 'dc',
      playAudio: mockPlayAudio
    }));

    // Wait for the useEffect to set up the timer
    await act(async () => {
      await Promise.resolve();
    });

    // Fast-forward time to trigger invasion
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    await act(async () => {
      await Promise.resolve(); // Wait for async operations
    });

    expect(mockPlayAudio).toHaveBeenCalledWith('villainLaugh');
    expect(result.current.villainInvasion).toBe(true);

    // Should still show villains even if audio fails
    act(() => {
      jest.advanceTimersByTime(5500);
    });

    expect(result.current.showVillains).toBe(true);
  });

  it('should handle audio play error gracefully', async () => {
    mockPlayAudio.mockRejectedValue(new Error('Audio failed'));

    const { result } = renderHook(() => useVillainInvasion({
      isLoggedIn: true,
      selectedAffiliation: 'dc',
      playAudio: mockPlayAudio
    }));

    // Wait for the useEffect to set up the timer
    await act(async () => {
      await Promise.resolve();
    });

    // Fast-forward time to trigger invasion
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    await act(async () => {
      await Promise.resolve(); // Wait for async operations
    });

    expect(mockPlayAudio).toHaveBeenCalledWith('villainLaugh');
    expect(result.current.villainInvasion).toBe(false);
    expect(result.current.showVillains).toBe(true);
  });
});
