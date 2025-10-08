"use client";
import React, { useMemo } from 'react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { useVaultHistory } from '../../hooks/useVaultHistory';
import { VAULTS } from '../../contexts/PortfolioContext';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  color?: string;
  loading?: boolean;
  tooltip?: string;
}

function MetricCard({ label, value, subValue, color = '#0f172a', loading, tooltip }: MetricCardProps) {
  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.75rem',
      }}>
        <div style={{
          fontSize: '0.875rem',
          color: '#64748b',
          fontWeight: '500',
        }}>
          {label}
        </div>
        {tooltip && (
          <div
            title={tooltip}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#e2e8f0',
              color: '#64748b',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'help',
              fontWeight: '600',
            }}
          >
            ?
          </div>
        )}
      </div>
      {loading ? (
        <div style={{
          height: '2.5rem',
          backgroundColor: '#f1f5f9',
          borderRadius: '6px',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }} />
      ) : (
        <>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color,
            lineHeight: '1.2',
          }}>
            {value}
          </div>
          {subValue && (
            <div style={{
              fontSize: '0.875rem',
              color: '#64748b',
              marginTop: '0.25rem',
            }}>
              {subValue}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PortfolioMetrics() {
  const { 
    totalPortfolioValue, 
    vaultPositions,
    isConnected,
    address,
    prices,
    pricesLoading,
  } = usePortfolio();

  // Fetch vault history for each vault to calculate net deposits and earned interest
  const usdcHistory = useVaultHistory(
    VAULTS[0].address,
    address,
    vaultPositions.find(v => v.symbol === 'USDC')?.usdValue || 0,
    6, // USDC decimals
    prices.USDC.price
  );

  const cbbtcHistory = useVaultHistory(
    VAULTS[1].address,
    address,
    vaultPositions.find(v => v.symbol === 'cbBTC')?.usdValue || 0,
    8, // cbBTC decimals
    prices.cbBTC.price
  );

  const wethHistory = useVaultHistory(
    VAULTS[2].address,
    address,
    vaultPositions.find(v => v.symbol === 'WETH')?.usdValue || 0,
    18, // WETH decimals
    prices.WETH.price
  );

  // Calculate portfolio-wide metrics (memoized for performance)
  const { netDeposits, earnedInterest, pnl, pnlPercentage } = useMemo(() => {
    const netDep = 
      usdcHistory.netDeposits + 
      cbbtcHistory.netDeposits + 
      wethHistory.netDeposits;

    const earned = 
      usdcHistory.interestEarned + 
      cbbtcHistory.interestEarned + 
      wethHistory.interestEarned;

    // Calculate PnL (for vaults only, since we have historical data)
    const vaultCurrentValue = vaultPositions.reduce((sum, pos) => sum + pos.usdValue, 0);
    const pnlValue = vaultCurrentValue - netDep;
    const pnlPct = netDep > 0 ? (pnlValue / netDep) * 100 : 0;

    return {
      netDeposits: netDep,
      earnedInterest: earned,
      pnl: pnlValue,
      pnlPercentage: pnlPct,
    };
  }, [
    usdcHistory.netDeposits, 
    usdcHistory.interestEarned,
    cbbtcHistory.netDeposits,
    cbbtcHistory.interestEarned,
    wethHistory.netDeposits,
    wethHistory.interestEarned,
    vaultPositions,
  ]);

  const formatCurrency = (amount: number): string => {
    if (amount === 0 && !isConnected) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number): string => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const loading = pricesLoading || usdcHistory.isLoading || cbbtcHistory.isLoading || wethHistory.isLoading;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
    }}>
      <MetricCard
        label="Total Value"
        value={formatCurrency(totalPortfolioValue)}
        tooltip="Total value of all your assets (wallet + vaults) on Base"
        loading={loading}
      />
      
      <MetricCard
        label="Net Deposits"
        value={formatCurrency(netDeposits)}
        subValue="In vaults"
        tooltip="Total deposits minus withdrawals across all vaults"
        loading={loading}
      />
      
      <MetricCard
        label="Earned Interest"
        value={formatCurrency(earnedInterest)}
        subValue="Estimated"
        color="#10b981"
        tooltip="Estimated interest earned from vault positions (current value - net deposits)"
        loading={loading}
      />
      
      <MetricCard
        label="Vault PnL"
        value={formatCurrency(pnl)}
        subValue={netDeposits > 0 ? formatPercentage(pnlPercentage) : undefined}
        color={pnl >= 0 ? '#10b981' : '#ef4444'}
        tooltip="Profit/Loss from vault positions (includes earned interest and price changes)"
        loading={loading}
      />
    </div>
  );
}

