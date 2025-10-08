import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('wagmi', () => ({
  useAccount: () => ({ isConnected: true, address: '0xabc' }),
}));

// Some transitive deps import Farcaster Miniapp SDK in ESM form; mock it to avoid loader issues in Node
vi.mock('@farcaster/miniapp-sdk', () => ({ default: {} }));

// Mock OnchainKit wallet module to avoid pulling transitive Farcaster deps
vi.mock('@coinbase/onchainkit/wallet', () => ({
  ConnectWallet: () => null,
}));

// Fully stub the base OnchainKit package in case subpaths re-export from the root
vi.mock('@coinbase/onchainkit', () => ({ default: {} }));

// Stub CSS import explicitly to avoid any plugin/path resolution
vi.mock('@coinbase/onchainkit/styles.css', () => ({}));

// Stub ClaimRewardsButton to avoid pulling wagmi write/receipt hooks
vi.mock('../ClaimRewardsButton', () => ({ default: () => null }));

// Mock Earn and useMorphoVault with stable returns keyed by vault address
vi.mock('@coinbase/onchainkit/earn', () => {
  const USDC = '0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F';
  const CBBTC = '0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9';
  const WETH = '0x21e0d366272798da3A977FEBA699FCB91959d120';
  return {
    Earn: () => null,
    useMorphoVault: ({ vaultAddress }: { vaultAddress: string }) => {
      if (vaultAddress === USDC) return { balance: '100', totalApy: 12, asset: { decimals: 6 } };
      if (vaultAddress === CBBTC) return { balance: '1', totalApy: 5, asset: { decimals: 8 } };
      if (vaultAddress === WETH) return { balance: '2', totalApy: 4, asset: { decimals: 18 } };
      return { balance: '0', totalApy: 0, asset: { decimals: 18 } };
    },
  };
});

vi.mock('../../hooks/useTokenPrices', () => ({
  useTokenPrices: () => ({ usdc: 1, cbbtc: 70000, weth: 3000, isLoading: false }),
}));

vi.mock('../../hooks/useVaultHistory', () => ({
  useVaultHistory: (_vault: string, _addr: string, usd: number) => ({
    netDeposits: usd * 0.8,
    interestEarned: usd * 0.2,
  }),
}));

describe('SimpleDashboard', () => {
  beforeEach(() => {
    vi.resetModules();
  });
  it('renders totals based on mocked balances and prices', async () => {
    const { default: SimpleDashboard } = await import('../SimpleDashboard');
    render(<SimpleDashboard />);

    // Balances in USD: USDC(100*1)=100, cbBTC(1*70000)=70000, WETH(2*3000)=6000
    // Total: 76100

    // Portfolio cards: we check presence and a couple key formatted values
    expect(screen.getByText('Portfolio Overview')).toBeInTheDocument();
    // Current Balance appears in two places; assert formatted dollar string exists
    expect(screen.getAllByText('$76,100.00')[0]).toBeInTheDocument();

    // Total Interest Earned is 20% of each vault's USD via mocked hook
    expect(screen.getByText('$15,220.00')).toBeInTheDocument();

    // Expected Monthly Interest = projectedAnnualReturn/12 using totalApy per vault
    // projected: 100*0.12 + 70000*0.05 + 6000*0.04 = 12 + 3500 + 240 = 3752
    // monthly: 3752/12 = 312.666... -> $312.67
    expect(screen.getByText('$312.67')).toBeInTheDocument();
  });

  it('hides portfolio when not connected', async () => {
    vi.doMock('wagmi', () => ({ useAccount: () => ({ isConnected: false, address: undefined }) }));
    const { default: DisconnectedDashboard } = await import('../SimpleDashboard');
    render(<DisconnectedDashboard />);
    expect(screen.queryByText('Portfolio Overview')).toBeNull();
  });
});


