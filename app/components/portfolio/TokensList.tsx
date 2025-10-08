"use client";
import React, { useState } from 'react';
import { usePortfolio } from '../../contexts/PortfolioContext';

export default function TokensList() {
  const { walletBalances, walletBalancesLoading, isConnected } = usePortfolio();
  const [showZeroBalances, setShowZeroBalances] = useState(false);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatBalance = (balance: number, decimals: number = 6): string => {
    return balance.toFixed(decimals);
  };

  // Sort: stablecoins first, then by USD value
  const sortedBalances = [...walletBalances].sort((a, b) => {
    // USDC first
    if (a.symbol === 'USDC') return -1;
    if (b.symbol === 'USDC') return 1;
    
    // Then by value
    return b.usdValue - a.usdValue;
  });

  // Filter zero balances if needed
  const displayBalances = showZeroBalances 
    ? sortedBalances 
    : sortedBalances.filter(bal => bal.balance > 0);

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
          Connect wallet to view your tokens
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#0f172a',
          margin: 0,
        }}>
          Tokens
        </h3>
        
        {walletBalances.some(bal => bal.balance === 0) && (
          <button
            onClick={() => setShowZeroBalances(!showZeroBalances)}
            style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: showZeroBalances ? '#f1f5f9' : 'transparent',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {showZeroBalances ? 'Hide' : 'Show'} zero balances
          </button>
        )}
      </div>

      {/* Loading state */}
      {walletBalancesLoading && (
        <div style={{ padding: '1.5rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <div style={{
                height: '3rem',
                backgroundColor: '#f1f5f9',
                borderRadius: '6px',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }} />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!walletBalancesLoading && displayBalances.length === 0 && (
        <div style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          color: '#94a3b8',
        }}>
          <div style={{ fontSize: '0.875rem' }}>
            No tokens detected on Base
          </div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Try depositing into a vault to start earning
          </div>
        </div>
      )}

      {/* Tokens table */}
      {!walletBalancesLoading && displayBalances.length > 0 && (
        <div style={{ overflow: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
              }}>
                <th style={{
                  padding: '0.75rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Token
                </th>
                <th style={{
                  padding: '0.75rem 1.5rem',
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Balance
                </th>
                <th style={{
                  padding: '0.75rem 1.5rem',
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {displayBalances.map((token, index) => (
                <tr
                  key={token.symbol}
                  style={{
                    borderBottom: index < displayBalances.length - 1 ? '1px solid #f1f5f9' : 'none',
                    transition: 'background-color 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{
                    padding: '1rem 1.5rem',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#e0e7ff',
                        color: '#4f46e5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                      }}>
                        {token.symbol.charAt(0)}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#0f172a',
                        }}>
                          {token.symbol}
                        </div>
                        {token.symbol === 'USDC' && (
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                          }}>
                            Stablecoin
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'right',
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#0f172a',
                    }}>
                      {formatBalance(
                        token.balance,
                        token.symbol === 'USDC' ? 2 : token.symbol === 'cbBTC' ? 8 : 6
                      )}
                    </div>
                  </td>
                  <td style={{
                    padding: '1rem 1.5rem',
                    textAlign: 'right',
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#0f172a',
                    }}>
                      {formatCurrency(token.usdValue)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

