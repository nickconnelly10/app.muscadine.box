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

  // Define vault ABI with all necessary functions
  const vaultAbi = [
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
    {
      name: 'totalAssets',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: '', type: 'uint256' }],
    },
    {
      name: 'totalSupply',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: '', type: 'uint256' }],
    },
  ] as const;

  // Get vault balances
  const usdcVaultBalance = useReadContract({
    address: vaults.usdc.address as `0x${string}`,
    abi: vaultAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const cbbtcVaultBalance = useReadContract({
    address: vaults.cbbtc.address as `0x${string}`,
    abi: vaultAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const ethVaultBalance = useReadContract({
    address: vaults.eth.address as `0x${string}`,
    abi: vaultAbi,
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
    abi: vaultAbi,
    functionName: 'convertToAssets',
    args: usdcVaultBalance.data ? [usdcVaultBalance.data] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected && !!usdcVaultBalance.data,
    },
  });

  const cbbtcConvertToAssets = useReadContract({
    address: vaults.cbbtc.address as `0x${string}`,
    abi: vaultAbi,
    functionName: 'convertToAssets',
    args: cbbtcVaultBalance.data ? [cbbtcVaultBalance.data] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected && !!cbbtcVaultBalance.data,
    },
  });

  const ethConvertToAssets = useReadContract({
    address: vaults.eth.address as `0x${string}`,
    abi: vaultAbi,
    functionName: 'convertToAssets',
    args: ethVaultBalance.data ? [ethVaultBalance.data] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected && !!ethVaultBalance.data,
    },
  });

  // Get totalAssets and totalSupply for share price calculation
  const usdcTotalAssets = useReadContract({
    address: vaults.usdc.address as `0x${string}`,
    abi: vaultAbi,
    functionName: 'totalAssets',
    chainId: base.id,
    query: { enabled: isConnected }
  });

  const usdcTotalSupply = useReadContract({
    address: vaults.usdc.address as `0x${string}`,
    abi: vaultAbi,
    functionName: 'totalSupply',
    chainId: base.id,
    query: { enabled: isConnected }
  });

  const cbbtcTotalAssets = useReadContract({
    address: vaults.cbbtc.address as `0x${string}`,
    abi: vaultAbi,
    functionName: 'totalAssets',
    chainId: base.id,
    query: { enabled: isConnected }
  });

  const cbbtcTotalSupply = useReadContract({
    address: vaults.cbbtc.address as `0x${string}`,
    abi: vaultAbi,
    functionName: 'totalSupply',
    chainId: base.id,
    query: { enabled: isConnected }
  });

  const ethTotalAssets = useReadContract({
    address: vaults.eth.address as `0x${string}`,
    abi: vaultAbi,
    functionName: 'totalAssets',
    chainId: base.id,
    query: { enabled: isConnected }
  });

  const ethTotalSupply = useReadContract({
    address: vaults.eth.address as `0x${string}`,
    abi: vaultAbi,
    functionName: 'totalSupply',
    chainId: base.id,
    query: { enabled: isConnected }
  });

  // Calculate vault balances with corrected interest calculation
  const vaultBalances: VaultBalance[] = [];

  if (usdcVaultBalance.data && usdcConvertToAssets.data && usdcTotalAssets.data && usdcTotalSupply.data) {
    const sharesAmount = parseFloat(formatUnits(usdcVaultBalance.data, vaults.usdc.decimals));
    const currentValue = parseFloat(formatUnits(usdcConvertToAssets.data, vaults.usdc.decimals));
    const usdValue = currentValue * tokenPrices.USDC;
    
    // Calculate vault share price from totalAssets / totalSupply
    const totalAssets = parseFloat(formatUnits(usdcTotalAssets.data, vaults.usdc.decimals));
    const totalSupply = parseFloat(formatUnits(usdcTotalSupply.data, vaults.usdc.decimals));
    const vaultSharePrice = totalSupply > 0 ? totalAssets / totalSupply : 1.0;
    
    // Interest = shares * (sharePrice - 1.0)
    // This assumes user deposited when share price was ~1.0
    const actualInterest = sharesAmount * Math.max(0, vaultSharePrice - 1.0);
    const interestUsd = actualInterest * tokenPrices.USDC;

    vaultBalances.push({
      vault: vaults.usdc,
      balance: currentValue,
      formatted: currentValue.toFixed(6),
      usdValue: usdValue,
      interest: actualInterest,
      interestUsd: interestUsd,
    });
  }

  if (cbbtcVaultBalance.data && cbbtcConvertToAssets.data && cbbtcTotalAssets.data && cbbtcTotalSupply.data) {
    const sharesAmount = parseFloat(formatUnits(cbbtcVaultBalance.data, vaults.cbbtc.decimals));
    const currentValue = parseFloat(formatUnits(cbbtcConvertToAssets.data, vaults.cbbtc.decimals));
    const usdValue = currentValue * tokenPrices.cbBTC;
    
    // Calculate vault share price from totalAssets / totalSupply
    const totalAssets = parseFloat(formatUnits(cbbtcTotalAssets.data, vaults.cbbtc.decimals));
    const totalSupply = parseFloat(formatUnits(cbbtcTotalSupply.data, vaults.cbbtc.decimals));
    const vaultSharePrice = totalSupply > 0 ? totalAssets / totalSupply : 1.0;
    
    const actualInterest = sharesAmount * Math.max(0, vaultSharePrice - 1.0);
    const interestUsd = actualInterest * tokenPrices.cbBTC;

    vaultBalances.push({
      vault: vaults.cbbtc,
      balance: currentValue,
      formatted: currentValue.toFixed(6),
      usdValue: usdValue,
      interest: actualInterest,
      interestUsd: interestUsd,
    });
  }

  if (ethVaultBalance.data && ethConvertToAssets.data && ethTotalAssets.data && ethTotalSupply.data) {
    const sharesAmount = parseFloat(formatUnits(ethVaultBalance.data, vaults.eth.decimals));
    const currentValue = parseFloat(formatUnits(ethConvertToAssets.data, vaults.eth.decimals));
    const usdValue = currentValue * tokenPrices.ETH;
    
    // Calculate vault share price from totalAssets / totalSupply
    const totalAssets = parseFloat(formatUnits(ethTotalAssets.data, vaults.eth.decimals));
    const totalSupply = parseFloat(formatUnits(ethTotalSupply.data, vaults.eth.decimals));
    const vaultSharePrice = totalSupply > 0 ? totalAssets / totalSupply : 1.0;
    
    const actualInterest = sharesAmount * Math.max(0, vaultSharePrice - 1.0);
    const interestUsd = actualInterest * tokenPrices.ETH;

    vaultBalances.push({
      vault: vaults.eth,
      balance: currentValue,
      formatted: currentValue.toFixed(6),
      usdValue: usdValue,
      interest: actualInterest,
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
