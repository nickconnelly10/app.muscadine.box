'use server';

import { setOnchainKitConfig } from '@coinbase/onchainkit';
import { getPortfolios } from '@coinbase/onchainkit/api';

export type UiToken = {
  address: `0x${string}`;
  symbol: string;
  name: string;
  image?: string;
  decimals: number;
  chainId: number;
  cryptoBalance: string | number;
  fiatBalance: number;
};

export type UiPortfolio = {
  address: string;
  totalUsd: number;
  tokens: UiToken[];
};

export async function fetchPortfolio(address: `0x${string}`): Promise<UiPortfolio> {
  setOnchainKitConfig({ apiKey: process.env.ONCHAINKIT_API_KEY! }); // server-side secret
  const res = await getPortfolios({ addresses: [address] });

  // Handle both success and error responses
  if ('portfolios' in res) {
    const p = res.portfolios?.[0];
    const tokens: UiToken[] = (p?.tokenBalances ?? [])
      .filter(t => (t.fiatBalance ?? 0) > 0 || Number(t.cryptoBalance) > 0) // hide dust if you want
      .map(t => ({
        address: t.address as `0x${string}`,
        symbol: t.symbol || 'UNKNOWN',
        name: t.name || 'Unknown Token',
        image: t.image || undefined,
        decimals: t.decimals || 18,
        chainId: t.chainId || 8453, // Base chain ID
        cryptoBalance: t.cryptoBalance || '0',
        fiatBalance: t.fiatBalance || 0,
      }))
      .sort((a, b) => (b.fiatBalance ?? 0) - (a.fiatBalance ?? 0));
    
    return {
      address,
      totalUsd: p?.portfolioBalanceInUsd ?? 0,
      tokens,
    };
  } else {
    // Handle API error case
    console.error('Portfolio API error:', res);
    return {
      address,
      totalUsd: 0,
      tokens: [],
    };
  }
}
