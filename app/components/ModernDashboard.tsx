"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { base } from 'wagmi/chains';
import { formatUnits } from 'viem';
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
  const [depositAmount, setDepositAmount] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [tokenPrices, setTokenPrices] = useState({
    USDC: 1.00,
    cbBTC: 0,
    ETH: 0,
  });
  const [gasPrice, setGasPrice] = useState(0);

  // Fetch real-time token prices and gas prices
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch token prices from CoinGecko
        const priceResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
        );
        const priceData = await priceResponse.json();
        
        // Fetch gas price from Base network
        const gasResponse = await fetch('https://api.basescan.org/api?module=gastracker&action=gasoracle&apikey=YourApiKey');
        const gasData = await gasResponse.json();
        
        setTokenPrices({
          USDC: 1.00, // USDC is always $1
          cbBTC: priceData.bitcoin?.usd || 0,
          ETH: priceData.ethereum?.usd || 0,
        });
        
        // Set gas price in Gwei
        setGasPrice(parseFloat(gasData.result?.SafeGasPrice || '0.001'));
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback to default values
        setTokenPrices({
          USDC: 1.00,
          cbBTC: 65000,
          ETH: 3500,
        });
        setGasPrice(0.001); // Default gas price
      }
    };

    fetchData();
    // Update data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get wallet balances
  const usdcWalletBalance = useBalance({
    address: address,
    token: VAULTS_CONFIG.usdc.tokenAddress as `0x${string}`,
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const cbbtcWalletBalance = useBalance({
    address: address,
    token: VAULTS_CONFIG.cbbtc.tokenAddress as `0x${string}`,
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const ethWalletBalance = useBalance({
    address: address,
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

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

  // Calculate portfolio data with corrected interest calculation
  const portfolioData = useMemo(() => {
    const vaultBalances = [];

    // USDC Vault - Calculate realistic interest based on vault performance
    if (usdcVaultBalance.data && usdcConvertToAssets.data) {
      const sharesAmount = parseFloat(formatUnits(usdcVaultBalance.data, VAULTS_CONFIG.usdc.decimals));
      const currentAssetValue = parseFloat(formatUnits(usdcConvertToAssets.data, VAULTS_CONFIG.usdc.decimals));
      const usdValue = currentAssetValue * tokenPrices.USDC;
      
      const estimatedAPY = 0.085; // 8.5% Morpho USDC APY
      
      // For demonstration: Calculate interest based on vault's share price growth
      // In reality, Morpho vaults accumulate interest over time
      // Calculate interest earned from share price appreciation
      // In ERC-4626 vaults, the share price increases as interest accrues
      // Initial deposits typically receive shares at ~1:1 ratio
      // Current value is higher than shares due to accumulated interest
      
      // More accurate calculation: estimate original deposit based on current share price
      // If vault has been running for a while, share price > 1.0 indicates interest earned
      const currentSharePrice = sharesAmount > 0 ? currentAssetValue / sharesAmount : 1.0;
      
      // Estimate original deposit: assume shares were bought at vault inception (1:1 ratio)
      // This is more accurate than comparing shares vs assets directly
      const estimatedOriginalDeposit = sharesAmount; // Original deposit = shares at 1:1
      const estimatedCurrentValue = sharesAmount * currentSharePrice; // Current value with interest
      const interestEarned = Math.max(0, estimatedCurrentValue - estimatedOriginalDeposit);
      const interestEarnedUSD = interestEarned * tokenPrices.USDC;
      
      const monthlyEarnings = currentAssetValue * (estimatedAPY / 12);

      vaultBalances.push({
        symbol: VAULTS_CONFIG.usdc.symbol,
        name: VAULTS_CONFIG.usdc.name,
        description: VAULTS_CONFIG.usdc.description,
        apy: estimatedAPY * 100,
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
    if (cbbtcVaultBalance.data && cbbtcConvertToAssets.data) {
      const sharesAmount = parseFloat(formatUnits(cbbtcVaultBalance.data, VAULTS_CONFIG.cbbtc.decimals));
      const currentAssetValue = parseFloat(formatUnits(cbbtcConvertToAssets.data, VAULTS_CONFIG.cbbtc.decimals));
      const usdValue = currentAssetValue * tokenPrices.cbBTC;
      
      const estimatedAPY = 0.062; // 6.2% Morpho cbBTC APY
      
      // Calculate interest earned from share price appreciation
      const currentSharePrice = sharesAmount > 0 ? currentAssetValue / sharesAmount : 1.0;
      const estimatedOriginalDeposit = sharesAmount;
      const estimatedCurrentValue = sharesAmount * currentSharePrice;
      const interestEarned = Math.max(0, estimatedCurrentValue - estimatedOriginalDeposit);
      const interestEarnedUSD = interestEarned * tokenPrices.cbBTC;
      const monthlyEarnings = currentAssetValue * (estimatedAPY / 12);

      vaultBalances.push({
        symbol: VAULTS_CONFIG.cbbtc.symbol,
        name: VAULTS_CONFIG.cbbtc.name,
        description: VAULTS_CONFIG.cbbtc.description,
        apy: estimatedAPY * 100,
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
    if (ethVaultBalance.data && ethConvertToAssets.data) {
      const sharesAmount = parseFloat(formatUnits(ethVaultBalance.data, VAULTS_CONFIG.eth.decimals));
      const currentAssetValue = parseFloat(formatUnits(ethConvertToAssets.data, VAULTS_CONFIG.eth.decimals));
      const usdValue = currentAssetValue * tokenPrices.ETH;
      
      const estimatedAPY = 0.078; // 7.8% Morpho ETH APY
      
      // Calculate interest earned from share price appreciation
      const currentSharePrice = sharesAmount > 0 ? currentAssetValue / sharesAmount : 1.0;
      const estimatedOriginalDeposit = sharesAmount;
      const estimatedCurrentValue = sharesAmount * currentSharePrice;
      const interestEarned = Math.max(0, estimatedCurrentValue - estimatedOriginalDeposit);
      const interestEarnedUSD = interestEarned * tokenPrices.ETH;
      const monthlyEarnings = currentAssetValue * (estimatedAPY / 12);

      vaultBalances.push({
        symbol: VAULTS_CONFIG.eth.symbol,
        name: VAULTS_CONFIG.eth.name,
        description: VAULTS_CONFIG.eth.description,
        apy: estimatedAPY * 100,
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
    const totalEarned = vaultBalances.reduce((sum, vault) => sum + (vault.interestEarned * 
      (vault.symbol === 'USDC' ? tokenPrices.USDC : 
       vault.symbol === 'cbBTC' ? tokenPrices.cbBTC : 
       tokenPrices.ETH)), 0);
    const totalMonthlyExpected = vaultBalances.reduce((sum, vault) => sum + (vault.monthlyEarnings * 
      (vault.symbol === 'USDC' ? tokenPrices.USDC : 
       vault.symbol === 'cbBTC' ? tokenPrices.cbBTC : 
       tokenPrices.ETH)), 0);

    return {
      vaults: vaultBalances,
      totalValue: `$${totalValue.toFixed(2)}`,
      totalEarned: `$${totalEarned.toFixed(2)}`,
      totalMonthlyExpected: `$${totalMonthlyExpected.toFixed(2)}/mo`
    };
  }, [
    usdcVaultBalance.data, cbbtcVaultBalance.data, ethVaultBalance.data,
    usdcConvertToAssets.data, cbbtcConvertToAssets.data, ethConvertToAssets.data,
    tokenPrices
  ]);

  const handleVaultAction = (vaultSymbol: string, action: 'deposit' | 'withdraw') => {
    if (action === 'deposit') {
      setActiveDeposit(vaultSymbol);
      setActiveWithdraw(null);
      setCurrentStep(1);
    } else if (action === 'withdraw') {
      setActiveWithdraw(vaultSymbol);
      setActiveDeposit(null);
    }
  };

  const handleQuickAmount = (amount: string) => {
    if (amount === 'Max') {
      // Set max available balance based on actual wallet balances
      const vault = Object.values(VAULTS_CONFIG).find(v => v.symbol === activeDeposit);
      if (vault) {
        if (vault.symbol === 'USDC' && usdcWalletBalance.data) {
          const balance = parseFloat(formatUnits(usdcWalletBalance.data.value, usdcWalletBalance.data.decimals));
          const maxAmount = Math.max(0, balance - 0.01); // Leave small amount for gas
          setDepositAmount(maxAmount.toFixed(6));
        } else if (vault.symbol === 'cbBTC' && cbbtcWalletBalance.data) {
          const balance = parseFloat(formatUnits(cbbtcWalletBalance.data.value, cbbtcWalletBalance.data.decimals));
          const maxAmount = Math.max(0, balance - 0.00001); // Leave small amount for gas
          setDepositAmount(maxAmount.toFixed(8));
        } else if (vault.symbol === 'ETH' && ethWalletBalance.data) {
          const balance = parseFloat(formatUnits(ethWalletBalance.data.value, ethWalletBalance.data.decimals));
          const maxAmount = Math.max(0, balance - 0.001); // Leave small amount for gas
          setDepositAmount(maxAmount.toFixed(6));
        }
      }
    } else {
      setDepositAmount(amount);
    }
  };

  const handleBackToPortfolio = () => {
    setActiveDeposit(null);
    setActiveWithdraw(null);
    setDepositAmount('');
    setCurrentStep(1);
  };

  const handleConfirmDeposit = () => {
    // Handle deposit logic here
    console.log(`Depositing ${depositAmount} ${activeDeposit}`);
    setActiveDeposit(null);
    setDepositAmount('');
    setCurrentStep(1);
  };

  const isLoading = usdcVaultBalance.isLoading || cbbtcVaultBalance.isLoading || ethVaultBalance.isLoading;

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
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
          <DepositFlow
            vaultSymbol={activeDeposit}
            vaultName={
              activeDeposit === 'USDC' ? VAULTS_CONFIG.usdc.name :
              activeDeposit === 'cbBTC' ? VAULTS_CONFIG.cbbtc.name :
              activeDeposit === 'ETH' ? VAULTS_CONFIG.eth.name :
              Object.values(VAULTS_CONFIG).find(v => v.symbol === activeDeposit)?.name || ''
            }
            vaultAddress={
              activeDeposit === 'USDC' ? VAULTS_CONFIG.usdc.address :
              activeDeposit === 'cbBTC' ? VAULTS_CONFIG.cbbtc.address :
              activeDeposit === 'ETH' ? VAULTS_CONFIG.eth.address :
              Object.values(VAULTS_CONFIG).find(v => v.symbol === activeDeposit)?.address || ''
            }
            currentStep={currentStep}
            totalSteps={3}
            amount={depositAmount}
            onAmountChange={setDepositAmount}
            _onQuickAmount={handleQuickAmount}
            onConfirm={handleConfirmDeposit}
            onBack={handleBackToPortfolio}
            maxAmount={
              activeDeposit === 'USDC' && usdcWalletBalance.data 
                ? formatUnits(usdcWalletBalance.data.value, usdcWalletBalance.data.decimals)
                : activeDeposit === 'cbBTC' && cbbtcWalletBalance.data
                ? formatUnits(cbbtcWalletBalance.data.value, cbbtcWalletBalance.data.decimals)
                : activeDeposit === 'ETH' && ethWalletBalance.data
                ? formatUnits(ethWalletBalance.data.value, ethWalletBalance.data.decimals)
                : "0"
            }
            gasFee={
              gasPrice > 0 
                ? ((gasPrice * 21000) / 1e9 * tokenPrices.ETH).toFixed(2) // Convert Gwei to ETH and multiply by ETH price
                : "2.50"
            }
            tokenPrice={
              activeDeposit === 'USDC' ? tokenPrices.USDC :
              activeDeposit === 'cbBTC' ? tokenPrices.cbBTC :
              activeDeposit === 'ETH' ? tokenPrices.ETH : 0
            }
            ethBalance={
              ethWalletBalance.data 
                ? formatUnits(ethWalletBalance.data.value, ethWalletBalance.data.decimals)
                : "0"
            }
            ethPrice={tokenPrices.ETH}
          />
        </div>
      ) : activeWithdraw ? (
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
          {(() => {
            const activeVault = portfolioData.vaults.find(v => v.symbol === activeWithdraw);
            return (
              <WithdrawFlow
                vaultSymbol={activeWithdraw}
                vaultName={
                  activeWithdraw === 'USDC' ? VAULTS_CONFIG.usdc.name :
                  activeWithdraw === 'cbBTC' ? VAULTS_CONFIG.cbbtc.name :
                  activeWithdraw === 'WETH' ? VAULTS_CONFIG.eth.name :
                  Object.values(VAULTS_CONFIG).find(v => v.symbol === activeWithdraw)?.name || ''
                }
                vaultAddress={Object.values(VAULTS_CONFIG).find(v => v.symbol === activeWithdraw)?.address || ''}
                vaultBalance={activeVault?.assetsAmount.toFixed(6) || '0'}
                vaultBalanceUSD={`$${activeVault?.usdValue.toFixed(2) || '0.00'}`}
                tokenPrice={
                  activeWithdraw === 'USDC' ? tokenPrices.USDC :
                  activeWithdraw === 'cbBTC' ? tokenPrices.cbBTC :
                  activeWithdraw === 'WETH' ? tokenPrices.ETH :
                  activeWithdraw === 'ETH' ? tokenPrices.ETH : 0
                }
                estimatedAPY={activeVault?.apy || 0}
                onBack={handleBackToPortfolio}
              />
            );
          })()}
        </div>
      ) : (
        <PortfolioOverview
          totalValue={portfolioData.totalValue}
          totalEarned={portfolioData.totalEarned}
          totalMonthlyExpected={portfolioData.totalMonthlyExpected}
          vaults={portfolioData.vaults}
          onVaultAction={handleVaultAction}
        />
      )}
    </div>
  );
}