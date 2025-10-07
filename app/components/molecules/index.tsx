"use client";
import React from 'react';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { 
  Earn,
  DepositAmountInput,
  DepositBalance,
  DepositButton,
  WithdrawAmountInput,
  WithdrawBalance,
  WithdrawButton
} from '@coinbase/onchainkit/earn';
import { Button, Badge, Metric, VaultIcon } from '../atoms';

// Vault Card Component
interface VaultCardProps {
  vault: {
    symbol: string;
    name: string;
    description: string;
    apy: number;
    deposited: string;
    depositedAmount?: number;
    earned: string;
    earnedAmount?: number;
    status: 'active' | 'inactive';
  };
  _chartData: number[];
  onDeposit: () => void;
  onWithdraw: () => void;
  className?: string;
}

export function VaultCard({ 
  vault, 
  _chartData, 
  onDeposit, 
  onWithdraw, 
  className = '' 
}: VaultCardProps) {
  return (
    <div className={`vaultCard ${className}`}>
      <div className="vaultHeader">
        <VaultIcon symbol={vault.symbol} />
        <div className="vaultInfo">
          <div className="vaultName">{vault.name}</div>
          <div className="vaultDescription">{vault.description}</div>
        </div>
        <Badge variant="active">
          {vault.apy.toFixed(2)}% APY
        </Badge>
      </div>
      
      <div className="vaultMetrics">
        <Metric
          label="Deposited"
          value={vault.deposited}
          change={vault.depositedAmount !== undefined ? `${vault.depositedAmount.toFixed(vault.symbol === 'USDC' ? 2 : vault.symbol === 'cbBTC' ? 8 : 6)} ${vault.symbol}` : undefined}
        />
        <Metric
          label="Earned Interest"
          value={vault.earned}
          change={vault.earnedAmount !== undefined ? `${vault.earnedAmount.toFixed(vault.symbol === 'USDC' ? 2 : vault.symbol === 'cbBTC' ? 8 : 6)} ${vault.symbol}` : undefined}
          changeType="positive"
        />
      </div>
      
      <div className="vaultActions">
        <Button variant="primary" onClick={onDeposit}>
          Deposit
        </Button>
        <Button variant="secondary" onClick={onWithdraw}>
          Withdraw
        </Button>
      </div>
    </div>
  );
}

// Portfolio Overview Component
interface PortfolioOverviewProps {
  totalValue: string;
  totalEarned: string;
  totalMonthlyExpected?: string;
  vaults: Array<{
    symbol: string;
    name: string;
    description: string;
    apy: number;
    deposited: string;
    earned: string;
    status: 'active' | 'inactive';
    usdValue: number;
    sharesAmount: number;
    assetsAmount: number;
    interestEarned: number;
    monthlyEarnings: number;
  }>;
  onVaultAction: (vaultSymbol: string, action: 'deposit' | 'withdraw') => void;
  className?: string;
}

export function PortfolioOverview({ 
  totalValue, 
  totalEarned,
  totalMonthlyExpected, 
  vaults, 
  onVaultAction, 
  className = '' 
}: PortfolioOverviewProps) {
  return (
    <div className={`portfolioOverview ${className}`}>
      <div className="portfolioHeader">
        <h1 className="portfolioTitle">Portfolio Overview</h1>
        <p className="portfolioSubtitle">
          Total Value: {totalValue} • Earned: {totalEarned}
          {totalMonthlyExpected && ` • Expected: ${totalMonthlyExpected}`}
        </p>
      </div>
      
      <div className="portfolioGrid">
        {vaults.map((vault) => (
          <VaultCard
            key={vault.symbol}
            vault={vault}
            _chartData={[]}
            onDeposit={() => onVaultAction(vault.symbol, 'deposit')}
            onWithdraw={() => onVaultAction(vault.symbol, 'withdraw')}
          />
        ))}
      </div>
    </div>
  );
}

// Deposit Flow Component with Enhanced UI and OnchainKit Integration
interface DepositFlowProps {
  vaultSymbol: string;
  vaultName: string;
  currentStep: number;
  totalSteps: number;
  amount: string;
  onAmountChange: (amount: string) => void;
  _onQuickAmount: (amount: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  maxAmount: string;
  gasFee: string;
  tokenPrice: number;
  vaultAddress?: string;
  ethBalance?: string;
  ethPrice?: number;
  className?: string;
}

export function DepositFlow({
  vaultSymbol,
  vaultName,
  currentStep,
  totalSteps,
  amount,
  onAmountChange,
  _onQuickAmount,
  onConfirm,
  onBack,
  maxAmount,
  gasFee,
  tokenPrice,
  vaultAddress,
  ethBalance = '0',
  ethPrice = 0,
  className = ''
}: DepositFlowProps) {
  const [dollarAmount, setDollarAmount] = React.useState('');
  const [showOnchainKit, setShowOnchainKit] = React.useState(false);
  const [depositType, setDepositType] = React.useState<'token' | 'eth'>('token');
  
  // Convert dollar amount to token amount
  const convertDollarToToken = (dollars: string) => {
    if (!dollars) return '';
    const dollarValue = parseFloat(dollars);
    if (isNaN(dollarValue)) return '';
    if (depositType === 'eth' && ethPrice > 0) {
      // For ETH deposits, convert USD to ETH
      return (dollarValue / ethPrice).toFixed(8);
    } else if (tokenPrice > 0) {
      // For token deposits, convert USD to token
      return (dollarValue / tokenPrice).toFixed(8);
    }
    return '';
  };
  
  // Convert token amount to dollar amount
  const convertTokenToDollar = (tokens: string) => {
    if (!tokens) return '';
    const tokenValue = parseFloat(tokens);
    if (isNaN(tokenValue)) return '';
    if (depositType === 'eth' && ethPrice > 0) {
      // For ETH deposits, convert ETH to USD
      return (tokenValue * ethPrice).toFixed(2);
    } else if (tokenPrice > 0) {
      // For token deposits, convert token to USD
      return (tokenValue * tokenPrice).toFixed(2);
    }
    return '';
  };
  
  const handleDollarChange = (dollars: string) => {
    setDollarAmount(dollars);
    const tokenAmount = convertDollarToToken(dollars);
    onAmountChange(tokenAmount);
  };
  
  const handleTokenChange = (tokens: string) => {
    onAmountChange(tokens);
    const dollarAmount = convertTokenToDollar(tokens);
    setDollarAmount(dollarAmount);
  };
  
  const handleMaxClick = () => {
    if (depositType === 'eth' && ethPrice > 0) {
      const maxDollars = parseFloat(ethBalance) * ethPrice;
      handleDollarChange(maxDollars.toFixed(2));
    } else {
      const maxDollars = parseFloat(maxAmount) * tokenPrice;
      handleDollarChange(maxDollars.toFixed(2));
    }
  };
  
  const quickDollarAmounts = ['100', '1000', '10000'];
  
  const total = parseFloat(amount) ? 
    (depositType === 'eth' && ethPrice > 0 
      ? (parseFloat(amount) * ethPrice + parseFloat(gasFee))
      : tokenPrice > 0 
        ? (parseFloat(amount) * tokenPrice + parseFloat(gasFee))
        : parseFloat(gasFee)
    ).toFixed(2) : 
    parseFloat(gasFee).toFixed(2);
  
  const amountUSD = amount ? 
    (depositType === 'eth' && ethPrice > 0 
      ? (parseFloat(amount) * ethPrice).toFixed(2)
      : tokenPrice > 0 
        ? (parseFloat(amount) * tokenPrice).toFixed(2)
        : '0.00'
    ) : '0.00';
  
  return (
    <div className={`depositFlow ${className}`}>
      {/* Step Indicator */}
      <div className="stepIndicator">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`step ${index < currentStep ? 'stepCompleted' : index === currentStep ? 'stepActive' : ''}`}
          />
        ))}
      </div>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button 
          onClick={onBack}
          className="backButton"
          style={{
            background: 'none',
            border: 'none',
            color: '#6366f1',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Back to Portfolio
        </button>
        <h2 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
          Deposit {vaultName}
        </h2>
        <div style={{ width: '120px' }}></div>
      </div>
      
      {!showOnchainKit ? (
        <>
          {/* Deposit Type Selector for WETH Vault */}
          {vaultSymbol === 'WETH' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Deposit Type
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setDepositType('token')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: `1px solid ${depositType === 'token' ? '#6366f1' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: depositType === 'token' ? '#eef2ff' : 'white',
                    color: depositType === 'token' ? '#6366f1' : '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  WETH
                </button>
                <button
                  onClick={() => setDepositType('eth')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: `1px solid ${depositType === 'eth' ? '#6366f1' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    background: depositType === 'eth' ? '#eef2ff' : 'white',
                    color: depositType === 'eth' ? '#6366f1' : '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  ETH (Auto-convert to WETH)
                </button>
              </div>
            </div>
          )}
          
          {/* Vault Information */}
          <div style={{ 
            marginBottom: '1.5rem', 
            padding: '1rem', 
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Available Balance ({depositType === 'eth' ? 'ETH' : vaultSymbol})
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                {depositType === 'eth' 
                  ? `${parseFloat(ethBalance).toFixed(6)} ETH ($${(parseFloat(ethBalance) * ethPrice).toFixed(2)})`
                  : `${parseFloat(maxAmount).toFixed(6)} ${vaultSymbol} ($${(parseFloat(maxAmount) * tokenPrice).toFixed(2)})`
                }
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {depositType === 'eth' ? 'ETH Price' : 'Token Price'}
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                ${depositType === 'eth' ? ethPrice.toLocaleString() : tokenPrice.toLocaleString()}
              </span>
            </div>
          </div>
          
          {/* Dollar Amount Input */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Dollar Amount (USD)
            </label>
            <input
              type="number"
              className="amountInput"
              placeholder="0.00"
              value={dollarAmount}
              onChange={(e) => handleDollarChange(e.target.value)}
              step="0.01"
              min="0"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none'
              }}
            />
          </div>
          
          {/* Token Amount Input */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              {depositType === 'eth' ? 'ETH Amount' : `${vaultSymbol} Amount`}
            </label>
            <input
              type="number"
              className="amountInput"
              placeholder="0.000000"
              value={amount}
              onChange={(e) => handleTokenChange(e.target.value)}
              step="0.000001"
              min="0"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                outline: 'none'
              }}
            />
          </div>
          
          {/* Quick Dollar Amounts */}
          <div className="quickAmounts" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {quickDollarAmounts.map((dollarAmt) => (
              <button
                key={dollarAmt}
                className="quickButton"
                onClick={() => handleDollarChange(dollarAmt)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                ${dollarAmt}
              </button>
            ))}
            <button
              className="quickButton"
              onClick={handleMaxClick}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #6366f1',
                borderRadius: '6px',
                background: '#eef2ff',
                color: '#6366f1',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              Max
            </button>
          </div>
          
          {/* Transaction Preview */}
          <div className="transactionPreview" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Amount</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                {amount || '0'} {depositType === 'eth' ? 'ETH' : vaultSymbol} (${amountUSD})
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Est. Gas Fee</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>${gasFee}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              paddingTop: '0.5rem',
              borderTop: '1px solid #e2e8f0'
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Total Cost</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#6366f1' }}>
                ${total}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          {vaultAddress ? (
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth 
              onClick={() => setShowOnchainKit(true)}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Continue to Deposit
            </Button>
          ) : (
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth 
              onClick={onConfirm}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Confirm Deposit
            </Button>
          )}
        </>
      ) : (
        <>
          {/* OnchainKit Integration for actual deposit */}
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setShowOnchainKit(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6366f1',
                cursor: 'pointer',
                fontSize: '0.875rem',
                marginBottom: '1rem'
              }}
            >
              ← Edit Amount
            </button>
          </div>
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px',
            backgroundColor: '#f8fafc'
          }}>
            <Earn vaultAddress={vaultAddress as `0x${string}`}>
              <DepositBalance />
              <DepositAmountInput />
              <DepositButton />
            </Earn>
          </div>
        </>
      )}
    </div>
  );
}

// Withdraw Flow Component with Enhanced Information
interface WithdrawFlowProps {
  vaultSymbol: string;
  vaultName: string;
  vaultAddress: string;
  onBack: () => void;
  vaultBalance?: string;
  vaultBalanceUSD?: string;
  tokenPrice?: number;
  estimatedAPY?: number;
  className?: string;
}

export function WithdrawFlow({
  vaultSymbol,
  vaultName,
  vaultAddress,
  onBack,
  vaultBalance = '0',
  vaultBalanceUSD = '$0.00',
  tokenPrice = 0,
  estimatedAPY = 0,
  className = ''
}: WithdrawFlowProps) {
  const [showCustomAmount, setShowCustomAmount] = React.useState(false);
  const [dollarAmount, setDollarAmount] = React.useState('');
  const [tokenAmount, setTokenAmount] = React.useState('');
  
  // Convert dollar amount to token amount
  const convertDollarToToken = (dollars: string) => {
    if (!dollars || !tokenPrice) return '';
    const dollarValue = parseFloat(dollars);
    if (isNaN(dollarValue)) return '';
    return (dollarValue / tokenPrice).toFixed(8);
  };
  
  // Convert token amount to dollar amount
  const convertTokenToDollar = (tokens: string) => {
    if (!tokens || !tokenPrice) return '';
    const tokenValue = parseFloat(tokens);
    if (isNaN(tokenValue)) return '';
    return (tokenValue * tokenPrice).toFixed(2);
  };
  
  const handleDollarChange = (dollars: string) => {
    setDollarAmount(dollars);
    const tokenAmt = convertDollarToToken(dollars);
    setTokenAmount(tokenAmt);
  };
  
  const handleTokenChange = (tokens: string) => {
    setTokenAmount(tokens);
    const dollarAmt = convertTokenToDollar(tokens);
    setDollarAmount(dollarAmt);
  };
  
  const handleMaxClick = () => {
    setTokenAmount(vaultBalance);
    const dollarAmt = convertTokenToDollar(vaultBalance);
    setDollarAmount(dollarAmt);
  };
  
  const quickDollarAmounts = ['100', '500', '1000'];
  
  return (
    <div className={`withdrawFlow ${className}`}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button 
          onClick={onBack}
          className="backButton"
          style={{
            background: 'none',
            border: 'none',
            color: '#6366f1',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          ← Back to Portfolio
        </button>
        <h2 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
          Withdraw {vaultName}
        </h2>
        <div style={{ width: '120px' }}></div>
      </div>
      
      {/* Vault Information */}
      <div style={{ 
        marginBottom: '1.5rem', 
        padding: '1rem', 
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Your Vault Balance</span>
          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
            {vaultBalance} {vaultSymbol} ({vaultBalanceUSD})
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Current APY</span>
          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
            {estimatedAPY.toFixed(2)}%
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Token Price</span>
          <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
            ${vaultSymbol === 'USDC' ? tokenPrice.toFixed(2) : tokenPrice.toLocaleString()}
          </span>
        </div>
      </div>
      
      {/* Amount Selection */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0 }}>Withdrawal Amount</h3>
          <button
            onClick={() => setShowCustomAmount(!showCustomAmount)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #6366f1',
              borderRadius: '6px',
              background: showCustomAmount ? '#eef2ff' : 'white',
              color: '#6366f1',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            {showCustomAmount ? 'Use OnchainKit' : 'Custom Amount'}
          </button>
        </div>
        
        {showCustomAmount && (
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            {/* Dollar Amount Input */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Dollar Amount (USD)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={dollarAmount}
                onChange={(e) => handleDollarChange(e.target.value)}
                step="0.01"
                min="0"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  outline: 'none'
                }}
              />
            </div>
            
            {/* Token Amount Input */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                {vaultSymbol} Amount
              </label>
              <input
                type="number"
                placeholder="0.000000"
                value={tokenAmount}
                onChange={(e) => handleTokenChange(e.target.value)}
                step="0.000001"
                min="0"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  outline: 'none'
                }}
              />
            </div>
            
            {/* Quick Amount Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              {quickDollarAmounts.map((dollarAmt) => (
                <button
                  key={dollarAmt}
                  onClick={() => handleDollarChange(dollarAmt)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  ${dollarAmt}
                </button>
              ))}
              <button
                onClick={handleMaxClick}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #6366f1',
                  borderRadius: '6px',
                  background: '#eef2ff',
                  color: '#6366f1',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}
              >
                Max
              </button>
            </div>
            
            {/* Amount Preview */}
            {tokenAmount && (
              <div style={{ 
                padding: '1rem',
                backgroundColor: '#f0fdf4',
                borderRadius: '6px',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '0.25rem' }}>
                  Withdrawal Preview
                </div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#15803d' }}>
                  {tokenAmount} {vaultSymbol} (${dollarAmount})
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* OnchainKit Withdraw Interface */}
      <div style={{ 
        padding: '2rem', 
        border: '1px solid #e2e8f0', 
        borderRadius: '12px',
        backgroundColor: '#f8fafc'
      }}>
        <Earn vaultAddress={vaultAddress as `0x${string}`}>
          <WithdrawBalance />
          <WithdrawAmountInput />
          <WithdrawButton />
        </Earn>
      </div>
      
      {/* Information Note */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#eff6ff',
        borderRadius: '8px',
        border: '1px solid #bfdbfe',
        fontSize: '0.875rem',
        color: '#1e40af'
      }}>
        <strong>Note:</strong> Withdrawing will remove your funds from the vault and stop earning interest. 
        You can deposit again anytime to resume earning.
      </div>
    </div>
  );
}

// Modern Header Component
interface ModernHeaderProps {
  totalValue: string;
  className?: string;
}

export function ModernHeader({ totalValue, className = '' }: ModernHeaderProps) {
  return (
    <header className={`modernHeader ${className}`}>
      <div className="brandSection">
        <a href="https://app.muscadine.box" className="brandText">Muscadine</a>
      </div>
      
      <div className="userSection">
        <div className="balanceDisplay">
          <div className="balanceLabel">Total Portfolio</div>
          <div className="balanceValue">{totalValue}</div>
        </div>
        <ConnectWallet />
      </div>
    </header>
  );
}
