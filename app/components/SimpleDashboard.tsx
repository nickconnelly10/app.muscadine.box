"use client";
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Earn, useMorphoVault } from '@coinbase/onchainkit/earn';
import '@coinbase/onchainkit/styles.css';

// Vault configurations - using verified addresses
const VAULTS = [
  {
    address: '0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F' as `0x${string}`,
    name: 'Muscadine USDC Vault',
    symbol: 'USDC',
  },
  {
    address: '0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9' as `0x${string}`,
    name: 'Muscadine cbBTC Vault',
    symbol: 'cbBTC',
  },
  {
    address: '0x21e0d366272798da3A977FEBA699FCB91959d120' as `0x${string}`,
    name: 'Muscadine WETH Vault',
    symbol: 'WETH',
  },
];

export default function SimpleDashboard() {
  const { isConnected, address } = useAccount();

  // Fetch vault data from OnchainKit
  const usdcVault = useMorphoVault({
    vaultAddress: VAULTS[0].address,
    recipientAddress: address
  });

  const cbbtcVault = useMorphoVault({
    vaultAddress: VAULTS[1].address,
    recipientAddress: address
  });

  const wethVault = useMorphoVault({
    vaultAddress: VAULTS[2].address,
    recipientAddress: address
  });

  // Helper function to get vault data by address
  const getVaultData = (vaultAddress: string) => {
    if (vaultAddress === VAULTS[0].address) return usdcVault;
    if (vaultAddress === VAULTS[1].address) return cbbtcVault;
    if (vaultAddress === VAULTS[2].address) return wethVault;
    return null;
  };

  // Calculate portfolio totals using OnchainKit data
  // Total balance across all vaults
  const totalBalance = Number(usdcVault.balance || 0) + Number(cbbtcVault.balance || 0) + Number(wethVault.balance || 0);
  
  // Calculate vault-specific interest for each vault
  const getVaultInterest = (vault: typeof usdcVault) => {
    const balance = Number(vault.balance || 0);
    const apy = vault.totalApy || 0;
    return balance * (apy / 100);
  };
  
  // Total projected annual interest across all vaults
  const totalProjectedAnnualInterest = 
    getVaultInterest(usdcVault) + 
    getVaultInterest(cbbtcVault) + 
    getVaultInterest(wethVault);
  
  // Calculate net return after fees for each vault
  const getNetReturn = (vault: typeof usdcVault) => {
    const annualInterest = getVaultInterest(vault);
    const fee = vault.vaultFee || 0;
    return annualInterest * (1 - fee / 100);
  };
  
  const totalNetReturn = 
    getNetReturn(usdcVault) + 
    getNetReturn(cbbtcVault) + 
    getNetReturn(wethVault);
  
  // Expected monthly interest: annual interest divided by 12
  const expectedMonthly = totalProjectedAnnualInterest / 12;


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '2rem 1rem'
    }}>
      {/* Header/Banner */}
      <header style={{
        maxWidth: '1200px',
        margin: '0 auto 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#0f172a',
            margin: 0
          }}>
            <a 
              href="https://muscadine.box" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: '#0f172a',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              Muscadine
            </a>
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: '0.25rem 0 0'
          }}>
            DeFi Lending on Base
          </p>
        </div>
        <ConnectWallet />
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Portfolio Overview */}
        {isConnected && (
          <div style={{
            padding: '2rem',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            marginBottom: '2rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '1.5rem'
            }}>
              Portfolio Overview
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Total Balance
                </div>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#0f172a'
                }}>
                  {formatCurrency(totalBalance)}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Projected Annual Return
                </div>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#10b981'
                }}>
                  {formatCurrency(totalProjectedAnnualInterest)}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Net Annual Return
                </div>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#10b981'
                }}>
                  {formatCurrency(totalNetReturn)}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Expected Monthly
                </div>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#6366f1'
                }}>
                  {formatCurrency(expectedMonthly)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vault Cards using OnchainKit Earn */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.25rem'
        }}>
          {VAULTS.map((vault) => (
            <div
              key={vault.address}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                padding: '1.25rem',
                overflow: 'visible'
              }}
            >
              <div style={{
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: '0 0 0.5rem'
                }}>
                  {vault.name}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.625rem'
                }}>
                  <span style={{
                    fontSize: '0.8125rem',
                    color: '#64748b'
                  }}>
                    {vault.symbol}
                  </span>
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: '600',
                    color: '#10b981',
                    backgroundColor: '#dcfce7',
                    padding: '0.2rem 0.625rem',
                    borderRadius: '9999px'
                  }}>
                    {(() => {
                      const vaultData = getVaultData(vault.address);
                      return vaultData?.totalApy ? `${vaultData.totalApy.toFixed(2)}% APY` : 'Loading...';
                    })()}
                  </span>
                </div>
                
                {/* Custom stats section */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  padding: '0.625rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      fontWeight: '500',
                      marginBottom: '0.25rem'
                    }}>
                      Balance
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#0f172a'
                    }}>
                      {(() => {
                        const vaultData = getVaultData(vault.address);
                        return formatCurrency(Number(vaultData?.balance || 0));
                      })()}
                    </div>
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      fontWeight: '500',
                      marginBottom: '0.25rem'
                    }}>
                      Projected Annual
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#10b981'
                    }}>
                      {(() => {
                        const vaultData = getVaultData(vault.address);
                        return vaultData ? formatCurrency(getVaultInterest(vaultData)) : '$0.00';
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* OnchainKit Earn Component */}
              <div style={{
                margin: '-0.25rem -0.75rem -0.75rem -0.75rem',
                padding: '0',
                overflow: 'visible'
              }}>
                <Earn
                  vaultAddress={vault.address}
                  isSponsored={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

