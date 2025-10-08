"use client";
import React from 'react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useVaultHistory } from '../../hooks/useVaultHistory';
import { VAULTS } from '../../contexts/PortfolioContext';
import { Earn } from '@coinbase/onchainkit/earn';

export default function DeFiPositions() {
  const { vaultPositions, isConnected, address, prices } = usePortfolio();

  // Fetch vault history for earned interest
  const usdcHistory = useVaultHistory(
    VAULTS[0].address,
    address,
    vaultPositions.find(v => v.symbol === 'USDC')?.usdValue || 0,
    6,
    prices.USDC.price
  );

  const cbbtcHistory = useVaultHistory(
    VAULTS[1].address,
    address,
    vaultPositions.find(v => v.symbol === 'cbBTC')?.usdValue || 0,
    8,
    prices.cbBTC.price
  );

  const wethHistory = useVaultHistory(
    VAULTS[2].address,
    address,
    vaultPositions.find(v => v.symbol === 'WETH')?.usdValue || 0,
    18,
    prices.WETH.price
  );

  const getVaultHistory = (symbol: string) => {
    switch (symbol) {
      case 'USDC': return usdcHistory;
      case 'cbBTC': return cbbtcHistory;
      case 'WETH': return wethHistory;
      default: return { interestEarned: 0, netDeposits: 0, isLoading: false };
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };


  if (!isConnected) {
    return (
      <div style={{
        padding: '2rem',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '0.875rem',
          color: '#64748b',
        }}>
          Connect wallet to view your DeFi positions
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#0f172a',
          margin: 0,
        }}>
          DeFi Positions
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: '0.25rem 0 0',
        }}>
          Your vault deposits on Muscadine
        </p>
      </div>

      {/* Vaults */}
      <div style={{ padding: '1rem' }}>
        {VAULTS.map((vault, index) => {
          const position = vaultPositions.find(p => p.vaultAddress === vault.address);
          const history = getVaultHistory(vault.symbol);
          const hasBalance = position && position.balance > 0;

          return (
            <div
              key={vault.address}
              style={{
                marginBottom: index < VAULTS.length - 1 ? '1rem' : 0,
                padding: '1.25rem',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
              }}
            >
              {/* Vault header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem',
              }}>
                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 0.25rem',
                  }}>
                    {vault.name}
                  </h4>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                  }}>
                    Underlying: {vault.underlying}
                  </div>
                </div>
                
              </div>

              {/* Stats grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '0.75rem',
              }}>
                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '0.25rem',
                  }}>
                    Current Value
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#0f172a',
                  }}>
                    {hasBalance ? formatCurrency(position.usdValue) : '—'}
                  </div>
                </div>
                
                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '0.25rem',
                  }}>
                    Deposited
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#0f172a',
                  }}>
                    {history.netDeposits > 0 ? formatCurrency(history.netDeposits) : '—'}
                  </div>
                </div>
                
                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    marginBottom: '0.25rem',
                  }}>
                    Earned Interest
                    <span
                      title="Estimated based on current value minus net deposits"
                      style={{
                        marginLeft: '0.25rem',
                        cursor: 'help',
                      }}
                    >
                      ⓘ
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: history.interestEarned > 0 ? '#10b981' : '#0f172a',
                  }}>
                    {history.interestEarned > 0 ? formatCurrency(history.interestEarned) : '—'}
                  </div>
                </div>
              </div>

              {/* OnchainKit Earn component */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '0',
                overflow: 'hidden',
              }}>
                <Earn
                  vaultAddress={vault.address}
                  isSponsored={false}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

