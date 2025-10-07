"use client";
import { useQuery } from '@tanstack/react-query';
import { useAccount, useReadContract, useBalance } from "wagmi";
import { base } from "wagmi/chains";
import { formatUnits } from "viem";

interface TokenPrices {
  USDC: number;
  cbBTC: number;
  ETH: number;
}

interface VaultConfig {
  address: string;
  name: string;
  symbol: string;
  description: string;
  decimals: number;
  price: number;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
}

interface VaultBalance {
  vault: VaultConfig;
  balance: number;
  formatted: string;
  usdValue: number;
  interest: number;
  interestUsd: number;
}

// Custom hook for fetching token prices
export function useTokenPrices() {
  return useQuery<TokenPrices>({
    queryKey: ['tokenPrices'],
    queryFn: async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
      const data = await response.json();
      
      return {
        USDC: 1.00,
        cbBTC: data.bitcoin?.usd || 65000,
        ETH: data.ethereum?.usd || 3500,
      };
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Custom hook for vault balances
export function useVaultBalances(vaults: Record<string, VaultConfig>, tokenPrices: TokenPrices) {
  const { address, isConnected } = useAccount();

  // Get wallet balances
  const usdcWalletBalance = useBalance({
    address: address,
    token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const cbbtcWalletBalance = useBalance({
    address: address,
    token: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const wethWalletBalance = useBalance({
    address: address,
    token: '0x4200000000000000000000000000000000000006',
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const ethWalletBalance = useBalance({
    address: address,
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  // Get vault balances
  const usdcVaultBalance = useReadContract({
    address: vaults.usdc.address as `0x${string}`,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
      {
        name: 'convertToAssets',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'shares', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const cbbtcVaultBalance = useReadContract({
    address: vaults.cbbtc.address as `0x${string}`,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
      {
        name: 'convertToAssets',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'shares', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const ethVaultBalance = useReadContract({
    address: vaults.eth.address as `0x${string}`,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
      {
        name: 'convertToAssets',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'shares', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Get convertToAssets calls
  const usdcConvertToAssets = useReadContract({
    address: vaults.usdc.address as `0x${string}`,
    abi: [
      {
        name: 'convertToAssets',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'shares', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'convertToAssets',
    args: usdcVaultBalance.data ? [usdcVaultBalance.data] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected && !!usdcVaultBalance.data,
    },
  });

  const cbbtcConvertToAssets = useReadContract({
    address: vaults.cbbtc.address as `0x${string}`,
    abi: [
      {
        name: 'convertToAssets',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'shares', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'convertToAssets',
    args: cbbtcVaultBalance.data ? [cbbtcVaultBalance.data] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected && !!cbbtcVaultBalance.data,
    },
  });

  const ethConvertToAssets = useReadContract({
    address: vaults.eth.address as `0x${string}`,
    abi: [
      {
        name: 'convertToAssets',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'shares', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'convertToAssets',
    args: ethVaultBalance.data ? [ethVaultBalance.data] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected && !!ethVaultBalance.data,
    },
  });

  // Calculate vault balances
  const vaultBalances: VaultBalance[] = [];

  if (usdcVaultBalance.data && usdcConvertToAssets.data) {
    const currentValue = parseFloat(formatUnits(usdcConvertToAssets.data, vaults.usdc.decimals));
    const usdValue = currentValue * tokenPrices.USDC;
    const estimatedInterest = currentValue * 0.05; // 5% APY estimate
    const interestUsd = estimatedInterest * tokenPrices.USDC;

    vaultBalances.push({
      vault: vaults.usdc,
      balance: currentValue,
      formatted: currentValue.toFixed(6),
      usdValue: usdValue,
      interest: estimatedInterest,
      interestUsd: interestUsd,
    });
  }

  if (cbbtcVaultBalance.data && cbbtcConvertToAssets.data) {
    const currentValue = parseFloat(formatUnits(cbbtcConvertToAssets.data, vaults.cbbtc.decimals));
    const usdValue = currentValue * tokenPrices.cbBTC;
    const estimatedInterest = currentValue * 0.05; // 5% APY estimate
    const interestUsd = estimatedInterest * tokenPrices.cbBTC;

    vaultBalances.push({
      vault: vaults.cbbtc,
      balance: currentValue,
      formatted: currentValue.toFixed(6),
      usdValue: usdValue,
      interest: estimatedInterest,
      interestUsd: interestUsd,
    });
  }

  if (ethVaultBalance.data && ethConvertToAssets.data) {
    const currentValue = parseFloat(formatUnits(ethConvertToAssets.data, vaults.eth.decimals));
    const usdValue = currentValue * tokenPrices.ETH;
    const estimatedInterest = currentValue * 0.05; // 5% APY estimate
    const interestUsd = estimatedInterest * tokenPrices.ETH;

    vaultBalances.push({
      vault: vaults.eth,
      balance: currentValue,
      formatted: currentValue.toFixed(6),
      usdValue: usdValue,
      interest: estimatedInterest,
      interestUsd: interestUsd,
    });
  }

  return {
    vaultBalances,
    walletBalances: {
      usdc: usdcWalletBalance,
      cbbtc: cbbtcWalletBalance,
      weth: wethWalletBalance,
      eth: ethWalletBalance,
    },
    isLoading: usdcVaultBalance.isLoading || cbbtcVaultBalance.isLoading || ethVaultBalance.isLoading,
    error: usdcVaultBalance.error || cbbtcVaultBalance.error || ethVaultBalance.error,
  };
}
