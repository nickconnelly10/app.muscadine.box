"use client";
import React, { useState, useEffect } from 'react';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { 
  Earn,
  EarnDeposit,
  EarnWithdraw
} from '@coinbase/onchainkit/earn';
import { Button, Badge, Metric, VaultIcon } from '../atoms';
import { useBalance, useAccount } from 'wagmi';
import { base } from 'wagmi/chains';
import { formatUnits } from 'viem';

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
    originalDeposit?: number;
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

// Token address mapping
const TOKEN_ADDRESSES: Record<string, `0x${string}`> = {
  'USDC': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  'cbBTC': '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
  'WETH': '0x4200000000000000000000000000000000000006',
};

// Token decimals mapping
const TOKEN_DECIMALS: Record<string, number> = {
  'USDC': 6,
  'cbBTC': 8,
  'WETH': 18,
};

// Deposit Flow Component with OnchainKit Integration
interface DepositFlowProps {
  vaultSymbol: string;
  vaultName: string;
  onBack: () => void;
  vaultAddress: string;
  vaultData?: {
    symbol: string;
    name: string;
    description: string;
    apy: number;
    deposited: string;
    depositedAmount?: number;
    earned: string;
    earnedAmount?: number;
    status: 'active' | 'inactive';
    usdValue: number;
    sharesAmount: number;
    assetsAmount: number;
    interestEarned: number;
    monthlyEarnings: number;
    originalDeposit?: number;
  };
  tokenPrice?: number;
  className?: string;
}

export function DepositFlow({
  vaultSymbol,
  vaultName,
  onBack,
  vaultAddress,
  vaultData,
  tokenPrice = 1,
  className = ''
}: DepositFlowProps) {
  const { address } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [showOnchainKit, setShowOnchainKit] = useState(false);
  
  // Get wallet balance
  const tokenAddress = TOKEN_ADDRESSES[vaultSymbol];
  const decimals = TOKEN_DECIMALS[vaultSymbol] || 18;
  
  const { data: balance, refetch } = useBalance({
    address: address,
    token: tokenAddress,
    chainId: base.id,
    query: { enabled: !!address }
  });

  // Refetch balance when component mounts or address changes
  useEffect(() => {
    if (address) {
      refetch();
    }
  }, [address, refetch]);

  const walletBalance = balance ? parseFloat(formatUnits(balance.value, decimals)) : 0;
  const usdValue = depositAmount ? parseFloat(depositAmount) * tokenPrice : 0;

  const handleMaxClick = () => {
    if (walletBalance > 0) {
      setDepositAmount(walletBalance.toString());
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDepositAmount(value);
    }
  };

  const handleContinue = () => {
    if (depositAmount && parseFloat(depositAmount) > 0) {
      setShowOnchainKit(true);
    }
  };

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
            gap: '0.5rem',
            padding: '0.5rem'
          }}
        >
          ← Back to Portfolio
        </button>
        <h2 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
          Deposit to {vaultName}
        </h2>
        <div style={{ width: '120px' }}></div>
      </div>
      
      {/* Vault Information Card */}
      <div style={{ 
        padding: '1.5rem', 
        border: '1px solid #e2e8f0', 
        borderRadius: '12px',
        backgroundColor: '#f8fafc',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <VaultIcon symbol={vaultSymbol} />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#0f172a' }}>
              {vaultName}
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
              Earn interest on {vaultSymbol} deposits with Morpho
            </p>
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: '#ffffff', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500', marginBottom: '0.25rem' }}>
              Current APY
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>
              {vaultData ? `${vaultData.apy.toFixed(2)}%` : 'Loading...'}
            </div>
          </div>
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: '#ffffff', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500', marginBottom: '0.25rem' }}>
              Your Deposited
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
              {vaultData ? vaultData.deposited : '$0.00'}
            </div>
          </div>
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: '#ffffff', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500', marginBottom: '0.25rem' }}>
              Interest Earned
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>
              {vaultData ? vaultData.earned : '$0.00'}
            </div>
          </div>
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: '#ffffff', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500', marginBottom: '0.25rem' }}>
              Wallet Balance
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#6366f1' }}>
              {balance ? `${walletBalance.toFixed(decimals === 6 ? 2 : decimals === 8 ? 8 : 6)} ${vaultSymbol}` : 'Loading...'}
            </div>
          </div>
        </div>
      </div>
      
      {!showOnchainKit ? (
        <>
          {/* Amount Input Section */}
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            marginBottom: '1.5rem'
          }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#0f172a'
            }}>
              Amount to Deposit
            </label>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{ 
                flex: 1,
                position: 'relative'
              }}>
                <input
                  type="text"
                  value={depositAmount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <div style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#64748b'
                }}>
                  {vaultSymbol}
                </div>
              </div>
              
              <button
                onClick={handleMaxClick}
                style={{
                  padding: '1rem 1.5rem',
                  backgroundColor: '#6366f1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
              >
                MAX
              </button>
            </div>
            
            {/* USD Conversion */}
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#64748b',
              marginBottom: '1.5rem'
            }}>
              {depositAmount && parseFloat(depositAmount) > 0 ? (
                <span>≈ ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
              ) : (
                <span>Enter an amount to see USD value</span>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              {[25, 50, 75, 100].map(percent => (
                <button
                  key={percent}
                  onClick={() => setDepositAmount((walletBalance * percent / 100).toString())}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                    e.currentTarget.style.borderColor = '#6366f1';
                    e.currentTarget.style.color = '#6366f1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#475569';
                  }}
                >
                  {percent}%
                </button>
              ))}
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!depositAmount || parseFloat(depositAmount) <= 0 || parseFloat(depositAmount) > walletBalance}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: depositAmount && parseFloat(depositAmount) > 0 && parseFloat(depositAmount) <= walletBalance ? '#10b981' : '#e2e8f0',
                color: depositAmount && parseFloat(depositAmount) > 0 && parseFloat(depositAmount) <= walletBalance ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: depositAmount && parseFloat(depositAmount) > 0 && parseFloat(depositAmount) <= walletBalance ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (depositAmount && parseFloat(depositAmount) > 0 && parseFloat(depositAmount) <= walletBalance) {
                  e.currentTarget.style.backgroundColor = '#059669';
                }
              }}
              onMouseLeave={(e) => {
                if (depositAmount && parseFloat(depositAmount) > 0 && parseFloat(depositAmount) <= walletBalance) {
                  e.currentTarget.style.backgroundColor = '#10b981';
                }
              }}
            >
              Continue to Deposit
            </button>

            {depositAmount && parseFloat(depositAmount) > walletBalance && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                backgroundColor: '#fef2f2',
                borderRadius: '6px',
                fontSize: '0.875rem',
                color: '#dc2626',
                border: '1px solid #fecaca'
              }}>
                Insufficient balance. Maximum available: {walletBalance.toFixed(decimals === 6 ? 2 : decimals === 8 ? 8 : 6)} {vaultSymbol}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* OnchainKit Earn Component */}
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => setShowOnchainKit(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366f1',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0'
                }}
              >
                ← Back to Amount
              </button>
            </div>
            <Earn vaultAddress={vaultAddress as `0x${string}`} isSponsored={false}>
              <EarnDeposit />
            </Earn>
          </div>
        </>
      )}
      
      {/* Information Note */}
      <div style={{
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
  vaultData?: {
    symbol: string;
    name: string;
    description: string;
    apy: number;
    deposited: string;
    depositedAmount?: number;
    earned: string;
    earnedAmount?: number;
    status: 'active' | 'inactive';
    usdValue: number;
    sharesAmount: number;
    assetsAmount: number;
    interestEarned: number;
    monthlyEarnings: number;
    originalDeposit?: number;
  };
  onBack: () => void;
  tokenPrice?: number;
  className?: string;
}

export function WithdrawFlow({
  vaultSymbol,
  vaultName,
  vaultAddress,
  vaultData,
  onBack,
  tokenPrice = 1,
  className = ''
}: WithdrawFlowProps) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showOnchainKit, setShowOnchainKit] = useState(false);
  
  // Get vault balance using the vault ABI
  const decimals = TOKEN_DECIMALS[vaultSymbol] || 18;
  
  // Available balance from vault data
  const vaultBalance = vaultData?.depositedAmount || 0;
  const usdValue = withdrawAmount ? parseFloat(withdrawAmount) * tokenPrice : 0;

  const handleMaxClick = () => {
    if (vaultBalance > 0) {
      setWithdrawAmount(vaultBalance.toString());
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setWithdrawAmount(value);
    }
  };

  const handleContinue = () => {
    if (withdrawAmount && parseFloat(withdrawAmount) > 0) {
      setShowOnchainKit(true);
    }
  };

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
            gap: '0.5rem',
            padding: '0.5rem'
          }}
        >
          ← Back to Portfolio
        </button>
        <h2 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
          Withdraw from {vaultName}
        </h2>
        <div style={{ width: '120px' }}></div>
      </div>

      {/* Vault Information Card */}
      <div style={{ 
        padding: '1.5rem', 
        border: '1px solid #e2e8f0', 
        borderRadius: '12px',
        backgroundColor: '#f8fafc',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <VaultIcon symbol={vaultSymbol} />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#0f172a' }}>
              {vaultName}
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
              Withdraw your {vaultSymbol} deposits from Morpho vault
            </p>
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: '#ffffff', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500', marginBottom: '0.25rem' }}>
              Available Balance
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
              {vaultData ? vaultData.deposited : '$0.00'}
            </div>
          </div>
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: '#ffffff', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500', marginBottom: '0.25rem' }}>
              Interest Earned
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>
              {vaultData ? vaultData.earned : '$0.00'}
            </div>
          </div>
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: '#ffffff', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500', marginBottom: '0.25rem' }}>
              Amount in Vault
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#6366f1' }}>
              {vaultData && vaultData.depositedAmount !== undefined ? `${vaultData.depositedAmount.toFixed(decimals === 6 ? 2 : decimals === 8 ? 8 : 6)} ${vaultSymbol}` : 'Loading...'}
            </div>
          </div>
        </div>
      </div>

      {!showOnchainKit ? (
        <>
          {/* Amount Input Section */}
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            marginBottom: '1.5rem'
          }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#0f172a'
            }}>
              Amount to Withdraw
            </label>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{ 
                flex: 1,
                position: 'relative'
              }}>
                <input
                  type="text"
                  value={withdrawAmount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
                <div style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#64748b'
                }}>
                  {vaultSymbol}
                </div>
              </div>
              
              <button
                onClick={handleMaxClick}
                style={{
                  padding: '1rem 1.5rem',
                  backgroundColor: '#6366f1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
              >
                MAX
              </button>
            </div>
            
            {/* USD Conversion */}
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#64748b',
              marginBottom: '1.5rem'
            }}>
              {withdrawAmount && parseFloat(withdrawAmount) > 0 ? (
                <span>≈ ${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
              ) : (
                <span>Enter an amount to see USD value</span>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              {[25, 50, 75, 100].map(percent => (
                <button
                  key={percent}
                  onClick={() => setWithdrawAmount((vaultBalance * percent / 100).toString())}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef3c7';
                    e.currentTarget.style.borderColor = '#fbbf24';
                    e.currentTarget.style.color = '#92400e';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#475569';
                  }}
                >
                  {percent}%
                </button>
              ))}
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > vaultBalance}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: withdrawAmount && parseFloat(withdrawAmount) > 0 && parseFloat(withdrawAmount) <= vaultBalance ? '#f59e0b' : '#e2e8f0',
                color: withdrawAmount && parseFloat(withdrawAmount) > 0 && parseFloat(withdrawAmount) <= vaultBalance ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: withdrawAmount && parseFloat(withdrawAmount) > 0 && parseFloat(withdrawAmount) <= vaultBalance ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (withdrawAmount && parseFloat(withdrawAmount) > 0 && parseFloat(withdrawAmount) <= vaultBalance) {
                  e.currentTarget.style.backgroundColor = '#d97706';
                }
              }}
              onMouseLeave={(e) => {
                if (withdrawAmount && parseFloat(withdrawAmount) > 0 && parseFloat(withdrawAmount) <= vaultBalance) {
                  e.currentTarget.style.backgroundColor = '#f59e0b';
                }
              }}
            >
              Continue to Withdraw
            </button>

            {withdrawAmount && parseFloat(withdrawAmount) > vaultBalance && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                backgroundColor: '#fef2f2',
                borderRadius: '6px',
                fontSize: '0.875rem',
                color: '#dc2626',
                border: '1px solid #fecaca'
              }}>
                Insufficient balance. Maximum available: {vaultBalance.toFixed(decimals === 6 ? 2 : decimals === 8 ? 8 : 6)} {vaultSymbol}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* OnchainKit Earn Component */}
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => setShowOnchainKit(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366f1',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0'
                }}
              >
                ← Back to Amount
              </button>
            </div>
            <Earn vaultAddress={vaultAddress as `0x${string}`} isSponsored={false}>
              <EarnWithdraw />
            </Earn>
          </div>
        </>
      )}
      
      {/* Information Note */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#fef3c7',
        borderRadius: '8px',
        border: '1px solid #fbbf24',
        fontSize: '0.875rem',
        color: '#92400e'
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
