"use client";
import React from 'react';
import Link from 'next/link';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { VAULTS } from '../../contexts/PortfolioContext';
import { TokenImage } from '@coinbase/onchainkit/token';
import { useMorphoVault } from '@coinbase/onchainkit/earn';
import { useAccount } from 'wagmi';

export default function DeFiPositions() {
  const { vaultPositions, isConnected } = usePortfolio();
  const { address } = useAccount();

  // Get vault by symbol
  const getVaultBySymbol = (symbol: string) => {
    return VAULTS.find(vault => vault.symbol === symbol);
  };

  // Get vault configs
  const usdcVaultConfig = getVaultBySymbol('USDC');
  const cbbtcVaultConfig = getVaultBySymbol('cbBTC');
  const ethVaultConfig = getVaultBySymbol('WETH');

  // Get accurate vault data from OnchainKit
  const usdcVault = useMorphoVault({
    vaultAddress: usdcVaultConfig?.address as `0x${string}`,
    recipientAddress: address
  });

  const cbbtcVault = useMorphoVault({
    vaultAddress: cbbtcVaultConfig?.address as `0x${string}`,
    recipientAddress: address
  });

  const ethVault = useMorphoVault({
    vaultAddress: ethVaultConfig?.address as `0x${string}`,
    recipientAddress: address
  });

  // Get accurate APY data from OnchainKit
  const getAccurateAPY = (symbol: string) => {
    switch (symbol) {
      case 'USDC':
        return usdcVault?.totalApy || 0;
      case 'cbBTC':
        return cbbtcVault?.totalApy || 0;
      case 'WETH':
        return ethVault?.totalApy || 0;
      default:
        return 0;
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

  const formatTokenAmount = (amount: number, decimals: number, symbol: string): string => {
    const formattedAmount = (amount / Math.pow(10, decimals)).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals === 18 ? 4 : 2,
    });
    return `${formattedAmount} ${symbol}`;
  };

  const getTokenIcon = (symbol: string) => {
    const tokenConfig = {
      USDC: {
        name: 'USD Coin',
        symbol: 'USDC',
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as `0x${string}`,
        decimals: 6,
        chainId: 8453,
        image: null,
      },
      cbBTC: {
        name: 'Coinbase Wrapped Staked ETH',
        symbol: 'cbBTC',
        address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22' as `0x${string}`,
        decimals: 18,
        chainId: 8453,
        image: null,
      },
      WETH: {
        name: 'Wrapped Ether',
        symbol: 'WETH',
        address: '0x4200000000000000000000000000000000000006' as `0x${string}`,
        decimals: 18,
        chainId: 8453,
        image: null,
      },
    };

    const token = tokenConfig[symbol as keyof typeof tokenConfig];
    if (!token) return null;

    return (
      <TokenImage
        token={token}
        size={32}
      />
    );
  };

  const getCollateralIcons = (symbol: string) => {
    const icons = [];
    switch (symbol) {
      case 'USDC':
        icons.push('$', '₿');
        break;
      case 'cbBTC':
        icons.push('₿', '$', 'Ξ');
        break;
      case 'WETH':
        icons.push('Ξ', '$', '₿');
        break;
    }
    
    return icons.map((icon, index) => (
      <div
        key={index}
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: index === 0 ? '#2775ca' : index === 1 ? '#f7931a' : '#627eea',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold',
          marginLeft: index > 0 ? '-4px' : '0',
          border: '2px solid white',
          zIndex: icons.length - index,
          position: 'relative',
        }}
      >
        {icon}
      </div>
    ));
  };

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
          DeFi Vaults
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: '0.25rem 0 0',
        }}>
          Earn yield on your assets
        </p>
      </div>

      {/* Table Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
        gap: '1rem',
        padding: '1rem 1.5rem',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        fontSize: '0.75rem',
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        <div>Vault</div>
        <div>Deposits ↓</div>
        <div>Curator</div>
        <div>Collateral</div>
        <div>APY</div>
      </div>

      {/* Vault Rows */}
      <div>
        {VAULTS.map((vault, index) => {
          const position = vaultPositions.find(p => p.vaultAddress === vault.address);
          const hasBalance = position && position.balance > 0;
          const userDepositAmount = hasBalance ? position.balance : 0;
          const userDepositUSD = hasBalance ? position.usdValue : 0;

          // Get accurate APY data from OnchainKit
          const accurateAPY = getAccurateAPY(vault.symbol);

          return (
            <Link
              key={vault.address}
              href={`/${vault.address}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                gap: '1rem',
                padding: '1.25rem 1.5rem',
                borderBottom: index < VAULTS.length - 1 ? '1px solid #f1f5f9' : 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {/* Vault */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                {getTokenIcon(vault.symbol)}
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#0f172a',
                    marginBottom: '0.25rem',
                  }}>
                    Muscadine {vault.symbol} Vault
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                  }}>
                    {vault.underlying}
                  </div>
                </div>
              </div>

              {/* Deposits */}
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '0.25rem',
                }}>
                  {isConnected && hasBalance ? formatTokenAmount(userDepositAmount, vault.decimals, vault.symbol) : '0.00 ' + vault.symbol}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#64748b',
                  backgroundColor: '#f1f5f9',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '12px',
                  display: 'inline-block',
                }}>
                  {isConnected && hasBalance ? formatCurrency(userDepositUSD) : '$0.00'}
                </div>
              </div>

              {/* Curator */}
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
                  M
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#0f172a',
                }}>
                  Muscadine
                </div>
              </div>

              {/* Collateral */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
              }}>
                {getCollateralIcons(vault.symbol)}
              </div>

              {/* APY */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#0f172a',
                }}>
                  {accurateAPY > 0 ? `${accurateAPY.toFixed(2)}%` : 'Loading...'}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#3b82f6',
                }}>
                  ✨
                </div>
              </div>
            </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

