"use client";
import React, { Suspense, lazy } from 'react';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Address, EthBalance } from '@coinbase/onchainkit/identity';
import { usePortfolio } from '../../contexts/PortfolioContext';
import PortfolioMetrics from './PortfolioMetrics';
import HistoricalGraph from './HistoricalGraph';
import ErrorBanner from './ErrorBanner';
import { base } from 'wagmi/chains';

// Lazy load lower priority components for better performance
const TokensList = lazy(() => import('./TokensList'));
const DeFiPositions = lazy(() => import('./DeFiPositions'));
const LendBorrowCTA = lazy(() => import('./LendBorrowCTA'));

// Loading fallback component
function LoadingCard() {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
    }}>
      <div style={{
        height: '200px',
        backgroundColor: '#f1f5f9',
        borderRadius: '6px',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }} />
    </div>
  );
}

export default function Portfolio() {
  const { isConnected, chainId, pricesError } = usePortfolio();

  const isWrongChain = isConnected && chainId !== base.id; // Used in JSX below

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
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#0f172a',
              margin: 0,
            }}>
              <a
                href="https://muscadine.box"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#0f172a',
                  textDecoration: 'none',
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
              margin: '0.25rem 0 0',
            }}>
              DeFi Portfolio on Base
            </p>
          </div>
          <Wallet>
            <ConnectWallet>
              <Avatar style={{ width: '24px', height: '24px' }} />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity  hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </header>

      {/* Chain mismatch banner */}
      {isWrongChain && (
        <div style={{
          backgroundColor: '#fef3c7',
          borderBottom: '1px solid #fde68a',
          padding: '0.75rem 1.5rem',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#92400e',
          }}>
            <span>⚠️</span>
            <span>Please switch to Base network to view your portfolio and interact with vaults</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
      }}>
        {/* Error banner for pricing failures */}
        {pricesError && (
          <ErrorBanner
            message="Unable to fetch current token prices. Showing cached or fallback prices."
            dismissible={true}
          />
        )}

        {/* Always show the dashboard */}
        {/* Desktop: Two column layout */}
            <div 
              className="portfolio-desktop"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2rem',
                alignItems: 'start',
              }}
            >
              {/* Left column - sticky */}
              <div style={{
                position: 'sticky',
                top: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}>
                <PortfolioMetrics />
                <Suspense fallback={<LoadingCard />}>
                  <TokensList />
                </Suspense>
                <HistoricalGraph />
              </div>

              {/* Right column - scrollable */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}>
                <Suspense fallback={<LoadingCard />}>
                  <DeFiPositions />
                </Suspense>
                <Suspense fallback={<LoadingCard />}>
                  <LendBorrowCTA />
                </Suspense>
              </div>
            </div>

            {/* Mobile: Stacked layout */}
            <div 
              className="portfolio-mobile"
              style={{
                display: 'none',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              <PortfolioMetrics />
              <HistoricalGraph />
              <Suspense fallback={<LoadingCard />}>
                <TokensList />
              </Suspense>
              <Suspense fallback={<LoadingCard />}>
                <DeFiPositions />
              </Suspense>
              <Suspense fallback={<LoadingCard />}>
                <LendBorrowCTA />
              </Suspense>
            </div>

        <style jsx>{`
          @media (max-width: 1024px) {
            .portfolio-desktop {
              display: none !important;
            }
            .portfolio-mobile {
              display: flex !important;
            }
          }
        `}</style>
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
            gap: '1.5rem',
          }}>
            <a
              href="https://muscadine.box"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.875rem',
                color: '#64748b',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
            >
              About
            </a>
            <a
              href="https://docs.muscadine.box"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.875rem',
                color: '#64748b',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
            >
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

