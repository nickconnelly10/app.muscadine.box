"use client";
import React, { useState } from 'react';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { 
  Earn,
  DepositAmountInput,
  DepositBalance,
  DepositButton,
  WithdrawAmountInput,
  WithdrawBalance,
  WithdrawButton
} from '@coinbase/onchainkit/earn';
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

// Deposit Flow Component with OnchainKit Integration
interface DepositFlowProps {
  vaultSymbol: string;
  vaultName: string;
  currentStep: number;
  totalSteps: number;
  amount: string;
  onAmountChange: (amount: string) => void;
  _onQuickAmount: (amount: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  maxAmount: string;
  gasFee: string;
  tokenPrice: number;
  vaultAddress?: string;
  className?: string;
}

export function DepositFlow({
  vaultSymbol: _vaultSymbol,
  vaultName,
  currentStep: _currentStep,
  totalSteps: _totalSteps,
  amount: _amount,
  onAmountChange: _onAmountChange,
  _onQuickAmount,
  onConfirm: _onConfirm,
  onBack,
  maxAmount: _maxAmount,
  gasFee: _gasFee,
  tokenPrice: _tokenPrice,
  vaultAddress,
  className = ''
}: DepositFlowProps) {
  // If vault address is provided, use OnchainKit's Earn components
  // Otherwise, show message to implement custom deposit logic
  return (
    <div className={`depositFlow ${className}`}>
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
        <div style={{ width: '120px' }}></div>
      </div>
      
      {vaultAddress ? (
        <div style={{ 
          padding: '2rem', 
          border: '1px solid #e2e8f0', 
          borderRadius: '12px',
          backgroundColor: '#f8fafc'
        }}>
          <Earn vaultAddress={vaultAddress as `0x${string}`}>
            <DepositBalance />
            <DepositAmountInput />
            <DepositButton />
          </Earn>
        </div>
      ) : (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          border: '1px solid #e2e8f0', 
          borderRadius: '12px',
          backgroundColor: '#f8fafc'
        }}>
          <p>Deposit functionality requires vault address configuration.</p>
          <Button variant="secondary" onClick={onBack}>
            Back to Portfolio
          </Button>
        </div>
      )}
    </div>
  );
}

// Withdraw Flow Component
interface WithdrawFlowProps {
  vaultSymbol: string;
  vaultName: string;
  vaultAddress: string;
  onBack: () => void;
  className?: string;
}

export function WithdrawFlow({
  vaultSymbol: _vaultSymbol,
  vaultName,
  vaultAddress,
  onBack,
  className = ''
}: WithdrawFlowProps) {
  return (
    <div className={`withdrawFlow ${className}`}>
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
          Withdraw {vaultName}
        </h2>
        <div style={{ width: '120px' }}></div> {/* Spacer for centering */}
      </div>
      
      <div style={{ 
        padding: '2rem', 
        border: '1px solid #e2e8f0', 
        borderRadius: '12px',
        backgroundColor: '#f8fafc'
      }}>
        <Earn
          vaultAddress={vaultAddress as `0x${string}`}
        >
          <WithdrawBalance />
          <WithdrawAmountInput />
          <WithdrawButton />
        </Earn>
      </div>
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
