"use client";
import Image from 'next/image';
import { 
  Earn, 
  DepositAmountInput,
  DepositBalance,
  DepositButton,
  WithdrawAmountInput,
  WithdrawBalance,
  WithdrawButton,
  YieldDetails,
  VaultDetails
} from "@coinbase/onchainkit/earn";
import { ETHDepositComponent } from "./ETHDepositComponent";
import { useState, useMemo, useEffect } from "react";
import { useAccount, useReadContract, useBalance } from "wagmi";
import { base } from "wagmi/chains";
import { formatUnits } from "viem";
import styles from "../page.module.css";

export default function LendingPage() {
  const [activeTabs, setActiveTabs] = useState<{[key: string]: 'deposit' | 'withdraw'}>({
    usdc: 'deposit',
    cbbtc: 'deposit',
    eth: 'deposit'
  });
  const [expandedVaults, setExpandedVaults] = useState<{[key: string]: boolean}>({
    usdc: false,
    cbbtc: false,
    eth: false
  });
  const { address, isConnected } = useAccount();

  // Get wallet balances for each token using correct BaseScan addresses
  const usdcWalletBalance = useBalance({
    address: address,
    token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const cbbtcWalletBalance = useBalance({
    address: address,
    token: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf', // cbBTC on Base
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const wethWalletBalance = useBalance({
    address: address,
    token: '0x4200000000000000000000000000000000000006', // WETH on Base
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const ethWalletBalance = useBalance({
    address: address,
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  const setActiveTab = (vaultKey: string, tab: 'deposit' | 'withdraw') => {
    setActiveTabs(prev => ({
      ...prev,
      [vaultKey]: tab
    }));
  };

  const toggleVaultExpansion = (vaultKey: string) => {
    setExpandedVaults(prev => ({
      ...prev,
      [vaultKey]: !prev[vaultKey]
    }));
  };

  // Token prices for USD calculations - using real-time data
  const [tokenPrices, setTokenPrices] = useState({
    USDC: 1.00,
    cbBTC: 65000,
    ETH: 3500,
  });

  const vaults = {
    usdc: {
      address: '0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F' as const,
      name: 'Muscadine USDC Vault',
      symbol: 'USDC',
      description: 'Morpho v1 USDC vault - Earn interest on USDC deposits',
      decimals: 6,
      price: tokenPrices.USDC, // USDC is always $1.00
      tokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
      tokenName: 'USD Coin',
      tokenSymbol: 'USDC'
    },
    cbbtc: {
      address: '0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9' as const,
      name: 'Muscadine cbBTC Vault',
      symbol: 'cbBTC',
      description: 'Morpho v1 cbBTC vault - Earn interest on cbBTC deposits',
      decimals: 8,
      price: tokenPrices.cbBTC, // Use real-time price
      tokenAddress: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf', // cbBTC on Base
      tokenName: 'Coinbase Wrapped BTC',
      tokenSymbol: 'cbBTC'
    },
    eth: {
      address: '0x21e0d366272798da3A977FEBA699FCB91959d120' as const,
      name: 'Muscadine ETH Vault',
      symbol: 'ETH',
      description: 'Morpho v1 ETH vault - Earn interest on ETH deposits (automatically wrapped to WETH)',
      decimals: 18,
      price: tokenPrices.ETH, // Use real-time price
      tokenAddress: '0x4200000000000000000000000000000000000006', // WETH on Base
      tokenName: 'Wrapped Ether',
      tokenSymbol: 'WETH'
    }
  };

  // Fetch real-time token prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Using CoinGecko API for real-time prices
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
        const data = await response.json();
        
        setTokenPrices({
          USDC: 1.00, // USDC is always $1.00
          cbBTC: data.bitcoin?.usd || 65000, // cbBTC tracks BTC price 
          ETH: data.ethereum?.usd || 3500, // ETH price
        });
      } catch (error) {
        console.error('Failed to fetch token prices:', error);
        // Keep fallback prices
        setTokenPrices({
          USDC: 1.00,
          cbBTC: 65000,
          ETH: 3500,
        });
      }
    };

    fetchPrices();
    // Update prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get vault balances for each vault using proper Morpho functions
  const usdcVaultBalance = useReadContract({
    address: vaults.usdc.address,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
      {
        name: 'convertToAssets',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'shares', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const cbbtcVaultBalance = useReadContract({
    address: vaults.cbbtc.address,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
      {
        name: 'convertToAssets',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'shares', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const ethVaultBalance = useReadContract({
    address: vaults.eth.address,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
      {
        name: 'convertToAssets',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'shares', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Get convertToAssets calls for each vault
  const usdcConvertToAssets = useReadContract({
    address: vaults.usdc.address,
    abi: [
      {
        name: 'convertToAssets',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'shares', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'convertToAssets',
    args: usdcVaultBalance.data ? [usdcVaultBalance.data] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected && !!usdcVaultBalance.data,
    },
  });

  const cbbtcConvertToAssets = useReadContract({
    address: vaults.cbbtc.address,
    abi: [
      {
        name: 'convertToAssets',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'shares', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'convertToAssets',
    args: cbbtcVaultBalance.data ? [cbbtcVaultBalance.data] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected && !!cbbtcVaultBalance.data,
    },
  });

  const ethConvertToAssets = useReadContract({
    address: vaults.eth.address,
    abi: [
      {
        name: 'convertToAssets',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'shares', type: 'uint256' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'convertToAssets',
    args: ethVaultBalance.data ? [ethVaultBalance.data] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected && !!ethVaultBalance.data,
    },
  });

  // State for storing yield rates from OnchainKit
  const [yieldRates, _setYieldRates] = useState<{[key: string]: number}>({
    usdc: 0.05, // Default 5% APY
    cbbtc: 0.05,
    eth: 0.05
  });

  // Calculate vault balances and interest earned
  const vaultBalances = useMemo(() => {
    const balances = [];
    
    // For Morpho vaults, the interest is reflected in the share price appreciation
    // convertToAssets(shares) returns the current value including earned interest
    // We'll use a more sophisticated approach to estimate interest
    
    // USDC Vault - calculate current value and estimated interest
    if (usdcVaultBalance.data && usdcConvertToAssets.data) {
      const sharesBalance = usdcVaultBalance.data;
      const assetsBalance = usdcConvertToAssets.data;
      
      const currentValue = parseFloat(formatUnits(assetsBalance, vaults.usdc.decimals));
      const sharesAmount = parseFloat(formatUnits(sharesBalance, vaults.usdc.decimals));
      
      const usdValue = currentValue * tokenPrices.USDC;
      
      // Calculate interest based on current yield rate
      // This is an approximation - in reality you'd need deposit history
      let estimatedInterest = 0;
      if (currentValue > 0 && sharesAmount > 0) {
        // Use the yield rate from state (updated by YieldDetails component)
        const annualYieldRate = yieldRates.usdc;
        // Estimate interest as a portion of current value based on yield rate
        estimatedInterest = currentValue * (annualYieldRate / 12); // Monthly approximation
      }
      
      const interestUsd = estimatedInterest * tokenPrices.USDC;
      
      balances.push({
        vault: vaults.usdc,
        balance: currentValue,
        formatted: currentValue.toFixed(6),
        usdValue: usdValue,
        interest: estimatedInterest,
        interestUsd: interestUsd,
      });
    }

    // cbBTC Vault - calculate current value and estimated interest
    if (cbbtcVaultBalance.data && cbbtcConvertToAssets.data) {
      const sharesBalance = cbbtcVaultBalance.data;
      const assetsBalance = cbbtcConvertToAssets.data;
      
      const currentValue = parseFloat(formatUnits(assetsBalance, vaults.cbbtc.decimals));
      const sharesAmount = parseFloat(formatUnits(sharesBalance, vaults.cbbtc.decimals));
      
      const usdValue = currentValue * tokenPrices.cbBTC;
      
      let estimatedInterest = 0;
      if (currentValue > 0 && sharesAmount > 0) {
        const annualYieldRate = yieldRates.cbbtc;
        estimatedInterest = currentValue * (annualYieldRate / 12); // Monthly approximation
      }
      
      const interestUsd = estimatedInterest * tokenPrices.cbBTC;
      
      balances.push({
        vault: vaults.cbbtc,
        balance: currentValue,
        formatted: currentValue.toFixed(6),
        usdValue: usdValue,
        interest: estimatedInterest,
        interestUsd: interestUsd,
      });
    }

    // ETH Vault - calculate current value and estimated interest
    if (ethVaultBalance.data && ethConvertToAssets.data) {
      const sharesBalance = ethVaultBalance.data;
      const assetsBalance = ethConvertToAssets.data;
      
      const currentValue = parseFloat(formatUnits(assetsBalance, vaults.eth.decimals));
      const sharesAmount = parseFloat(formatUnits(sharesBalance, vaults.eth.decimals));
      
      const usdValue = currentValue * tokenPrices.ETH;
      
      let estimatedInterest = 0;
      if (currentValue > 0 && sharesAmount > 0) {
        const annualYieldRate = yieldRates.eth;
        estimatedInterest = currentValue * (annualYieldRate / 12); // Monthly approximation
      }
      
      const interestUsd = estimatedInterest * tokenPrices.ETH;
      
      balances.push({
        vault: vaults.eth,
        balance: currentValue,
        formatted: currentValue.toFixed(6),
        usdValue: usdValue,
        interest: estimatedInterest,
        interestUsd: interestUsd,
      });
    }

    return balances;
  }, [usdcVaultBalance.data, cbbtcVaultBalance.data, ethVaultBalance.data, usdcConvertToAssets.data, cbbtcConvertToAssets.data, ethConvertToAssets.data, tokenPrices, vaults.usdc, vaults.cbbtc, vaults.eth, yieldRates]);

  // Calculate total amounts
  const totalSupplied = vaultBalances.reduce((sum, balance) => sum + balance.usdValue, 0);
  const totalInterest = vaultBalances.reduce((sum, balance) => sum + balance.interestUsd, 0);
  const totalSuppliedWithInterest = totalSupplied + totalInterest;

  return (
    <div className={styles.tabContent}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Earn interest on your crypto with Muscadine Morpho vaults</h1>
      </div>
      
      {/* Total Amount Supplied Section */}
      <div className={styles.totalSuppliedSection}>
        <div className={styles.totalSuppliedCard}>
          <h2 className={styles.totalSuppliedTitle}>Total Supplied</h2>
          <div className={styles.totalSuppliedAmount}>
            ${totalSuppliedWithInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={styles.totalInterestAmount}>
            {totalInterest > 0 ? (
              <>+ ${totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} interest accrued</>
            ) : (
              <>Interest will accrue over time</>
            )}
          </div>
        </div>
      </div>
      
      {/* Horizontal Vault Display */}
      <div className={styles.vaultsContainer}>
        {Object.entries(vaults).map(([key, vault]) => {
          const vaultBalance = vaultBalances.find(b => b.vault.tokenSymbol === vault.tokenSymbol);
          const isExpanded = expandedVaults[key] || false;
          
          return (
            <div key={key} className={styles.vaultRow}>
              {/* Main Vault Row - Always Visible */}
              <div 
                className={styles.vaultRowMain}
                onClick={() => toggleVaultExpansion(key)}
              >
                {/* Asset Identification */}
                <div className={styles.assetInfo}>
                  <div className={styles.assetIcon}>
                    {vault.tokenSymbol === 'USDC' && (
                      <>
                        <Image 
                          src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                          alt="USDC"
                          width={40}
                          height={40}
                          className={styles.tokenLogo}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextSibling) {
                              nextSibling.style.display = 'block';
                            }
                          }}
                        />
                        <div className={styles.fallbackIcon} style={{display: 'none', backgroundColor: '#2775CA'}}>
                          <span style={{color: 'white', fontSize: '16px', fontWeight: 'bold'}}>USDC</span>
                        </div>
                      </>
                    )}
                    {vault.tokenSymbol === 'cbBTC' && (
                      <>
                        <Image 
                          src="https://cryptologos.cc/logos/bitcoin-btc-logo.png"
                          alt="cbBTC"
                          width={40}
                          height={40}
                          className={styles.tokenLogo}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextSibling) {
                              nextSibling.style.display = 'block';
                            }
                          }}
                        />
                        <div className={styles.fallbackIcon} style={{display: 'none', backgroundColor: '#F7931A'}}>
                          <span style={{color: 'white', fontSize: '14px', fontWeight: 'bold'}}>₿</span>
                        </div>
                      </>
                    )}
                    {vault.tokenSymbol === 'WETH' && (
                      <>
                        <Image 
                          src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                          alt="WETH"
                          width={40}
                          height={40}
                          className={styles.tokenLogo}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextSibling = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextSibling) {
                              nextSibling.style.display = 'block';
                            }
                          }}
                        />
                        <div className={styles.fallbackIcon} style={{display: 'none', backgroundColor: '#627EEA'}}>
                          <span style={{color: 'white', fontSize: '16px', fontWeight: 'bold'}}>Ξ</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className={styles.assetName}>
                    <div className={styles.assetSymbol}>{vault.tokenSymbol}</div>
                    <div className={styles.assetFullName}>
                      {vault.tokenName}
                    </div>
                  </div>
                </div>

                {/* Network Tags */}
                <div className={styles.networkTags}>
                  <span className={styles.v1Tag}>V1 vault</span>
                  <span className={styles.baseTag}>Base</span>
                </div>

                {/* Financial Metrics */}
                <div className={styles.financialMetrics}>
                  <div className={styles.price}>
                    ${vault.tokenSymbol === 'USDC' ? vault.price.toFixed(2) : vault.price.toLocaleString()}
                  </div>
                  <div className={styles.interestRates}>
                    <Earn 
                      vaultAddress={vault.address}
                      isSponsored={true}
                      onSuccess={() => {}}
                      onError={() => {}}
                    >
                      <YieldDetails />
                    </Earn>
                  </div>
                </div>

                {/* Vault Totals and Actions */}
                <div className={styles.vaultTotals}>
                  <div className={styles.totalValue}>
                    ${vaultBalance ? vaultBalance.usdValue.toLocaleString() : '0'}
                  </div>
                  <div className={styles.totalAmount}>
                    {vaultBalance ? vaultBalance.formatted : '0.000000'} {vault.tokenSymbol}
                  </div>
                  <div className={styles.supplyBorrowSection}>
                    <div className={styles.amountDisplay}>
                      <span className={styles.amountLabel}>Available:</span>
                      <span className={styles.amountValue}>
                        ${(() => {
                          let walletBalance = 0;
                          if (vault.tokenSymbol === 'USDC' && usdcWalletBalance.data) {
                            walletBalance = parseFloat(formatUnits(usdcWalletBalance.data.value, usdcWalletBalance.data.decimals)) * tokenPrices.USDC;
                          } else if (vault.tokenSymbol === 'cbBTC' && cbbtcWalletBalance.data) {
                            walletBalance = parseFloat(formatUnits(cbbtcWalletBalance.data.value, cbbtcWalletBalance.data.decimals)) * tokenPrices.cbBTC;
                          } else if (vault.tokenSymbol === 'WETH') {
                            // For ETH vault, show combined ETH + WETH balance
                            let ethBalance = 0;
                            let wethBalance = 0;
                            
                            if (ethWalletBalance.data) {
                              ethBalance = parseFloat(formatUnits(ethWalletBalance.data.value, ethWalletBalance.data.decimals)) * tokenPrices.ETH;
                            }
                            
                            if (wethWalletBalance.data) {
                              wethBalance = parseFloat(formatUnits(wethWalletBalance.data.value, wethWalletBalance.data.decimals)) * tokenPrices.ETH;
                            }
                            
                            walletBalance = ethBalance + wethBalance;
                          }
                          return walletBalance.toFixed(2);
                        })()}
                      </span>
                    </div>
                    <div className={styles.actionButtons}>
                      <button className={styles.supplyButton}>Supply</button>
                      <button className={styles.withdrawButton}>Withdraw</button>
                    </div>
                  </div>
                </div>

                {/* Expand Icon */}
                <div className={styles.expandIcon}>
                  {isExpanded ? '▼' : '▶'}
                </div>
              </div>

              {/* Expanded Vault Content */}
              {isExpanded && (
                <div className={styles.vaultExpandedContent}>
                  <Earn 
                    vaultAddress={vault.address}
                    isSponsored={true}
                    onSuccess={(receipt) => {
                      console.log("Transaction successful:", receipt);
                    }}
                    onError={(error) => {
                      console.error("Transaction error:", error);
                    }}
                  >
                    <div className={styles.vaultDetailsContent}>
                      {/* Vault Description */}
                      <div className={styles.vaultDescription}>
                        <p>{vault.description}</p>
                        {vault.symbol === 'ETH' && (
                          <div className={styles.ethConversionNote}>
                            <p><strong>Note:</strong> This vault accepts native ETH deposits. Your ETH will be automatically wrapped to WETH when deposited, and unwrapped back to ETH when withdrawn.</p>
                          </div>
                        )}
                      </div>

                      {/* Interest Earned Info */}
                      <div className={styles.vaultInterestInfo}>
                        <div className={styles.interestRow}>
                          <span className={styles.interestLabel}>Interest Earned:</span>
                          <div className={styles.interestValue}>
                            <span className={styles.interestAmount}>
                              {vaultBalance ? vaultBalance.interest.toFixed(6) : '0.000000'} {vault.tokenSymbol}
                            </span>
                            <span className={styles.interestUsd}>
                              ${vaultBalance ? vaultBalance.interestUsd.toFixed(2) : '0.00'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Vault Details */}
                      <div className={styles.vaultDetails}>
                        <VaultDetails />
                        <YieldDetails />
                      </div>

                      {/* Action Section */}
                      <div className={styles.vaultActions}>
                        <div className={styles.tabSelector}>
                          <button 
                            className={`${styles.tabButton} ${activeTabs[key] === 'deposit' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(key, 'deposit')}
                          >
                            Deposit
                          </button>
                          <button 
                            className={`${styles.tabButton} ${activeTabs[key] === 'withdraw' ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(key, 'withdraw')}
                          >
                            Withdraw
                          </button>
                        </div>
                        
                        <div className={styles.actionContent}>
                          {activeTabs[key] === 'deposit' ? (
                            <>
                              {/* Use custom ETH deposit component for ETH vault */}
                              {vault.tokenSymbol === 'WETH' ? (
                                <ETHDepositComponent
                                  vaultAddress={vault.address}
                                  onSuccess={(receipt) => {
                                    console.log("ETH deposit successful:", receipt);
                                  }}
                                  onError={(error) => {
                                    console.error("ETH deposit error:", error);
                                  }}
                                />
                              ) : (
                                <>
                                  <DepositBalance />
                                  <DepositAmountInput className={styles.amountInput} />
                                  <DepositButton className={styles.actionButton} />
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <WithdrawBalance />
                              <WithdrawAmountInput className={styles.amountInput} />
                              <WithdrawButton className={styles.actionButton} />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Earn>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
