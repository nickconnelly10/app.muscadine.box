"use client";
import React from 'react';

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  disabled = false, 
  onClick,
  className = ''
}: ButtonProps) {
  const baseClasses = 'actionButton';
  const variantClasses = {
    primary: 'actionButtonPrimary',
    secondary: 'actionButtonSecondary',
    danger: 'actionButtonDanger'
  };
  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-3',
    lg: 'text-lg px-6 py-4'
  };
  const widthClasses = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'active' | 'inactive' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function Badge({ children, variant = 'active', className = '' }: BadgeProps) {
  const baseClasses = 'statusBadge';
  const variantClasses = {
    active: 'statusActive',
    inactive: 'statusInactive',
    success: 'statusActive',
    warning: 'statusWarning',
    danger: 'statusDanger'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

// Metric Component
interface MetricProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export function Metric({ 
  label, 
  value, 
  change, 
  changeType = 'neutral', 
  className = '' 
}: MetricProps) {
  const changeClasses = {
    positive: 'metricChangePositive',
    negative: 'metricChangeNegative',
    neutral: 'text-gray-500'
  };
  
  return (
    <div className={`metric ${className}`}>
      <div className="metricLabel">{label}</div>
      <div className="metricValue">{value}</div>
      {change && (
        <div className={`metricChange ${changeClasses[changeType]}`}>
          {change}
        </div>
      )}
    </div>
  );
}

// Mini Chart Component
interface MiniChartProps {
  data: number[];
  className?: string;
}

export function MiniChart({ data, className = '' }: MiniChartProps) {
  const maxValue = Math.max(...data);
  
  return (
    <div className={`miniChart ${className}`}>
      {data.map((value, index) => (
        <div
          key={index}
          className="chartBar"
          style={{
            height: `${(value / maxValue) * 100}%`,
            backgroundColor: value > 0 ? 'var(--success)' : 'var(--danger)'
          }}
        />
      ))}
    </div>
  );
}

// Loading Skeleton Component
interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export function Skeleton({ width = '100%', height = '1rem', className = '' }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height }}
    />
  );
}

// Vault Icon Component
interface VaultIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

export function VaultIcon({ symbol, size = 48, className = '' }: VaultIconProps) {
  const getIconColor = (symbol: string) => {
    switch (symbol) {
      case 'USDC': return '#2775CA';
      case 'cbBTC': return '#F7931A';
      case 'WETH': return '#627EEA';
      default: return '#6B7280';
    }
  };
  
  const getIconText = (symbol: string) => {
    switch (symbol) {
      case 'USDC': return 'USDC';
      case 'cbBTC': return '₿';
      case 'WETH': return 'Ξ';
      default: return symbol;
    }
  };
  
  return (
    <div
      className={`vaultIcon ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: getIconColor(symbol),
        color: 'white',
        fontSize: size * 0.4,
        fontWeight: 'bold'
      }}
    >
      {getIconText(symbol)}
    </div>
  );
}

// Balance Display Component
interface BalanceDisplayProps {
  total: string;
  className?: string;
}

export function BalanceDisplay({ total, className = '' }: BalanceDisplayProps) {
  return (
    <div className={`balanceDisplay ${className}`}>
      <div className="balanceLabel">Total Portfolio</div>
      <div className="balanceValue">{total}</div>
    </div>
  );
}

// Transaction Preview Component
interface TransactionPreviewProps {
  amount: string;
  gasFee: string;
  total: string;
  className?: string;
}

export function TransactionPreview({ amount, gasFee, total, className = '' }: TransactionPreviewProps) {
  return (
    <div className={`transactionPreview ${className}`}>
      <div className="previewRow">
        <span className="previewLabel">Amount</span>
        <span className="previewValue">{amount}</span>
      </div>
      <div className="previewRow">
        <span className="previewLabel">Gas Fee</span>
        <span className="previewValue">{gasFee}</span>
      </div>
      <div className="previewRow">
        <span className="previewLabel">Total</span>
        <span className="previewValue">{total}</span>
      </div>
    </div>
  );
}

// Step Indicator Component
interface StepIndicatorProps {
  current: number;
  total: number;
  className?: string;
}

export function StepIndicator({ current, total, className = '' }: StepIndicatorProps) {
  return (
    <div className={`stepIndicator ${className}`}>
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className={`step ${index < current ? 'stepCompleted' : index === current ? 'stepActive' : ''}`}
        />
      ))}
    </div>
  );
}
