"use client";
import React from 'react';
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
    depositedAmount?: number;
    earned: string;
    earnedAmount?: number;
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
        <Badge variant="active">
          {vault.apy.toFixed(2)}% APY
        </Badge>
      </div>
      
      <div className="vaultMetrics">
        <Metric
          label="Deposited"
          value={vault.deposited}
          change={vault.depositedAmount !== undefined ? `${vault.depositedAmount.toFixed(vault.symbol === 'USDC' ? 2 : vault.symbol === 'cbBTC' ? 8 : 6)} ${vault.symbol}` : undefined}
        />
        <Metric
          label="Earned Interest"
          value={vault.earned}
          change={vault.earnedAmount !== undefined ? `${vault.earnedAmount.toFixed(vault.symbol === 'USDC' ? 2 : vault.symbol === 'cbBTC' ? 8 : 6)} ${vault.symbol}` : undefined}
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
  initialValue: string;
  totalEarned: string;
  earnedInterest: string;
  totalMonthlyExpected?: string;
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
    interestEarned: number;
    monthlyEarnings: number;
  }>;
  onVaultAction: (vaultSymbol: string, action: 'deposit' | 'withdraw') => void;
  className?: string;
}

export function PortfolioOverview({ 
  totalValue, 
  initialValue,
  totalEarned,
  earnedInterest,
  totalMonthlyExpected, 
  vaults, 
  onVaultAction, 
  className = '' 
}: PortfolioOverviewProps) {
  return (
    <div className={`portfolioOverview ${className}`}>
      <div className="portfolioHeader">
        <h1 className="portfolioTitle">Portfolio Overview</h1>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
          padding: '1.5rem',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Total Value</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>{totalValue}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Initial Value</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>{initialValue}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Total Earned</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>{totalEarned}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Earned Interest</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>{earnedInterest}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>Expected</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6366f1' }}>{totalMonthlyExpected}/month</span>
          </div>
        </div>
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
  onBack: () => void;
  vaultAddress: string;
  className?: string;
}

export function DepositFlow({
  vaultSymbol: _vaultSymbol,
  vaultName,
  onBack,
  vaultAddress,
  className = ''
}: DepositFlowProps) {
  return (
    <div className={`depositFlow ${className}`}>
      {/* Header */}
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
          Deposit to {vaultName}
        </h2>
        <div style={{ width: '120px' }}></div>
      </div>
      
      {/* OnchainKit Earn Component */}
      <div style={{ 
        padding: '2rem', 
        border: '1px solid #e2e8f0', 
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
        <Earn vaultAddress={vaultAddress as `0x${string}`} isSponsored={false}>
          <div style={{ marginBottom: '1.5rem' }}>
            <DepositBalance />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <DepositAmountInput />
          </div>
          <DepositButton />
        </Earn>
      </div>
      
      {/* Information Note */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#eff6ff',
        borderRadius: '8px',
        border: '1px solid #bfdbfe',
        fontSize: '0.875rem',
        color: '#1e40af'
      }}>
        <strong>Note:</strong> Deposits will start earning interest immediately. Your funds are secured in Morpho vaults on Base.
      </div>
    </div>
  );
}

// Withdraw Flow Component with OnchainKit Integration
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
      {/* Header */}
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
          Withdraw from {vaultName}
        </h2>
        <div style={{ width: '120px' }}></div>
      </div>

      {/* OnchainKit Earn Component */}
      <div style={{ 
        padding: '2rem', 
        border: '1px solid #e2e8f0', 
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
        <Earn vaultAddress={vaultAddress as `0x${string}`} isSponsored={false}>
          <div style={{ marginBottom: '1.5rem' }}>
            <WithdrawBalance />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <WithdrawAmountInput />
          </div>
          <WithdrawButton />
        </Earn>
      </div>
      
      {/* Information Note */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#eff6ff',
        borderRadius: '8px',
        border: '1px solid #bfdbfe',
        fontSize: '0.875rem',
        color: '#1e40af'
      }}>
        <strong>Note:</strong> Withdrawing will remove your funds from the vault and stop earning interest. 
        You can deposit again anytime to resume earning.
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
