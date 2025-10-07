"use client";
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { Earn, useMorphoVault } from '@coinbase/onchainkit/earn';
import '@coinbase/onchainkit/styles.css';

// Vault configurations - using verified addresses
const VAULTS = [
  {
    address: '0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F' as `0x${string}`,
    name: 'USDC Vault',
    symbol: 'USDC',
  },
  {
    address: '0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9' as `0x${string}`,
    name: 'cbBTC Vault',
    symbol: 'cbBTC',
  },
  {
    address: '0x21e0d366272798da3A977FEBA699FCB91959d120' as `0x${string}`,
    name: 'WETH Vault',
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

  // Debug: Log vault status and errors
  console.log('USDC Vault Status:', usdcVault.status, 'Error:', usdcVault.error);
  console.log('cbBTC Vault Status:', cbbtcVault.status, 'Error:', cbbtcVault.error);
  console.log('WETH Vault Status:', wethVault.status, 'Error:', wethVault.error);
  
  // Log detailed vault data for debugging
  if (cbbtcVault.status === 'success') {
    console.log('cbBTC Vault Data:', {
      balance: cbbtcVault.balance,
      totalApy: cbbtcVault.totalApy,
      vaultName: cbbtcVault.vaultName,
      asset: cbbtcVault.asset,
      rewards: cbbtcVault.rewards
    });
  }

  // Calculate portfolio totals using ONLY real OnchainKit data
  // Total Deposited: Sum of user's balance across all vaults (in USD)
  const totalDeposited = Number(usdcVault.balance || 0) + Number(cbbtcVault.balance || 0) + Number(wethVault.balance || 0);
  
  // Total Interest Earned: Calculate from actual rewards data
  const totalInterestEarned = (
    (usdcVault.rewards?.[0]?.apy || 0) * Number(usdcVault.balance || 0) / 100 +
    (cbbtcVault.rewards?.[0]?.apy || 0) * Number(cbbtcVault.balance || 0) / 100 +
    (wethVault.rewards?.[0]?.apy || 0) * Number(wethVault.balance || 0) / 100
  );
  
  // Net Return: Total interest earned minus vault fees
  const totalNetEarned = totalInterestEarned * (1 - ((usdcVault.vaultFee || 0) + (cbbtcVault.vaultFee || 0) + (wethVault.vaultFee || 0)) / 100);
  
  // Initial Deposited: Total deposited minus interest earned
  const initialDeposited = totalDeposited - totalInterestEarned;
  
  // Expected Monthly Interest: Based on actual APY from OnchainKit
  const expectedMonthly = (
    Number(usdcVault.balance || 0) * (usdcVault.totalApy || 0) / 100 / 12 +
    Number(cbbtcVault.balance || 0) * (cbbtcVault.totalApy || 0) / 100 / 12 +
    Number(wethVault.balance || 0) * (wethVault.totalApy || 0) / 100 / 12
  );


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
                  {formatCurrency(totalDeposited)}
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
                  {formatCurrency(initialDeposited)}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  fontWeight: '500',
                  marginBottom: '0.5rem'
                }}>
                  Net Return
                </div>
                <div style={{
                  fontSize: '1.875rem',
                  fontWeight: '700',
                  color: '#10b981'
                }}>
                  {formatCurrency(totalNetEarned)}
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
                  {formatCurrency(totalInterestEarned)}
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
                  {formatCurrency(expectedMonthly)}/month
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
                    {vault.address === VAULTS[0].address ? (usdcVault.totalApy ? `${usdcVault.totalApy.toFixed(2)}%` : 'Loading...') :
                     vault.address === VAULTS[1].address ? (cbbtcVault.totalApy ? `${cbbtcVault.totalApy.toFixed(2)}%` : 'Loading...') :
                     vault.address === VAULTS[2].address ? (wethVault.totalApy ? `${wethVault.totalApy.toFixed(2)}%` : 'Loading...') : 'Loading...'} APY
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

