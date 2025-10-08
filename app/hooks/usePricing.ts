"use client";
import { useQuery } from '@tanstack/react-query';
import { getAllTokenPrices, TokenPrice } from '../services/pricingService';

export interface PricingData {
  USDC: TokenPrice;
  cbBTC: TokenPrice;
  WETH: TokenPrice;
}

/**
 * Hook to fetch and cache token prices
 * Uses the centralized pricing service
 */
export function usePricing() {
  const { data, isLoading, error, refetch } = useQuery<PricingData>({
    queryKey: ['tokenPrices'],
    queryFn: getAllTokenPrices,
    staleTime: 60 * 1000, // 60 seconds
    refetchInterval: 60 * 1000, // Refresh every 60 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return {
    prices: data || {
      USDC: { symbol: 'USDC', price: 1.0, lastUpdated: 0, source: 'fallback' as const },
      cbBTC: { symbol: 'cbBTC', price: 0, lastUpdated: 0, source: 'fallback' as const },
      WETH: { symbol: 'WETH', price: 0, lastUpdated: 0, source: 'fallback' as const },
    },
    isLoading,
    error,
    refetch,
  };
}

