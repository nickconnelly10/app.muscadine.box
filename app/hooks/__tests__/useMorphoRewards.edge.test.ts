import { renderHook, waitFor } from '@testing-library/react';
import type { Address } from 'viem';
import { useMorphoRewards } from '../useMorphoRewards';

describe('useMorphoRewards edge cases', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch as typeof fetch;
    vi.restoreAllMocks();
  });

  it('handles large reward arrays without crashing', async () => {
    const largeArray = Array.from({ length: 100 }, (_, i) => ({
      claimable: `${i + 1}`,
      claimableUsd: `${i * 2}`,
      token: `0x${i}` as Address,
      symbol: `TOK${i}`,
      proof: ['0xproof'],
    }));

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rewards: largeArray }),
    } as unknown as Response);

    const { result } = renderHook(() => useMorphoRewards('0x1234' as Address));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.claimable.length).toBe(100);
    });
  });

  it('handles rewards with missing fields gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        rewards: [
          { claimable: '1', token: '0xabc' as Address }, // missing symbol, proof, claimableUsd
        ],
      }),
    } as unknown as Response);

    const { result } = renderHook(() => useMorphoRewards('0x1234' as Address));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.claimable.length).toBe(1);
      expect(result.current.claimable[0].tokenSymbol).toBe('MORPHO'); // fallback
      expect(result.current.claimable[0].proof).toEqual([]);
      expect(result.current.totalClaimableUSD).toBe(0); // parseFloat(undefined) -> 0
    });
  });

  it('stops interval on unmount', async () => {
    const clearSpy = vi.spyOn(global, 'clearInterval');
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rewards: [] }),
    } as unknown as Response);

    const { unmount } = renderHook(() => useMorphoRewards('0x1234' as Address));
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });
});

