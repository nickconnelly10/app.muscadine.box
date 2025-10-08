"use client";
import React from 'react';
import Link from 'next/link';

export default function LendBorrowCTA() {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      backgroundImage: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 0.5rem',
        }}>
          Lend & Borrow on Base
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: '#64748b',
          margin: '0 0 2rem',
        }}>
          Maximize your DeFi strategy with Muscadine vaults and Morpho borrowing
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {/* Lend CTA */}
          <Link
            href="/lending"
            style={{
              padding: '1.25rem',
              backgroundColor: '#ffffff',
              border: '2px solid #4f46e5',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              display: 'block',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4f46e5';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '1.5rem',
              marginBottom: '0.5rem',
            }}>
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '0.25rem',
            }}>
              Lend in Muscadine Vaults
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#64748b',
            }}>
              Earn up to 8.5% APY on your assets
            </div>
          </Link>

          {/* Borrow CTA */}
          <a
            href="https://morpho.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '1.25rem',
              backgroundColor: '#ffffff',
              border: '2px solid #10b981',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              display: 'block',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontSize: '1.5rem',
              marginBottom: '0.5rem',
            }}>
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#0f172a',
              marginBottom: '0.25rem',
            }}>
              Borrow on Morpho
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#64748b',
            }}>
              Access competitive borrowing rates
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

