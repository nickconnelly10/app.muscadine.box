"use client";
import React, { useState } from 'react';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Button, Badge, Metric, VaultIcon } from '../atoms';

// Vault Card Component
interface VaultCardProps {
  vault: {
    symbol: string;
    name: string;
    description: string;
    apy: number;
    deposited: string;
    earned: string;
    status: 'active' | 'inactive';
  };
  _chartData: number[];
  onDeposit: () => void;
  onWithdraw: () => void;
  className?: string;
}

export function VaultCard({ 
  vault, 
  _chartData, 
  onDeposit, 
  onWithdraw, 
  className = '' 
}: VaultCardProps) {
  return (
    <div className={`vaultCard ${className}`}>
      <div className="vaultHeader">
        <VaultIcon symbol={vault.symbol} />
        <div className="vaultInfo">
          <div className="vaultName">{vault.name}</div>
          <div className="vaultDescription">{vault.description}</div>
        </div>
        <Badge variant={vault.status === 'active' ? 'active' : 'inactive'}>
          {vault.status}
        </Badge>
      </div>
      
      <div className="vaultMetrics">
        <Metric
          label="Deposited"
          value={vault.deposited}
        />
        <Metric
          label="Earned"
          value={vault.earned}
          change={`+${vault.apy.toFixed(2)}% APY`}
          changeType="positive"
        />
      </div>
      
      <div className="vaultActions">
        <Button variant="primary" onClick={onDeposit}>
          Deposit
        </Button>
        <Button variant="secondary" onClick={onWithdraw}>
          Withdraw
        </Button>
      </div>
    </div>
  );
}

// Portfolio Overview Component
interface PortfolioOverviewProps {
  totalValue: string;
  totalEarned: string;
  vaults: Array<{
    symbol: string;
    name: string;
    description: string;
    apy: number;
    deposited: string;
    earned: string;
    status: 'active' | 'inactive';
    usdValue: number;
    sharesAmount: number;
    assetsAmount: number;
  }>;
  onVaultAction: (vaultSymbol: string, action: 'deposit' | 'withdraw') => void;
  className?: string;
}

export function PortfolioOverview({ 
  totalValue, 
  totalEarned, 
  vaults, 
  onVaultAction, 
  className = '' 
}: PortfolioOverviewProps) {
  return (
    <div className={`portfolioOverview ${className}`}>
      <div className="portfolioHeader">
        <h1 className="portfolioTitle">Portfolio Overview</h1>
        <p className="portfolioSubtitle">
          Total Value: {totalValue} • Earned: {totalEarned}
        </p>
      </div>
      
      <div className="portfolioGrid">
        {vaults.map((vault) => (
          <VaultCard
            key={vault.symbol}
            vault={vault}
            _chartData={[]}
            onDeposit={() => onVaultAction(vault.symbol, 'deposit')}
            onWithdraw={() => onVaultAction(vault.symbol, 'withdraw')}
          />
        ))}
      </div>
    </div>
  );
}

// Deposit Flow Component
interface DepositFlowProps {
  vaultSymbol: string;
  vaultName: string;
  currentStep: number;
  totalSteps: number;
  amount: string;
  onAmountChange: (amount: string) => void;
  onQuickAmount: (amount: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  maxAmount: string;
  gasFee: string;
  tokenPrice: number;
  className?: string;
}

export function DepositFlow({
  vaultSymbol,
  vaultName,
  currentStep,
  totalSteps,
  amount,
  onAmountChange,
  onQuickAmount,
  onConfirm,
  onBack,
  maxAmount,
  gasFee,
  tokenPrice,
  className = ''
}: DepositFlowProps) {
  const [dollarAmount, setDollarAmount] = useState('');
  
  // Convert dollar amount to token amount
  const convertDollarToToken = (dollars: string) => {
    if (!dollars || !tokenPrice) return '';
    const dollarValue = parseFloat(dollars);
    if (isNaN(dollarValue)) return '';
    return (dollarValue / tokenPrice).toFixed(6);
  };
  
  // Convert token amount to dollar amount
  const convertTokenToDollar = (tokens: string) => {
    if (!tokens || !tokenPrice) return '';
    const tokenValue = parseFloat(tokens);
    if (isNaN(tokenValue)) return '';
    return (tokenValue * tokenPrice).toFixed(2);
  };
  
  const handleDollarChange = (dollars: string) => {
    setDollarAmount(dollars);
    const tokenAmount = convertDollarToToken(dollars);
    onAmountChange(tokenAmount);
  };
  
  const handleTokenChange = (tokens: string) => {
    onAmountChange(tokens);
    const dollarAmount = convertTokenToDollar(tokens);
    setDollarAmount(dollarAmount);
  };
  
  const quickDollarAmounts = ['100', '500', '1000', 'Max'];
  
  const total = parseFloat(amount) && tokenPrice ? 
    (parseFloat(amount) * tokenPrice + parseFloat(gasFee)).toFixed(2) : 
    parseFloat(gasFee).toFixed(2);
  
  return (
    <div className={`depositFlow ${className}`}>
      <div className="stepIndicator">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`step ${index < currentStep ? 'stepCompleted' : index === currentStep ? 'stepActive' : ''}`}
          />
        ))}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button 
          onClick={onBack}
          className="backButton"
          style={{
            background: 'none',
            border: 'none',
            color: '#6366f1',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Back to Portfolio
        </button>
        <h2 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
          Deposit {vaultName}
        </h2>
        <div style={{ width: '120px' }}></div> {/* Spacer for centering */}
      </div>
      
      {/* Dollar Amount Input */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          Dollar Amount (USD)
        </label>
        <input
          type="number"
          className="amountInput"
          placeholder="0.00"
          value={dollarAmount}
          onChange={(e) => handleDollarChange(e.target.value)}
          step="0.01"
          min="0"
        />
      </div>
      
      {/* Token Amount Input */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          {vaultSymbol} Amount
        </label>
        <input
          type="number"
          className="amountInput"
          placeholder="0.000000"
          value={amount}
          onChange={(e) => handleTokenChange(e.target.value)}
          step="0.000001"
          min="0"
        />
      </div>
      
      {/* Quick Dollar Amounts */}
      <div className="quickAmounts">
        {quickDollarAmounts.map((dollarAmount) => (
          <button
            key={dollarAmount}
            className="quickButton"
            onClick={() => {
              if (dollarAmount === 'Max') {
                const maxDollars = parseFloat(maxAmount) * tokenPrice;
                handleDollarChange(maxDollars.toFixed(2));
              } else {
                handleDollarChange(dollarAmount);
              }
            }}
          >
            ${dollarAmount}
          </button>
        ))}
      </div>
      
      <div className="transactionPreview">
        <div className="previewRow">
          <span className="previewLabel">Amount</span>
          <span className="previewValue">{amount} {vaultSymbol}</span>
        </div>
        <div className="previewRow">
          <span className="previewLabel">Gas Fee</span>
          <span className="previewValue">${gasFee}</span>
        </div>
        <div className="previewRow">
          <span className="previewLabel">Total</span>
          <span className="previewValue">${total}</span>
        </div>
      </div>
      
      <Button 
        variant="primary" 
        size="lg" 
        fullWidth 
        onClick={onConfirm}
        disabled={!amount || parseFloat(amount) <= 0}
      >
        Confirm Deposit
      </Button>
    </div>
  );
}

// Modern Header Component
interface ModernHeaderProps {
  totalValue: string;
  className?: string;
}

export function ModernHeader({ totalValue, className = '' }: ModernHeaderProps) {
  return (
    <header className={`modernHeader ${className}`}>
      <div className="brandSection">
        <a href="https://app.muscadine.box" className="brandText">Muscadine</a>
      </div>
      
      <div className="userSection">
        <div className="balanceDisplay">
          <div className="balanceLabel">Total Portfolio</div>
          <div className="balanceValue">{totalValue}</div>
        </div>
        <ConnectWallet />
      </div>
    </header>
  );
}
