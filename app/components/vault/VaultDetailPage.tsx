"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { VAULTS } from '../../contexts/PortfolioContext';
import { Earn } from '@coinbase/onchainkit/earn';
import { TokenImage } from '@coinbase/onchainkit/token';
import { useVaultBalances, useTokenPrices } from '../../hooks/useVaultData';
import { useReadContract } from 'wagmi';
import { base } from 'wagmi/chains';
import { formatUnits } from 'viem';

interface VaultDetailPageProps {
  vaultAddress: string;
}

export default function VaultDetailPage({ vaultAddress }: VaultDetailPageProps) {
  const [activeTab, setActiveTab] = useState('Overview');

  // Find the vault by address
  const vault = VAULTS.find(v => v.address.toLowerCase() === vaultAddress.toLowerCase());
  
  // Get real vault data using existing hooks
  const tokenPrices = useTokenPrices();
  const vaultBalances = useVaultBalances(VAULTS, tokenPrices.data || { USDC: 1, cbBTC: 65000, ETH: 3500 });
  
  // Vault ABI for contract calls
  const vaultAbi = [
    {
      name: 'totalAssets',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: '', type: 'uint256' }],
    },
    {
      name: 'totalSupply',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: '', type: 'uint256' }],
    },
  ] as const;

  // Get real vault metrics from contract
  const totalAssets = useReadContract({
    address: vault?.address as `0x${string}`,
    abi: vaultAbi,
    functionName: 'totalAssets',
    chainId: base.id,
    query: { enabled: !!vault }
  });

  const totalSupply = useReadContract({
    address: vault?.address as `0x${string}`,
    abi: vaultAbi,
    functionName: 'totalSupply',
    chainId: base.id,
    query: { enabled: !!vault }
  });

  // Calculate real vault data
  const vaultData = useMemo(() => {
    if (!vault || !totalAssets.data || !totalSupply.data || !tokenPrices.data) return null;
    
    const totalAssetsAmount = parseFloat(formatUnits(totalAssets.data, vault.decimals));
    const totalSupplyAmount = parseFloat(formatUnits(totalSupply.data, vault.decimals));
    const tokenPrice = tokenPrices.data[vault.symbol as keyof typeof tokenPrices.data] || 1;
    
    // Calculate APY based on share price growth (simplified calculation)
    const sharePrice = totalSupplyAmount > 0 ? totalAssetsAmount / totalSupplyAmount : 1.0;
    const estimatedAPY = ((sharePrice - 1.0) * 100).toFixed(2);
    
    return {
      totalDeposits: totalAssets.data,
      totalDepositsUSD: totalAssetsAmount * tokenPrice,
      liquidity: totalAssets.data, // Using total assets as liquidity for now
      liquidityUSD: totalAssetsAmount * tokenPrice,
      apy: parseFloat(estimatedAPY),
      description: getVaultDescription(vault.symbol),
      curator: "Muscadine",
      curatorIcon: "M",
      collateral: getVaultCollateral(vault.symbol),
    };
  }, [vault, totalAssets.data, totalSupply.data, tokenPrices.data]);

  // Helper functions for vault-specific data
  const getVaultDescription = (symbol: string) => {
    switch (symbol) {
      case 'USDC':
        return "Muscadine USDC vault. Lending against the lowest risk crypto and real-world assets (RWAs). Curated by Muscadine which allocates billions in assets across all of DeFi.";
      case 'cbBTC':
        return "Muscadine cbBTC vault. Lending against Bitcoin and other blue-chip crypto assets. Curated by Muscadine for optimal yield generation.";
      case 'WETH':
        return "Muscadine WETH vault. Lending against Ethereum and other high-value crypto assets. Curated by Muscadine for sustainable yield.";
      default:
        return "Muscadine vault for optimal yield generation and risk management.";
    }
  };

  const getVaultCollateral = (symbol: string) => {
    switch (symbol) {
      case 'USDC':
        return ["USDC", "Bitcoin", "WETH", "Ethereum"];
      case 'cbBTC':
        return ["cbBTC", "USDC", "WETH", "Bitcoin"];
      case 'WETH':
        return ["WETH", "USDC", "Ethereum", "Bitcoin"];
      default:
        return [symbol];
    }
  };

  if (!vault || !vaultData) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#ef4444',
            margin: '0 0 1rem',
          }}>
            Vault Not Found
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: '0 0 1.5rem',
          }}>
            The vault address &quot;{vaultAddress}&quot; was not found.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
            }}
          >
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }


  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatTokenAmount = (amount: number, decimals: number, symbol: string): string => {
    const formattedAmount = (amount / Math.pow(10, decimals)).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals === 18 ? 4 : 2,
    });
    return `${formattedAmount} ${symbol}`;
  };

  const getTokenIcon = (symbol: string, size: number = 40) => {
    const tokenConfig = {
      USDC: {
        name: 'USD Coin',
        symbol: 'USDC',
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        decimals: 6,
        chainId: 8453,
      },
      cbBTC: {
        name: 'Coinbase Wrapped Staked ETH',
        symbol: 'cbBTC',
        address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
        decimals: 18,
        chainId: 8453,
      },
      WETH: {
        name: 'Wrapped Ether',
        symbol: 'WETH',
        address: '0x4200000000000000000000000000000000000006',
        decimals: 18,
        chainId: 8453,
      },
    };

    const token = tokenConfig[symbol as keyof typeof tokenConfig];
    if (!token) return null;

    return (
      <TokenImage
        token={token}
        size={size}
      />
    );
  };

  const tabs = ['Overview', 'Performance', 'Risk', 'Activity'];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <Link
              href="/"
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#0f172a',
                textDecoration: 'none',
              }}
            >
              Muscadine
            </Link>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              margin: '0.25rem 0 0',
            }}>
              DeFi Portfolio on Base
            </p>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#64748b',
            }}>
              Vault Details
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
          alignItems: 'start',
        }}>
          {/* Left Column */}
          <div>
            {/* Vault Title */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
            }}>
              {getTokenIcon(vault.symbol)}
              <div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: '0 0 0.5rem',
                }}>
                  Muscadine {vault.symbol} Vault
                </h1>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}>
                      {vaultData.curatorIcon}
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#0f172a',
                    }}>
                      {vaultData.curator}
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    {getTokenIcon(vault.symbol)}
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#0f172a',
                    }}>
                      {vault.symbol}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{
              marginBottom: '2rem',
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                lineHeight: '1.6',
                margin: '0 0 1rem',
              }}>
                {vaultData.description}
              </p>
              <div style={{
                fontSize: '0.75rem',
                color: '#64748b',
              }}>
                See: <a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>https://muscadine.box</a>
              </div>
            </div>

            {/* Key Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2rem',
              marginBottom: '2rem',
            }}>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  marginBottom: '0.5rem',
                }}>
                  Total Deposits
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  marginBottom: '0.25rem',
                }}>
                  {vaultData ? formatCurrency(vaultData.totalDepositsUSD) : 'Loading...'}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                }}>
                  {vaultData ? formatTokenAmount(vaultData.totalDeposits, vault.decimals, vault.symbol) : 'Loading...'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  marginBottom: '0.5rem',
                }}>
                  Liquidity
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  marginBottom: '0.25rem',
                }}>
                  {vaultData ? formatCurrency(vaultData.liquidityUSD) : 'Loading...'}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                }}>
                  {vaultData ? formatTokenAmount(vaultData.liquidity, vault.decimals, vault.symbol) : 'Loading...'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}>
                  APY
                  <span
                    title="Annual Percentage Yield - calculated from vault share price growth"
                    style={{
                      cursor: 'help',
                      fontSize: '0.75rem',
                    }}
                  >
                    ⓘ
                  </span>
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  marginBottom: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  {vaultData ? `${vaultData.apy.toFixed(2)}%` : 'Loading...'}
                  <span style={{ fontSize: '1rem', color: '#3b82f6' }}>✨</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{
              borderBottom: '1px solid #e2e8f0',
              marginBottom: '1rem',
            }}>
              <div style={{
                display: 'flex',
                gap: '2rem',
              }}>
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '0.75rem 0',
                      border: 'none',
                      background: 'none',
                      color: activeTab === tab ? '#0f172a' : '#64748b',
                      fontSize: '0.875rem',
                      fontWeight: activeTab === tab ? '600' : '400',
                      cursor: 'pointer',
                      borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div style={{
              padding: '1rem 0',
            }}>
              {activeTab === 'Overview' && (
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 1rem',
                  }}>
                    Vault Overview
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    lineHeight: '1.6',
                  }}>
                    This vault allows you to earn yield on your {vault.symbol} by lending it to the Muscadine protocol. 
                    Your funds are automatically allocated across the most profitable lending opportunities on Base.
                  </p>
                </div>
              )}
              {activeTab === 'Performance' && (
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 1rem',
                  }}>
                    Performance Metrics
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    lineHeight: '1.6',
                  }}>
                    Historical performance data and yield analytics for this vault.
                  </p>
                </div>
              )}
              {activeTab === 'Risk' && (
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 1rem',
                  }}>
                    Risk Assessment
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    lineHeight: '1.6',
                  }}>
                    Risk factors and security measures for this vault.
                  </p>
                </div>
              )}
              {activeTab === 'Activity' && (
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 1rem',
                  }}>
                    Recent Activity
                  </h3>
                  {vaultBalances.isLoading ? (
                    <div style={{
                      padding: '2rem',
                      textAlign: 'center',
                      color: '#64748b',
                    }}>
                      Loading activity data...
                    </div>
                  ) : (
                    <div>
                      <div style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1rem',
                      }}>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#64748b',
                          marginBottom: '0.5rem',
                        }}>
                          Current Vault Status
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '1rem',
                        }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Deposits</div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>
                              {vaultData ? formatCurrency(vaultData.totalDepositsUSD) : 'Loading...'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Share Price</div>
                            <div style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a' }}>
                              {vaultData && totalAssets.data && totalSupply.data ? 
                                ((parseFloat(formatUnits(totalAssets.data, vault.decimals)) / parseFloat(formatUnits(totalSupply.data, vault.decimals)))).toFixed(6) : 
                                'Loading...'}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#64748b',
                        lineHeight: '1.6',
                      }}>
                        Activity data powered by OnchainKit integration. Real-time vault metrics and transaction history.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}>
            {/* OnchainKit Earn Component - Moved to Top */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
              textAlign: 'center',
            }}>
              <Earn
                vaultAddress={vault.address}
                isSponsored={false}
              />
            </div>

            {/* Deposit Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 1rem',
              }}>
                Deposit {vault.symbol}
              </h3>
              <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '0.5rem',
              }}>
                0.00
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#64748b',
                marginBottom: '1.5rem',
              }}>
                $0
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
                {getTokenIcon(vault.symbol, 24)}
              </div>
            </div>

            {/* Earnings Summary */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1.5rem',
            }}>
              <h3 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#0f172a',
                margin: '0 0 1rem',
              }}>
                Projected Earnings
              </h3>
              
              <div style={{
                marginBottom: '1rem',
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  marginBottom: '0.25rem',
                }}>
                  Deposit ({vault.symbol})
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#0f172a',
                }}>
                  0.00
                </div>
              </div>

              <div style={{
                marginBottom: '1rem',
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  marginBottom: '0.25rem',
                }}>
                  APY
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}>
                  {vaultData.apy}%
                  <span style={{ fontSize: '0.75rem', color: '#3b82f6' }}>✨</span>
                </div>
              </div>

              <div style={{
                marginBottom: '1rem',
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  marginBottom: '0.25rem',
                }}>
                  Projected monthly earnings
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#0f172a',
                }}>
                  $0.00
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  marginBottom: '0.25rem',
                }}>
                  Projected yearly earnings
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#0f172a',
                }}>
                  $0.00
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        borderTop: '1px solid #e2e8f0',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{
            fontSize: '0.875rem',
            color: '#64748b',
          }}>
            © 2025 Muscadine. Built on Base with ❤️
          </div>
          <div style={{
            display: 'flex',
            gap: '1rem',
          }}>
            <Link href="/" style={{ fontSize: '0.875rem', color: '#64748b', textDecoration: 'none' }}>Portfolio</Link>
            <Link href="/dashboard" style={{ fontSize: '0.875rem', color: '#64748b', textDecoration: 'none' }}>Old Dashboard</Link>
            <a href="https://github.com/muscadine-box" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.875rem', color: '#64748b', textDecoration: 'none' }}>GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
