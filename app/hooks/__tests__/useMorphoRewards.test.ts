import { renderHook, waitFor } from '@testing-library/react';
import type { Address } from 'viem';
import { useMorphoRewards } from '../useMorphoRewards';

describe('useMorphoRewards', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch as typeof fetch;
    vi.restoreAllMocks();
  });

  it('returns empty state when no userAddress', () => {
    const { result } = renderHook(() => useMorphoRewards(undefined));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.claimable).toEqual([]);
    expect(result.current.totalClaimableUSD).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('fetches and parses claimable rewards', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        rewards: [
          { claimable: '1.5', claimableUsd: '3', token: '0xdead' as Address, symbol: 'ABC', proof: ['0x1'] },
          { claimable: '0', claimableUsd: '0', token: '0xbeef' as Address, symbol: 'DEF', proof: [] },
        ],
      }),
    } as unknown as Response);

    const { result } = renderHook(() => useMorphoRewards('0x1234' as Address));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.claimable.length).toBe(1);
      expect(result.current.claimable[0].amount).toBe('1.5');
      expect(result.current.totalClaimableUSD).toBe(3);
      expect(result.current.error).toBeNull();
    });

    // no timers to advance when using real timers
  });

  it('handles non-ok responses as errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false } as Response);

    const { result } = renderHook(() => useMorphoRewards('0x1234' as Address));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.claimable).toEqual([]);
      expect(result.current.totalClaimableUSD).toBe(0);
      expect(result.current.error).toBeInstanceOf(Error);
    });

    // no timers to advance when using real timers
  });
});


