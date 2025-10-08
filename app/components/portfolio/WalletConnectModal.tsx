"use client";
import React from 'react';
import { Wallet, ConnectWallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { Identity, Avatar, Name, Address, EthBalance } from '@coinbase/onchainkit/identity';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#64748b',
            padding: '0.25rem',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ×
        </button>

        {/* Modal content */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
          }}>
            🏦
          </div>
          
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#0f172a',
            margin: '0 0 0.75rem',
          }}>
            Connect Your Wallet
          </h2>
          
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            marginBottom: '2rem',
            lineHeight: '1.5',
          }}>
            Connect your wallet to view your DeFi portfolio, track your positions, and earn yield on Base
          </p>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <Wallet>
              <ConnectWallet>
                <Avatar style={{ width: '24px', height: '24px' }} />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
          
          <p style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            margin: 0,
          }}>
            You can view the portfolio without connecting, but connecting enables full functionality
          </p>
        </div>
      </div>
    </div>
  );
}
