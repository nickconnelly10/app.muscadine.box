"use client";
import React from 'react';
import { Button, Badge, Metric, MiniChart, VaultIcon } from '../atoms';

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
  chartData: number[];
  onDeposit: () => void;
  onWithdraw: () => void;
  className?: string;
}

export function VaultCard({ 
  vault, 
  chartData, 
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
          change={`+${vault.apy}% APY`}
          changeType="positive"
        />
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <MiniChart data={chartData} />
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
  // Generate sample chart data for each vault
  const generateChartData = () => {
    return Array.from({ length: 7 }, () => Math.random() * 100);
  };
  
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
            chartData={generateChartData()}
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
  maxAmount: string;
  gasFee: string;
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
  maxAmount,
  gasFee,
  className = ''
}: DepositFlowProps) {
  const quickAmounts = ['100', '500', '1000', 'Max'];
  
  const total = (parseFloat(amount) + parseFloat(gasFee)).toFixed(2);
  
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
      
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>
        Deposit {vaultName}
      </h2>
      
      <input
        type="number"
        className="amountInput"
        placeholder="0.00"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
      />
      
      <div className="quickAmounts">
        {quickAmounts.map((quickAmount) => (
          <button
            key={quickAmount}
            className="quickButton"
            onClick={() => onQuickAmount(quickAmount === 'Max' ? maxAmount : quickAmount)}
          >
            {quickAmount}
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
  onWalletConnect: () => void;
  className?: string;
}

export function ModernHeader({ totalValue, onWalletConnect, className = '' }: ModernHeaderProps) {
  return (
    <header className={`modernHeader ${className}`}>
      <div className="brandSection">
        <div className="brandText">Muscadine</div>
      </div>
      
      <div className="userSection">
        <div className="balanceDisplay">
          <div className="balanceLabel">Total Portfolio</div>
          <div className="balanceValue">{totalValue}</div>
        </div>
        <Button variant="primary" onClick={onWalletConnect}>
          Connect Wallet
        </Button>
      </div>
    </header>
  );
}
