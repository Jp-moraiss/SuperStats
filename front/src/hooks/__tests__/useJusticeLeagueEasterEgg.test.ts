import { renderHook, act } from '@testing-library/react';
import { useJusticeLeagueEasterEgg } from '../useJusticeLeagueEasterEgg';

describe('useJusticeLeagueEasterEgg', () => {
  const mockPlayAudio = jest.fn();
  const mockStopAllAudio = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with zero click count', () => {
    const { result } = renderHook(() => useJusticeLeagueEasterEgg({
      playAudio: mockPlayAudio,
      stopAllAudio: mockStopAllAudio
    }));

    expect(result.current.justiceLeagueClickCount).toBe(0);
  });

  it('should increment click count on first two clicks', async () => {
    mockPlayAudio.mockResolvedValue(true);

    const { result } = renderHook(() => useJusticeLeagueEasterEgg({
      playAudio: mockPlayAudio,
      stopAllAudio: mockStopAllAudio
    }));

    // First click
    let easterEggActivated: boolean;
    await act(async () => {
      easterEggActivated = await result.current.handleJusticeLeagueClick();
    });

    expect(easterEggActivated).toBe(false);
    expect(result.current.justiceLeagueClickCount).toBe(1);

    // Second click
    await act(async () => {
      easterEggActivated = await result.current.handleJusticeLeagueClick();
    });

    expect(easterEggActivated).toBe(false);
    expect(result.current.justiceLeagueClickCount).toBe(2);
  });

  it('should activate easter egg on third click', async () => {
    mockPlayAudio.mockResolvedValue(true);

    const { result } = renderHook(() => useJusticeLeagueEasterEgg({
      playAudio: mockPlayAudio,
      stopAllAudio: mockStopAllAudio
    }));

    // First two clicks
    await act(async () => {
      await result.current.handleJusticeLeagueClick();
    });
    await act(async () => {
      await result.current.handleJusticeLeagueClick();
    });

    // Third click - should activate easter egg
    let easterEggActivated: boolean;
    await act(async () => {
      easterEggActivated = await result.current.handleJusticeLeagueClick();
    });

    expect(easterEggActivated).toBe(true);
    expect(mockStopAllAudio).toHaveBeenCalled();
    expect(mockPlayAudio).toHaveBeenCalledWith('justiceLeagueSpecial');
    expect(result.current.justiceLeagueClickCount).toBe(0); // Should reset
  });

  it('should handle audio play failure gracefully', async () => {
    mockPlayAudio.mockResolvedValue(false);

    const { result } = renderHook(() => useJusticeLeagueEasterEgg({
      playAudio: mockPlayAudio,
      stopAllAudio: mockStopAllAudio
    }));

    // First two clicks
    await act(async () => {
      await result.current.handleJusticeLeagueClick();
    });
    await act(async () => {
      await result.current.handleJusticeLeagueClick();
    });

    // Third click - should still activate easter egg even if audio fails
    let easterEggActivated: boolean;
    await act(async () => {
      easterEggActivated = await result.current.handleJusticeLeagueClick();
    });

    expect(easterEggActivated).toBe(true);
    expect(mockPlayAudio).toHaveBeenCalledWith('justiceLeagueSpecial');
  });

  it('should handle audio play error gracefully', async () => {
    mockPlayAudio.mockRejectedValue(new Error('Audio failed'));

    const { result } = renderHook(() => useJusticeLeagueEasterEgg({
      playAudio: mockPlayAudio,
      stopAllAudio: mockStopAllAudio
    }));

    // First two clicks
    await act(async () => {
      await result.current.handleJusticeLeagueClick();
    });
    await act(async () => {
      await result.current.handleJusticeLeagueClick();
    });

    // Third click - should handle error gracefully
    let easterEggActivated: boolean;
    await act(async () => {
      easterEggActivated = await result.current.handleJusticeLeagueClick();
    });

    expect(easterEggActivated).toBe(false); // Should return false on error
    expect(mockPlayAudio).toHaveBeenCalledWith('justiceLeagueSpecial');
  });

  it('should reset click count', () => {
    const { result } = renderHook(() => useJusticeLeagueEasterEgg({
      playAudio: mockPlayAudio,
      stopAllAudio: mockStopAllAudio
    }));

    // Simulate some clicks
    act(() => {
      result.current.handleJusticeLeagueClick();
    });
    act(() => {
      result.current.handleJusticeLeagueClick();
    });

    expect(result.current.justiceLeagueClickCount).toBe(2);

    // Reset
    act(() => {
      result.current.resetJusticeLeagueCount();
    });

    expect(result.current.justiceLeagueClickCount).toBe(0);
  });
});
