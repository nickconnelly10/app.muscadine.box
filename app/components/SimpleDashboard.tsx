"use client";
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Earn } from '@coinbase/onchainkit/earn';
import '@coinbase/onchainkit/styles.css';

// Vault configurations
const VAULTS = [
  {
    address: '0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F' as `0x${string}`,
    name: 'USDC Vault',
    symbol: 'USDC',
    apy: '8.5%',
  },
  {
    address: '0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9' as `0x${string}`,
    name: 'cbBTC Vault',
    symbol: 'cbBTC',
    apy: '6.2%',
  },
  {
    address: '0x21e0d366272798da3A977FEBA699FCB91959d120' as `0x${string}`,
    name: 'WETH Vault',
    symbol: 'WETH',
    apy: '7.8%',
  },
];

export default function SimpleDashboard() {
  const { isConnected } = useAccount();

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
            Muscadine
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
                  Total Value
                </div>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#0f172a'
                }}>
                  $0.00
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Initial Value
                </div>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#0f172a'
                }}>
                  $0.00
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Total Earned
                </div>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#10b981'
                }}>
                  $0.00
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Earned Interest
                </div>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#10b981'
                }}>
                  $0.00
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Expected
                </div>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#6366f1'
                }}>
                  $0.00/month
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vault Cards using OnchainKit Earn */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {VAULTS.map((vault) => (
            <div
              key={vault.address}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                padding: '1.5rem',
                overflow: 'hidden'
              }}
            >
              <div style={{
                marginBottom: '1rem'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: '0 0 0.5rem'
                }}>
                  {vault.name}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                    color: '#64748b'
                  }}>
                    {vault.symbol}
                  </span>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#10b981',
                    backgroundColor: '#dcfce7',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px'
                  }}>
                    {vault.apy} APY
                  </span>
                </div>
              </div>

              {/* OnchainKit Earn Component */}
              <div style={{
                margin: '-0.5rem -0.5rem -0.5rem -0.5rem',
                padding: '0'
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

