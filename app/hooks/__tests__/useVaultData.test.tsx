import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTokenPrices, useVaultBalances } from '../useVaultData';
import type { Address } from 'viem';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

vi.mock('wagmi', () => ({
  useAccount: () => ({ address: '0xabc' as Address, isConnected: true }),
  useBalance: vi.fn().mockReturnValue({ data: { value: 0n }, isLoading: false }),
  useReadContract: vi.fn(),
}));

describe('useVaultData hooks', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('useTokenPrices maps CoinGecko response with fallbacks', async () => {
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ bitcoin: { usd: 70000 }, ethereum: { usd: 3000 } }),
    } as unknown as Response);

    const { result } = renderHook(() => useTokenPrices(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ USDC: 1, cbBTC: 70000, ETH: 3000 });

    global.fetch = originalFetch as typeof fetch;
  });

  it('useVaultBalances computes usd values and interest correctly', async () => {
    const { useReadContract } = await import('wagmi');

    // Vault configs
    const vaults = {
      usdc: { address: '0xusdc' as Address, name: 'USDC', symbol: 'USDC', description: '', decimals: 6, price: 1, tokenAddress: '', tokenName: 'USDC', tokenSymbol: 'USDC' },
      cbbtc: { address: '0xcbbtc' as Address, name: 'cbBTC', symbol: 'cbBTC', description: '', decimals: 8, price: 70000, tokenAddress: '', tokenName: 'cbBTC', tokenSymbol: 'cbBTC' },
      eth: { address: '0xeth' as Address, name: 'ETH', symbol: 'ETH', description: '', decimals: 18, price: 3000, tokenAddress: '', tokenName: 'ETH', tokenSymbol: 'ETH' },
    } as const;

    const tokenPrices = { USDC: 1, cbBTC: 70000, ETH: 3000 };

    // Mock sequence of useReadContract calls in hook order
    // balanceOf usdc, cbbtc, eth
    // convertToAssets usdc, cbbtc, eth
    // totalAssets/totalSupply for each
    (useReadContract as unknown as vi.Mock).mockReturnValueOnce({ data: 1_500_000n, isLoading: false }) // usdc shares: 1.5
      .mockReturnValueOnce({ data: 100_000_000n, isLoading: false }) // cbbtc shares: 1
      .mockReturnValueOnce({ data: 2_000_000_000_000_000_000n, isLoading: false }) // eth shares: 2
      .mockReturnValueOnce({ data: 1_500_000n, isLoading: false }) // usdc convertToAssets -> 1.5 assets
      .mockReturnValueOnce({ data: 100_000_000n, isLoading: false }) // cbbtc convertToAssets -> 1 asset
      .mockReturnValueOnce({ data: 2_000_000_000_000_000_000n, isLoading: false }) // eth convertToAssets -> 2 assets
      .mockReturnValueOnce({ data: 1_650_000n, isLoading: false }) // usdc totalAssets
      .mockReturnValueOnce({ data: 1_500_000n, isLoading: false }) // usdc totalSupply -> share price 1.1
      .mockReturnValueOnce({ data: 110_000_000n, isLoading: false }) // cbbtc totalAssets
      .mockReturnValueOnce({ data: 100_000_000n, isLoading: false }) // cbbtc totalSupply -> share price 1.1
      .mockReturnValueOnce({ data: 2_200_000_000_000_000_000n, isLoading: false }) // eth totalAssets
      .mockReturnValueOnce({ data: 2_000_000_000_000_000_000n, isLoading: false }); // eth totalSupply -> share price 1.1

    const { result } = renderHook(() => useVaultBalances(vaults as typeof vaults, tokenPrices), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const { vaultBalances } = result.current;
    // Each currentValue equals assets; usd multiplied by token price
    expect(vaultBalances.map(v => v.usdValue)).toEqual([1.5 * 1, 1 * 70000, 2 * 3000]);
    // Interest: shares * (sharePrice - 1) => shares * 0.1
    // USDC: 1.5 * 0.1 = 0.15 (usd same as token price 1)
    // cbBTC: 1 * 0.1 = 0.1 tokens -> interestUsd = 0.1 * 70000 = 7000
    // ETH: 2 * 0.1 = 0.2 tokens -> interestUsd = 0.2 * 3000 = 600
    const interestUsd = vaultBalances.map(v => Number(v.interestUsd.toFixed ? v.interestUsd.toFixed(0) : v.interestUsd));
    expect(interestUsd).toEqual([0, 7000, 600]);
  });
});


