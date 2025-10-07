"use client";
import React, { useState, useMemo } from 'react';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { base } from 'wagmi/chains';
import { formatUnits } from 'viem';
import { ModernHeader, PortfolioOverview, DepositFlow } from '../components/molecules';
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
    tokenSymbol: 'USDC',
    apy: 5.2
  },
  cbbtc: {
    address: '0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9' as const,
    name: 'cbBTC Vault',
    symbol: 'cbBTC',
    description: 'Earn interest on cbBTC deposits',
    decimals: 8,
    tokenAddress: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
    tokenName: 'Coinbase Wrapped BTC',
    tokenSymbol: 'cbBTC',
    apy: 4.8
  },
  eth: {
    address: '0x21e0d366272798da3A977FEBA699FCB91959d120' as const,
    name: 'ETH Vault',
    symbol: 'ETH',
    description: 'Earn interest on ETH deposits',
    decimals: 18,
    tokenAddress: '0x4200000000000000000000000000000000000006',
    tokenName: 'Wrapped Ether',
    tokenSymbol: 'WETH',
    apy: 3.9
  }
};

// Token prices - moved outside component to prevent re-renders
const TOKEN_PRICES = {
  USDC: 1.00,
  cbBTC: 65000,
  ETH: 3500,
};

export default function ModernDashboard() {
  const { address, isConnected } = useAccount();
  const [activeDeposit, setActiveDeposit] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

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

  // Calculate portfolio data
  const portfolioData = useMemo(() => {
    const vaultBalances = [];

    // USDC Vault
    if (usdcVaultBalance.data && usdcConvertToAssets.data) {
      const currentValue = parseFloat(formatUnits(usdcConvertToAssets.data, VAULTS_CONFIG.usdc.decimals));
      const usdValue = currentValue * TOKEN_PRICES.USDC;
      const monthlyEarnings = usdValue * (VAULTS_CONFIG.usdc.apy / 100 / 12);

      vaultBalances.push({
        symbol: VAULTS_CONFIG.usdc.symbol,
        name: VAULTS_CONFIG.usdc.name,
        description: VAULTS_CONFIG.usdc.description,
        apy: VAULTS_CONFIG.usdc.apy,
        deposited: `$${usdValue.toFixed(2)}`,
        earned: `$${monthlyEarnings.toFixed(2)}`,
        status: 'active' as const,
        usdValue
      });
    }

    // cbBTC Vault
    if (cbbtcVaultBalance.data && cbbtcConvertToAssets.data) {
      const currentValue = parseFloat(formatUnits(cbbtcConvertToAssets.data, VAULTS_CONFIG.cbbtc.decimals));
      const usdValue = currentValue * TOKEN_PRICES.cbBTC;
      const monthlyEarnings = usdValue * (VAULTS_CONFIG.cbbtc.apy / 100 / 12);

      vaultBalances.push({
        symbol: VAULTS_CONFIG.cbbtc.symbol,
        name: VAULTS_CONFIG.cbbtc.name,
        description: VAULTS_CONFIG.cbbtc.description,
        apy: VAULTS_CONFIG.cbbtc.apy,
        deposited: `$${usdValue.toFixed(2)}`,
        earned: `$${monthlyEarnings.toFixed(2)}`,
        status: 'active' as const,
        usdValue
      });
    }

    // ETH Vault
    if (ethVaultBalance.data && ethConvertToAssets.data) {
      const currentValue = parseFloat(formatUnits(ethConvertToAssets.data, VAULTS_CONFIG.eth.decimals));
      const usdValue = currentValue * TOKEN_PRICES.ETH;
      const monthlyEarnings = usdValue * (VAULTS_CONFIG.eth.apy / 100 / 12);

      vaultBalances.push({
        symbol: VAULTS_CONFIG.eth.symbol,
        name: VAULTS_CONFIG.eth.name,
        description: VAULTS_CONFIG.eth.description,
        apy: VAULTS_CONFIG.eth.apy,
        deposited: `$${usdValue.toFixed(2)}`,
        earned: `$${monthlyEarnings.toFixed(2)}`,
        status: 'active' as const,
        usdValue
      });
    }

    const totalValue = vaultBalances.reduce((sum, vault) => sum + vault.usdValue, 0);
    const totalEarned = vaultBalances.reduce((sum, vault) => {
      const monthlyEarnings = vault.usdValue * (vault.apy / 100 / 12);
      return sum + monthlyEarnings;
    }, 0);

    return {
      vaults: vaultBalances,
      totalValue: `$${totalValue.toFixed(2)}`,
      totalEarned: `$${totalEarned.toFixed(2)}`
    };
  }, [
    usdcVaultBalance.data, cbbtcVaultBalance.data, ethVaultBalance.data,
    usdcConvertToAssets.data, cbbtcConvertToAssets.data, ethConvertToAssets.data
  ]);

  const handleVaultAction = (vaultSymbol: string, action: 'deposit' | 'withdraw') => {
    if (action === 'deposit') {
      setActiveDeposit(vaultSymbol);
      setCurrentStep(1);
    }
  };

  const handleQuickAmount = (amount: string) => {
    if (amount === 'Max') {
      // Set max available balance
      const vault = Object.values(VAULTS_CONFIG).find(v => v.symbol === activeDeposit);
      if (vault) {
        if (vault.symbol === 'USDC' && usdcWalletBalance.data) {
          setDepositAmount(formatUnits(usdcWalletBalance.data.value, usdcWalletBalance.data.decimals));
        } else if (vault.symbol === 'cbBTC' && cbbtcWalletBalance.data) {
          setDepositAmount(formatUnits(cbbtcWalletBalance.data.value, cbbtcWalletBalance.data.decimals));
        } else if (vault.symbol === 'ETH' && ethWalletBalance.data) {
          setDepositAmount(formatUnits(ethWalletBalance.data.value, ethWalletBalance.data.decimals));
        }
      }
    } else {
      setDepositAmount(amount);
    }
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
          onWalletConnect={() => {}} 
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
          onWalletConnect={() => {}} 
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
        onWalletConnect={() => {}} 
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
            onQuickAmount={handleQuickAmount}
            onConfirm={handleConfirmDeposit}
            maxAmount="1000"
            gasFee="2.50"
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