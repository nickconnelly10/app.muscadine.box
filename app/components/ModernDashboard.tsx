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
    name: 'USDC Vault',
    symbol: 'USDC',
    description: 'Earn interest on USDC deposits',
    decimals: 6,
    tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    tokenName: 'USD Coin',
    tokenSymbol: 'USDC'
  },
  cbbtc: {
    address: '0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9' as const,
    name: 'cbBTC Vault',
    symbol: 'cbBTC',
    description: 'Earn interest on cbBTC deposits',
    decimals: 8,
    tokenAddress: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
    tokenName: 'Coinbase Wrapped BTC',
    tokenSymbol: 'cbBTC'
  },
  eth: {
    address: '0x21e0d366272798da3A977FEBA699FCB91959d120' as const,
    name: 'ETH Vault',
    symbol: 'ETH',
    description: 'Earn interest on ETH deposits',
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

  // Get vault balances
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
  ] as const;

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

  // Calculate portfolio data with real APY from vault contracts
  const portfolioData = useMemo(() => {
    const vaultBalances = [];

    // USDC Vault - Calculate real APY based on vault performance
    if (usdcVaultBalance.data && usdcConvertToAssets.data) {
      const sharesAmount = parseFloat(formatUnits(usdcVaultBalance.data, VAULTS_CONFIG.usdc.decimals));
      const assetsAmount = parseFloat(formatUnits(usdcConvertToAssets.data, VAULTS_CONFIG.usdc.decimals));
      const usdValue = assetsAmount * tokenPrices.USDC;
      
      // Calculate real APY based on the difference between shares and assets
      // This represents the actual yield earned over time
      const yieldEarned = assetsAmount - sharesAmount;
      const realAPY = sharesAmount > 0 ? (yieldEarned / sharesAmount) * 100 : 0;
      
      // Show actual earned amount, not estimated monthly earnings
      const actualEarned = yieldEarned * tokenPrices.USDC;

      vaultBalances.push({
        symbol: VAULTS_CONFIG.usdc.symbol,
        name: VAULTS_CONFIG.usdc.name,
        description: VAULTS_CONFIG.usdc.description,
        apy: Math.max(0, realAPY), // Ensure non-negative APY
        deposited: `$${usdValue.toFixed(2)}`,
        earned: `$${actualEarned.toFixed(2)}`,
        status: 'active' as const,
        usdValue,
        sharesAmount,
        assetsAmount
      });
    }

    // cbBTC Vault - Calculate real APY based on vault performance
    if (cbbtcVaultBalance.data && cbbtcConvertToAssets.data) {
      const sharesAmount = parseFloat(formatUnits(cbbtcVaultBalance.data, VAULTS_CONFIG.cbbtc.decimals));
      const assetsAmount = parseFloat(formatUnits(cbbtcConvertToAssets.data, VAULTS_CONFIG.cbbtc.decimals));
      const usdValue = assetsAmount * tokenPrices.cbBTC;
      
      // Calculate real APY based on the difference between shares and assets
      const realAPY = sharesAmount > 0 ? ((assetsAmount - sharesAmount) / sharesAmount) * 100 : 0;
      
      // Show actual earned amount, not estimated monthly earnings
      const actualEarned = (assetsAmount - sharesAmount) * tokenPrices.cbBTC;

      vaultBalances.push({
        symbol: VAULTS_CONFIG.cbbtc.symbol,
        name: VAULTS_CONFIG.cbbtc.name,
        description: VAULTS_CONFIG.cbbtc.description,
        apy: Math.max(0, realAPY),
        deposited: `$${usdValue.toFixed(2)}`,
        earned: `$${actualEarned.toFixed(2)}`,
        status: 'active' as const,
        usdValue,
        sharesAmount,
        assetsAmount
      });
    }

    // ETH Vault - Calculate real APY based on vault performance
    if (ethVaultBalance.data && ethConvertToAssets.data) {
      const sharesAmount = parseFloat(formatUnits(ethVaultBalance.data, VAULTS_CONFIG.eth.decimals));
      const assetsAmount = parseFloat(formatUnits(ethConvertToAssets.data, VAULTS_CONFIG.eth.decimals));
      const usdValue = assetsAmount * tokenPrices.ETH;
      
      // Calculate real APY based on the difference between shares and assets
      const realAPY = sharesAmount > 0 ? ((assetsAmount - sharesAmount) / sharesAmount) * 100 : 0;
      
      // Show actual earned amount, not estimated monthly earnings
      const actualEarned = (assetsAmount - sharesAmount) * tokenPrices.ETH;

      vaultBalances.push({
        symbol: VAULTS_CONFIG.eth.symbol,
        name: VAULTS_CONFIG.eth.name,
        description: VAULTS_CONFIG.eth.description,
        apy: Math.max(0, realAPY),
        deposited: `$${usdValue.toFixed(2)}`,
        earned: `$${actualEarned.toFixed(2)}`,
        status: 'active' as const,
        usdValue,
        sharesAmount,
        assetsAmount
      });
    }

    const totalValue = vaultBalances.reduce((sum, vault) => sum + vault.usdValue, 0);
    const totalEarned = vaultBalances.reduce((sum, vault) => {
      // Calculate actual earned amount for each vault
      const actualEarned = (vault.assetsAmount - vault.sharesAmount) * 
        (vault.symbol === 'USDC' ? tokenPrices.USDC : 
         vault.symbol === 'cbBTC' ? tokenPrices.cbBTC : 
         tokenPrices.ETH);
      return sum + actualEarned;
    }, 0);

    return {
      vaults: vaultBalances,
      totalValue: `$${totalValue.toFixed(2)}`,
      totalEarned: `$${totalEarned.toFixed(2)}`
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
            vaultName={Object.values(VAULTS_CONFIG).find(v => v.symbol === activeDeposit)?.name || ''}
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
          />
        </div>
      ) : activeWithdraw ? (
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
          <WithdrawFlow
            _vaultSymbol={activeWithdraw}
            vaultName={Object.values(VAULTS_CONFIG).find(v => v.symbol === activeWithdraw)?.name || ''}
            _vaultAddress={Object.values(VAULTS_CONFIG).find(v => v.symbol === activeWithdraw)?.address || ''}
            onBack={handleBackToPortfolio}
          />
        </div>
      ) : (
        <PortfolioOverview
          totalValue={portfolioData.totalValue}
          totalEarned={portfolioData.totalEarned}
          vaults={portfolioData.vaults}
          onVaultAction={handleVaultAction}
        />
      )}
    </div>
  );
}