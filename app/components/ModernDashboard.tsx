"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { base } from 'wagmi/chains';
import { formatUnits } from 'viem';
import { useMorphoVault } from '@coinbase/onchainkit/earn';
import { ModernHeader, PortfolioOverview, DepositFlow, WithdrawFlow } from '../components/molecules';
import { Skeleton } from '../components/atoms';
import '../styles/design-system.css';

// Vault configurations - moved outside component to prevent re-renders
const VAULTS_CONFIG = {
  usdc: {
    address: '0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F' as const,
    name: 'Muscadine USDC Vault',
    symbol: 'USDC',
    description: 'Earn interest on USDC deposits with Morpho',
    decimals: 6,
    tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    tokenName: 'USD Coin',
    tokenSymbol: 'USDC'
  },
  cbbtc: {
    address: '0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9' as const,
    name: 'Muscadine cbBTC Vault',
    symbol: 'cbBTC',
    description: 'Earn interest on cbBTC deposits with Morpho',
    decimals: 8,
    tokenAddress: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
    tokenName: 'Coinbase Wrapped BTC',
    tokenSymbol: 'cbBTC'
  },
  eth: {
    address: '0x21e0d366272798da3A977FEBA699FCB91959d120' as const,
    name: 'Muscadine WETH Vault',
    symbol: 'WETH',
    description: 'Earn interest on WETH deposits with Morpho',
    decimals: 18,
    tokenAddress: '0x4200000000000000000000000000000000000006',
    tokenName: 'Wrapped Ether',
    tokenSymbol: 'WETH'
  }
};

// Token prices will be fetched from CoinGecko API

export default function ModernDashboard() {
  const { address, isConnected } = useAccount();
  const [activeDeposit, setActiveDeposit] = useState<string | null>(null);
  const [activeWithdraw, setActiveWithdraw] = useState<string | null>(null);
  const [tokenPrices, setTokenPrices] = useState({
    USDC: 1.00,
    cbBTC: 0,
    ETH: 0,
  });

  // Fetch real-time token prices
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch token prices from CoinGecko
        const priceResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
        );
        const priceData = await priceResponse.json();
        
        setTokenPrices({
          USDC: 1.00, // USDC is always $1
          cbBTC: priceData.bitcoin?.usd || 0,
          ETH: priceData.ethereum?.usd || 0,
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback to default values
        setTokenPrices({
          USDC: 1.00,
          cbBTC: 65000,
          ETH: 3500,
        });
      }
    };

    fetchData();
    // Update data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);


  // Get vault balances and names
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
    {
      name: 'name',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: '', type: 'string' }],
    },
  ] as const;

  // For now, use static vault names to avoid build issues
  // TODO: Re-enable dynamic vault name fetching once SSR issues are resolved
  // const [isMounted, setIsMounted] = useState(false);
  // 
  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  const usdcVaultBalance = useReadContract({
    address: VAULTS_CONFIG.usdc.address,
    abi: vaultAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const cbbtcVaultBalance = useReadContract({
    address: VAULTS_CONFIG.cbbtc.address,
    abi: vaultAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const ethVaultBalance = useReadContract({
    address: VAULTS_CONFIG.eth.address,
    abi: vaultAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const usdcConvertToAssets = useReadContract({
    address: VAULTS_CONFIG.usdc.address,
    abi: vaultAbi,
    functionName: 'convertToAssets',
    args: usdcVaultBalance.data ? [usdcVaultBalance.data] : undefined,
    chainId: base.id,
    query: { enabled: !!address && isConnected && !!usdcVaultBalance.data }
  });

  const cbbtcConvertToAssets = useReadContract({
    address: VAULTS_CONFIG.cbbtc.address,
    abi: vaultAbi,
    functionName: 'convertToAssets',
    args: cbbtcVaultBalance.data ? [cbbtcVaultBalance.data] : undefined,
    chainId: base.id,
    query: { enabled: !!address && isConnected && !!cbbtcVaultBalance.data }
  });

  const ethConvertToAssets = useReadContract({
    address: VAULTS_CONFIG.eth.address,
    abi: vaultAbi,
    functionName: 'convertToAssets',
    args: ethVaultBalance.data ? [ethVaultBalance.data] : undefined,
    chainId: base.id,
    query: { enabled: !!address && isConnected && !!ethVaultBalance.data }
  });

  // Get totalAssets and totalSupply for each vault to calculate share price
  const usdcTotalAssets = useReadContract({
    address: VAULTS_CONFIG.usdc.address,
    abi: vaultAbi,
    functionName: 'totalAssets',
    chainId: base.id,
    query: { enabled: isConnected }
  });

  const usdcTotalSupply = useReadContract({
    address: VAULTS_CONFIG.usdc.address,
    abi: vaultAbi,
    functionName: 'totalSupply',
    chainId: base.id,
    query: { enabled: isConnected }
  });

  const cbbtcTotalAssets = useReadContract({
    address: VAULTS_CONFIG.cbbtc.address,
    abi: vaultAbi,
    functionName: 'totalAssets',
    chainId: base.id,
    query: { enabled: isConnected }
  });

  const cbbtcTotalSupply = useReadContract({
    address: VAULTS_CONFIG.cbbtc.address,
    abi: vaultAbi,
    functionName: 'totalSupply',
    chainId: base.id,
    query: { enabled: isConnected }
  });

  const ethTotalAssets = useReadContract({
    address: VAULTS_CONFIG.eth.address,
    abi: vaultAbi,
    functionName: 'totalAssets',
    chainId: base.id,
    query: { enabled: isConnected }
  });

  const ethTotalSupply = useReadContract({
    address: VAULTS_CONFIG.eth.address,
    abi: vaultAbi,
    functionName: 'totalSupply',
    chainId: base.id,
    query: { enabled: isConnected }
  });

  // Get real-time vault data from OnchainKit
  const usdcVaultData = useMorphoVault({
    vaultAddress: VAULTS_CONFIG.usdc.address,
    recipientAddress: address
  });

  const cbbtcVaultData = useMorphoVault({
    vaultAddress: VAULTS_CONFIG.cbbtc.address,
    recipientAddress: address
  });

  const ethVaultData = useMorphoVault({
    vaultAddress: VAULTS_CONFIG.eth.address,
    recipientAddress: address
  });

  // Calculate portfolio data with corrected interest calculation
  const portfolioData = useMemo(() => {
    const vaultBalances = [];

    // USDC Vault - Calculate realistic interest based on vault performance
    if (usdcVaultBalance.data && usdcConvertToAssets.data && usdcTotalAssets.data && usdcTotalSupply.data) {
      const sharesAmount = parseFloat(formatUnits(usdcVaultBalance.data, VAULTS_CONFIG.usdc.decimals));
      const currentAssetValue = parseFloat(formatUnits(usdcConvertToAssets.data, VAULTS_CONFIG.usdc.decimals));
      const usdValue = currentAssetValue * tokenPrices.USDC;
      
      // Calculate actual vault share price from totalAssets / totalSupply
      const totalAssets = parseFloat(formatUnits(usdcTotalAssets.data, VAULTS_CONFIG.usdc.decimals));
      const totalSupply = parseFloat(formatUnits(usdcTotalSupply.data, VAULTS_CONFIG.usdc.decimals));
      const vaultSharePrice = totalSupply > 0 ? totalAssets / totalSupply : 1.0;
      
      // Use real-time APY from OnchainKit, fallback to estimated if not available
      const realAPY = usdcVaultData.totalApy || 0.085; // Fallback to 8.5% if data not available
      
      // Calculate interest: 
      // In ERC-4626 vaults, if share price > 1.0, it means interest has been earned
      // User's original deposit ≈ shares (assuming 1:1 at deposit time)
      // User's current value = convertToAssets(shares)
      // Interest = current value - original deposit
      // However, if vault share price > 1.0, we need to account for this
      
      // More accurate: 
      // - If user deposited when share price was X, they got (deposit / X) shares
      // - We don't know X, but we can estimate it was close to 1.0 for most users
      // - Current value = shares * current_share_price
      // - Interest = current value - (shares * 1.0) = shares * (current_share_price - 1.0)
      
      // Calculate interest based on vault share price
      // If share price is very close to 1.0, we'll estimate interest based on APY and time
      let interestEarned: number;
      if (vaultSharePrice > 1.001) {
        // Significant share price appreciation - use direct calculation
        interestEarned = sharesAmount * (vaultSharePrice - 1.0);
      } else {
        // Minimal share price change - estimate based on APY
        // Assume vault has been running for some time and estimate interest
        const estimatedDaysRunning = 30; // Assume 30 days
        const dailyRate = realAPY / 365;
        const estimatedInterestRate = dailyRate * estimatedDaysRunning;
        interestEarned = sharesAmount * estimatedInterestRate;
      }
      
      const interestEarnedUSD = interestEarned * tokenPrices.USDC;
      
      const monthlyEarnings = usdValue * (realAPY / 12);

      vaultBalances.push({
        symbol: VAULTS_CONFIG.usdc.symbol,
        name: VAULTS_CONFIG.usdc.name,
        description: VAULTS_CONFIG.usdc.description,
        apy: realAPY * 100,
        deposited: `$${usdValue.toFixed(2)}`,
        depositedAmount: currentAssetValue,
        earned: `$${interestEarnedUSD.toFixed(2)}`,
        earnedAmount: interestEarned,
        status: 'active' as const,
        usdValue,
        sharesAmount,
        assetsAmount: currentAssetValue,
        interestEarned: interestEarnedUSD,
        monthlyEarnings
      });
    }

    // cbBTC Vault - Calculate realistic interest based on vault performance
    if (cbbtcVaultBalance.data && cbbtcConvertToAssets.data && cbbtcTotalAssets.data && cbbtcTotalSupply.data) {
      const sharesAmount = parseFloat(formatUnits(cbbtcVaultBalance.data, VAULTS_CONFIG.cbbtc.decimals));
      const currentAssetValue = parseFloat(formatUnits(cbbtcConvertToAssets.data, VAULTS_CONFIG.cbbtc.decimals));
      const usdValue = currentAssetValue * tokenPrices.cbBTC;
      
      // Calculate actual vault share price from totalAssets / totalSupply
      const totalAssets = parseFloat(formatUnits(cbbtcTotalAssets.data, VAULTS_CONFIG.cbbtc.decimals));
      const totalSupply = parseFloat(formatUnits(cbbtcTotalSupply.data, VAULTS_CONFIG.cbbtc.decimals));
      const vaultSharePrice = totalSupply > 0 ? totalAssets / totalSupply : 1.0;
      
      // Use real-time APY from OnchainKit, fallback to estimated if not available
      const realAPY = cbbtcVaultData.totalApy || 0.062; // Fallback to 6.2% if data not available
      
      // Calculate interest based on vault share price
      let interestEarned: number;
      if (vaultSharePrice > 1.001) {
        interestEarned = sharesAmount * (vaultSharePrice - 1.0);
      } else {
        const estimatedDaysRunning = 30;
        const dailyRate = realAPY / 365;
        const estimatedInterestRate = dailyRate * estimatedDaysRunning;
        interestEarned = sharesAmount * estimatedInterestRate;
      }
      
      const interestEarnedUSD = interestEarned * tokenPrices.cbBTC;
      const monthlyEarnings = usdValue * (realAPY / 12);

      vaultBalances.push({
        symbol: VAULTS_CONFIG.cbbtc.symbol,
        name: VAULTS_CONFIG.cbbtc.name,
        description: VAULTS_CONFIG.cbbtc.description,
        apy: realAPY * 100,
        deposited: `$${usdValue.toFixed(2)}`,
        depositedAmount: currentAssetValue,
        earned: `$${interestEarnedUSD.toFixed(2)}`,
        earnedAmount: interestEarned,
        status: 'active' as const,
        usdValue,
        sharesAmount,
        assetsAmount: currentAssetValue,
        interestEarned: interestEarnedUSD,
        monthlyEarnings
      });
    }

    // ETH Vault - Calculate realistic interest based on vault performance
    if (ethVaultBalance.data && ethConvertToAssets.data && ethTotalAssets.data && ethTotalSupply.data) {
      const sharesAmount = parseFloat(formatUnits(ethVaultBalance.data, VAULTS_CONFIG.eth.decimals));
      const currentAssetValue = parseFloat(formatUnits(ethConvertToAssets.data, VAULTS_CONFIG.eth.decimals));
      const usdValue = currentAssetValue * tokenPrices.ETH;
      
      // Calculate actual vault share price from totalAssets / totalSupply
      const totalAssets = parseFloat(formatUnits(ethTotalAssets.data, VAULTS_CONFIG.eth.decimals));
      const totalSupply = parseFloat(formatUnits(ethTotalSupply.data, VAULTS_CONFIG.eth.decimals));
      const vaultSharePrice = totalSupply > 0 ? totalAssets / totalSupply : 1.0;
      
      // Use real-time APY from OnchainKit, fallback to estimated if not available
      const realAPY = ethVaultData.totalApy || 0.078; // Fallback to 7.8% if data not available
      
      // Calculate interest based on vault share price
      let interestEarned: number;
      if (vaultSharePrice > 1.001) {
        interestEarned = sharesAmount * (vaultSharePrice - 1.0);
      } else {
        const estimatedDaysRunning = 30;
        const dailyRate = realAPY / 365;
        const estimatedInterestRate = dailyRate * estimatedDaysRunning;
        interestEarned = sharesAmount * estimatedInterestRate;
      }
      
      const interestEarnedUSD = interestEarned * tokenPrices.ETH;
      const monthlyEarnings = usdValue * (realAPY / 12);

      vaultBalances.push({
        symbol: VAULTS_CONFIG.eth.symbol,
        name: VAULTS_CONFIG.eth.name,
        description: VAULTS_CONFIG.eth.description,
        apy: realAPY * 100,
        deposited: `$${usdValue.toFixed(2)}`,
        depositedAmount: currentAssetValue,
        earned: `$${interestEarnedUSD.toFixed(2)}`,
        earnedAmount: interestEarned,
        status: 'active' as const,
        usdValue,
        sharesAmount,
        assetsAmount: currentAssetValue,
        interestEarned: interestEarnedUSD,
        monthlyEarnings
      });
    }

    const totalValue = vaultBalances.reduce((sum, vault) => sum + vault.usdValue, 0);
    
    // Calculate initial value more accurately
    // For ERC-4626 vaults, we need to estimate the original deposit value
    // Since we don't have historical data, we'll estimate based on current share price
    const initialValue = vaultBalances.reduce((sum, vault) => {
      // If vault has been running and earning interest, share price > 1.0
      // We estimate original deposit by dividing current value by share price
      const totalAssets = parseFloat(formatUnits(
        vault.symbol === 'USDC' ? usdcTotalAssets.data || BigInt(0) : 
        vault.symbol === 'cbBTC' ? cbbtcTotalAssets.data || BigInt(0) : 
        ethTotalAssets.data || BigInt(0), 
        vault.symbol === 'USDC' ? VAULTS_CONFIG.usdc.decimals :
        vault.symbol === 'cbBTC' ? VAULTS_CONFIG.cbbtc.decimals :
        VAULTS_CONFIG.eth.decimals
      ));
      
      const totalSupply = parseFloat(formatUnits(
        vault.symbol === 'USDC' ? usdcTotalSupply.data || BigInt(0) : 
        vault.symbol === 'cbBTC' ? cbbtcTotalSupply.data || BigInt(0) : 
        ethTotalSupply.data || BigInt(0), 
        vault.symbol === 'USDC' ? VAULTS_CONFIG.usdc.decimals :
        vault.symbol === 'cbBTC' ? VAULTS_CONFIG.cbbtc.decimals :
        VAULTS_CONFIG.eth.decimals
      ));
      
      const vaultSharePrice = totalSupply > 0 ? totalAssets / totalSupply : 1.0;
      
      // Estimate original deposit: current value / share price
      // This gives us what the user originally deposited
      const estimatedOriginalDeposit = vault.usdValue / vaultSharePrice;
      
      return sum + estimatedOriginalDeposit;
    }, 0);
    
    // Total earned = current value - estimated initial value
    const totalEarned = Math.max(0, totalValue - initialValue);
    
    // Earned interest from share price appreciation
    const earnedInterest = vaultBalances.reduce((sum, vault) => sum + vault.interestEarned, 0);
    
    const totalMonthlyExpected = vaultBalances.reduce((sum, vault) => sum + vault.monthlyEarnings, 0);

    return {
      vaults: vaultBalances,
      totalValue: `$${totalValue.toFixed(2)}`,
      initialValue: `$${initialValue.toFixed(2)}`,
      totalEarned: `$${totalEarned.toFixed(2)}`,
      earnedInterest: `$${earnedInterest.toFixed(2)}`,
      totalMonthlyExpected: `$${totalMonthlyExpected.toFixed(2)}`
    };
  }, [
    usdcVaultBalance.data, cbbtcVaultBalance.data, ethVaultBalance.data,
    usdcConvertToAssets.data, cbbtcConvertToAssets.data, ethConvertToAssets.data,
    usdcTotalAssets.data, usdcTotalSupply.data,
    cbbtcTotalAssets.data, cbbtcTotalSupply.data,
    ethTotalAssets.data, ethTotalSupply.data,
    tokenPrices,
    usdcVaultData.totalApy, cbbtcVaultData.totalApy, ethVaultData.totalApy
  ]);

  const handleVaultAction = (vaultSymbol: string, action: 'deposit' | 'withdraw') => {
    if (action === 'deposit') {
      setActiveDeposit(vaultSymbol);
      setActiveWithdraw(null);
    } else if (action === 'withdraw') {
      setActiveWithdraw(vaultSymbol);
      setActiveDeposit(null);
    }
  };

  const handleBackToPortfolio = () => {
    setActiveDeposit(null);
    setActiveWithdraw(null);
  };

  const isLoading = usdcVaultBalance.isLoading || cbbtcVaultBalance.isLoading || ethVaultBalance.isLoading ||
    usdcTotalAssets.isLoading || usdcTotalSupply.isLoading ||
    cbbtcTotalAssets.isLoading || cbbtcTotalSupply.isLoading ||
    ethTotalAssets.isLoading || ethTotalSupply.isLoading;

  if (!isConnected) {
    return (
      <div className="container">
        <ModernHeader 
          totalValue="$0.00" 
        />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h2>Connect Your Wallet</h2>
          <p>Connect your wallet to view your portfolio and start earning interest.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container">
        <ModernHeader 
          totalValue="$0.00" 
        />
        <div className="portfolioOverview">
          <div className="portfolioHeader">
            <Skeleton width="200px" height="2rem" />
            <Skeleton width="300px" height="1rem" />
          </div>
          <div className="portfolioGrid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="vaultCard">
                <div className="vaultHeader">
                  <Skeleton width="48px" height="48px" />
                  <div style={{ flex: 1 }}>
                    <Skeleton width="120px" height="1.25rem" />
                    <Skeleton width="200px" height="1rem" />
                  </div>
                </div>
                <div className="vaultMetrics">
                  <Skeleton width="100px" height="2rem" />
                  <Skeleton width="100px" height="2rem" />
                </div>
                <Skeleton width="100%" height="40px" />
                <div className="vaultActions">
                  <Skeleton width="100%" height="40px" />
                  <Skeleton width="100%" height="40px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <ModernHeader 
        totalValue={portfolioData.totalValue} 
      />
      
      {activeDeposit ? (
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <DepositFlow
            vaultSymbol={activeDeposit}
            vaultName={
              activeDeposit === 'USDC' ? VAULTS_CONFIG.usdc.name :
              activeDeposit === 'cbBTC' ? VAULTS_CONFIG.cbbtc.name :
              activeDeposit === 'WETH' ? VAULTS_CONFIG.eth.name :
              Object.values(VAULTS_CONFIG).find(v => v.symbol === activeDeposit)?.name || ''
            }
            vaultAddress={
              activeDeposit === 'USDC' ? VAULTS_CONFIG.usdc.address :
              activeDeposit === 'cbBTC' ? VAULTS_CONFIG.cbbtc.address :
              activeDeposit === 'WETH' ? VAULTS_CONFIG.eth.address :
              Object.values(VAULTS_CONFIG).find(v => v.symbol === activeDeposit)?.address || ''
            }
            vaultData={portfolioData.vaults.find(v => v.symbol === activeDeposit)}
            onBack={handleBackToPortfolio}
          />
        </div>
      ) : activeWithdraw ? (
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <WithdrawFlow
            vaultSymbol={activeWithdraw}
            vaultName={
              activeWithdraw === 'USDC' ? VAULTS_CONFIG.usdc.name :
              activeWithdraw === 'cbBTC' ? VAULTS_CONFIG.cbbtc.name :
              activeWithdraw === 'WETH' ? VAULTS_CONFIG.eth.name :
              Object.values(VAULTS_CONFIG).find(v => v.symbol === activeWithdraw)?.name || ''
            }
            vaultAddress={
              activeWithdraw === 'USDC' ? VAULTS_CONFIG.usdc.address :
              activeWithdraw === 'cbBTC' ? VAULTS_CONFIG.cbbtc.address :
              activeWithdraw === 'WETH' ? VAULTS_CONFIG.eth.address :
              Object.values(VAULTS_CONFIG).find(v => v.symbol === activeWithdraw)?.address || ''
            }
            vaultData={portfolioData.vaults.find(v => v.symbol === activeWithdraw)}
            onBack={handleBackToPortfolio}
          />
        </div>
      ) : (
        <PortfolioOverview
          totalValue={portfolioData.totalValue}
          initialValue={portfolioData.initialValue}
          totalEarned={portfolioData.totalEarned}
          earnedInterest={portfolioData.earnedInterest}
          totalMonthlyExpected={portfolioData.totalMonthlyExpected}
          vaults={portfolioData.vaults}
          onVaultAction={handleVaultAction}
        />
      )}
    </div>
  );
}