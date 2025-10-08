"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { base } from 'wagmi/chains';
import { useMorphoVault } from '@coinbase/onchainkit/earn';
import { usePricing, PricingData } from '../hooks/usePricing';
import { TOKEN_ADDRESSES } from '../services/pricingService';

// Vault configurations
export const VAULTS = [
  {
    address: '0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F' as `0x${string}`,
    name: 'Muscadine USDC Vault',
    symbol: 'USDC',
    underlying: 'USDC',
  },
  {
    address: '0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9' as `0x${string}`,
    name: 'Muscadine cbBTC Vault',
    symbol: 'cbBTC',
    underlying: 'cbBTC',
  },
  {
    address: '0x21e0d366272798da3A977FEBA699FCB91959d120' as `0x${string}`,
    name: 'Muscadine WETH Vault',
    symbol: 'WETH',
    underlying: 'WETH',
  },
] as const;

export interface WalletBalance {
  symbol: string;
  balance: number;
  formattedBalance: string;
  usdValue: number;
  tokenAddress: string;
}

export interface VaultPosition {
  vaultAddress: string;
  name: string;
  symbol: string;
  underlying: string;
  balance: number;
  usdValue: number;
  apy: number;
  depositedAmount?: number;
  earnedInterest?: number;
}

interface PortfolioContextValue {
  // Wallet connection
  address: `0x${string}` | undefined;
  isConnected: boolean;
  chainId: number | undefined;
  
  // Pricing
  prices: PricingData;
  pricesLoading: boolean;
  pricesError: Error | null;
  
  // Wallet balances
  walletBalances: WalletBalance[];
  walletBalancesLoading: boolean;
  
  // Vault positions
  vaultPositions: VaultPosition[];
  vaultPositionsLoading: boolean;
  
  // Portfolio totals
  totalWalletValue: number;
  totalVaultValue: number;
  totalPortfolioValue: number;
}

const PortfolioContext = createContext<PortfolioContextValue | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { address, isConnected, chainId } = useAccount();
  const { prices, isLoading: pricesLoading, error: pricesError } = usePricing();
  
  // Fetch wallet balances for all tokens
  const usdcBalance = useBalance({
    address,
    token: TOKEN_ADDRESSES.USDC,
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const cbBTCBalance = useBalance({
    address,
    token: TOKEN_ADDRESSES.cbBTC,
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const wethBalance = useBalance({
    address,
    token: TOKEN_ADDRESSES.WETH,
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const ethBalance = useBalance({
    address,
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  // Fetch vault positions
  const usdcVault = useMorphoVault({
    vaultAddress: VAULTS[0].address,
    recipientAddress: address
  });

  const cbbtcVault = useMorphoVault({
    vaultAddress: VAULTS[1].address,
    recipientAddress: address
  });

  const wethVault = useMorphoVault({
    vaultAddress: VAULTS[2].address,
    recipientAddress: address
  });

  // Helper to convert balance to number
  const getBalanceNumber = (balance: string | number | undefined): number => {
    if (!balance) return 0;
    return typeof balance === 'string' ? parseFloat(balance) : balance;
  };

  // Build wallet balances
  const walletBalances: WalletBalance[] = [];
  
  if (usdcBalance.data) {
    const balance = getBalanceNumber(usdcBalance.data.formatted);
    walletBalances.push({
      symbol: 'USDC',
      balance,
      formattedBalance: usdcBalance.data.formatted,
      usdValue: balance * prices.USDC.price,
      tokenAddress: TOKEN_ADDRESSES.USDC,
    });
  }

  if (cbBTCBalance.data) {
    const balance = getBalanceNumber(cbBTCBalance.data.formatted);
    walletBalances.push({
      symbol: 'cbBTC',
      balance,
      formattedBalance: cbBTCBalance.data.formatted,
      usdValue: balance * prices.cbBTC.price,
      tokenAddress: TOKEN_ADDRESSES.cbBTC,
    });
  }

  if (wethBalance.data) {
    const balance = getBalanceNumber(wethBalance.data.formatted);
    walletBalances.push({
      symbol: 'WETH',
      balance,
      formattedBalance: wethBalance.data.formatted,
      usdValue: balance * prices.WETH.price,
      tokenAddress: TOKEN_ADDRESSES.WETH,
    });
  }

  if (ethBalance.data) {
    const balance = getBalanceNumber(ethBalance.data.formatted);
    walletBalances.push({
      symbol: 'ETH',
      balance,
      formattedBalance: ethBalance.data.formatted,
      usdValue: balance * prices.WETH.price, // ETH and WETH same price
      tokenAddress: '0x0000000000000000000000000000000000000000',
    });
  }

  // Build vault positions
  const vaultPositions: VaultPosition[] = [];

  const vaults = [
    { vault: usdcVault, config: VAULTS[0], price: prices.USDC },
    { vault: cbbtcVault, config: VAULTS[1], price: prices.cbBTC },
    { vault: wethVault, config: VAULTS[2], price: prices.WETH },
  ];

  for (const { vault, config, price } of vaults) {
    const balance = getBalanceNumber(vault.balance);
    if (balance > 0 || isConnected) {
      vaultPositions.push({
        vaultAddress: config.address,
        name: config.name,
        symbol: config.symbol,
        underlying: config.underlying,
        balance,
        usdValue: balance * price.price,
        apy: vault.totalApy || 0,
      });
    }
  }

  // Calculate totals
  const totalWalletValue = walletBalances.reduce((sum, bal) => sum + bal.usdValue, 0);
  const totalVaultValue = vaultPositions.reduce((sum, pos) => sum + pos.usdValue, 0);
  const totalPortfolioValue = totalWalletValue + totalVaultValue;

  const walletBalancesLoading = 
    usdcBalance.isLoading || 
    cbBTCBalance.isLoading || 
    wethBalance.isLoading || 
    ethBalance.isLoading;

  const vaultPositionsLoading = !usdcVault.balance && !cbbtcVault.balance && !wethVault.balance;

  const value: PortfolioContextValue = {
    address,
    isConnected,
    chainId,
    prices,
    pricesLoading,
    pricesError: pricesError as Error | null,
    walletBalances,
    walletBalancesLoading,
    vaultPositions,
    vaultPositionsLoading,
    totalWalletValue,
    totalVaultValue,
    totalPortfolioValue,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
}

