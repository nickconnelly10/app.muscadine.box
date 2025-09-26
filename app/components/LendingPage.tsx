"use client";
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
import { useState, useMemo, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { base } from "wagmi/chains";
import { formatUnits } from "viem";
import styles from "../page.module.css";

export default function LendingPage() {
  const [activeTabs, setActiveTabs] = useState<{[key: string]: 'deposit' | 'withdraw'}>({
    usdc: 'deposit',
    cbeth: 'deposit',
    weth: 'deposit'
  });
  const { address, isConnected } = useAccount();

  const setActiveTab = (vaultKey: string, tab: 'deposit' | 'withdraw') => {
    setActiveTabs(prev => ({
      ...prev,
      [vaultKey]: tab
    }));
  };

  const vaults = {
    usdc: {
      address: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A' as const,
      name: 'USDC',
      symbol: 'USDC',
      description: 'Earn interest on USDC deposits',
      decimals: 6,
      price: 1
    },
    cbeth: {
      address: '0x6770216aC60F634483Ec073cBABC4011c94307Cb' as const,
      name: 'cBETH',
      symbol: 'cBETH',
      description: 'Earn interest on cBETH deposits',
      decimals: 18,
      price: 3500
    },
    weth: {
      address: '0x6b13c060F13Af1fdB319F52315BbbF3fb1D88844' as const,
      name: 'WETH',
      symbol: 'WETH',
      description: 'Earn interest on WETH deposits',
      decimals: 18,
      price: 3500
    }
  };

  // Token prices for USD calculations - using real-time data
  const [tokenPrices, setTokenPrices] = useState({
    USDC: 1,
    cBETH: 3500,
    WETH: 3500,
  });

  // Fetch real-time token prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Using CoinGecko API for real-time prices
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin&vs_currencies=usd');
        const data = await response.json();
        
        setTokenPrices({
          USDC: data['usd-coin']?.usd || 1,
          cBETH: data.ethereum?.usd || 3500, // cBETH tracks ETH price
          WETH: data.ethereum?.usd || 3500, // WETH tracks ETH price
        });
      } catch (error) {
        console.error('Failed to fetch token prices:', error);
        // Keep fallback prices
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

  const cbethVaultBalance = useReadContract({
    address: vaults.cbeth.address,
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

  const wethVaultBalance = useReadContract({
    address: vaults.weth.address,
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

  const cbethConvertToAssets = useReadContract({
    address: vaults.cbeth.address,
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
    args: cbethVaultBalance.data ? [cbethVaultBalance.data] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected && !!cbethVaultBalance.data,
    },
  });

  const wethConvertToAssets = useReadContract({
    address: vaults.weth.address,
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
    args: wethVaultBalance.data ? [wethVaultBalance.data] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected && !!wethVaultBalance.data,
    },
  });

  // Calculate vault balances and interest earned
  const vaultBalances = useMemo(() => {
    const balances = [];
    
    // For each vault, calculate the interest earned based on the difference
    // between the raw shares and the actual asset amount (including earned interest)
    
    // USDC Vault - calculate interest earned based on share exchange rate
    if (usdcVaultBalance.data && usdcConvertToAssets.data) {
      const sharesBalance = usdcVaultBalance.data;
      const assetsBalance = usdcConvertToAssets.data;
      
      const actualAssets = parseFloat(formatUnits(assetsBalance, vaults.usdc.decimals));
      const sharesAmount = parseFloat(formatUnits(sharesBalance, vaults.usdc.decimals));
      
      const value = actualAssets;
      const usdValue = value * tokenPrices.USDC;
      
      // Fix error in interest calculation due to units mismatch 
      let interestEarned = 0;
      
      if (actualAssets > 0 && sharesAmount > 0 && actualAssets >= sharesAmount) {
        // ConvertToAssets (what you'd get if redeemed) must be >= shares (what you initially got)
        // Interest is difference between redeemable vs originally invested amount
        const yieldValue = Math.max(0, Number(actualAssets) - Number(sharesAmount));
        interestEarned = Math.abs(yieldValue);
      }
      
      const interestUsd = interestEarned * tokenPrices.USDC;
      
      balances.push({
        vault: vaults.usdc,
        balance: value,
        formatted: value.toFixed(6),
        usdValue: usdValue,
        interest: Math.max(0, interestEarned), // Ensure non-negative
        interestUsd: Math.max(0, interestUsd), // Ensure non-negative
      });
    }

      // cBETH Vault - calculate interest earned
      if (cbethVaultBalance.data && cbethConvertToAssets.data) {
        const sharesBalance = cbethVaultBalance.data;
        const assetsBalance = cbethConvertToAssets.data;
        
        const actualAssets = parseFloat(formatUnits(assetsBalance, vaults.cbeth.decimals));
        const sharesAmount = parseFloat(formatUnits(sharesBalance, vaults.cbeth.decimals));
        
        const value = actualAssets;
        const usdValue = value * tokenPrices.cBETH;
        
        let interestEarned = 0;
        if (actualAssets > 0 && sharesAmount > 0 && actualAssets >= sharesAmount) {
          const yieldValue = Math.max(0, Number(actualAssets) - Number(sharesAmount));
          interestEarned = Math.abs(yieldValue);
        }
      
      const interestUsd = interestEarned * tokenPrices.cBETH;
      
      balances.push({
        vault: vaults.cbeth,
        balance: value,
        formatted: value.toFixed(6),
        usdValue: usdValue,
        interest: Math.max(0, interestEarned), // Ensure non-negative
        interestUsd: Math.max(0, interestUsd), // Ensure non-negative
      });
    }

      // WETH Vault - calculate interest earned
      if (wethVaultBalance.data && wethConvertToAssets.data) {
        const sharesBalance = wethVaultBalance.data;
        const assetsBalance = wethConvertToAssets.data;
        
        const actualAssets = parseFloat(formatUnits(assetsBalance, vaults.weth.decimals));
        const sharesAmount = parseFloat(formatUnits(sharesBalance, vaults.weth.decimals));
        
        const value = actualAssets;
        const usdValue = value * tokenPrices.WETH;
        
        let interestEarned = 0;
        if (actualAssets > 0 && sharesAmount > 0 && actualAssets >= sharesAmount) {
          const yieldValue = Math.max(0, Number(actualAssets) - Number(sharesAmount));
          interestEarned = Math.abs(yieldValue);
        }
      
      const interestUsd = interestEarned * tokenPrices.WETH;
      
      balances.push({
        vault: vaults.weth,
        balance: value,
        formatted: value.toFixed(6),
        usdValue: usdValue,
        interest: Math.max(0, interestEarned), // Ensure non-negative
        interestUsd: Math.max(0, interestUsd), // Ensure non-negative
      });
    }

    return balances;
  }, [usdcVaultBalance.data, cbethVaultBalance.data, wethVaultBalance.data, usdcConvertToAssets.data, cbethConvertToAssets.data, wethConvertToAssets.data, tokenPrices, vaults.usdc, vaults.cbeth, vaults.weth]);

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.title}>Lending</h2>
      <p className={styles.subtitle}>Earn interest on your crypto with Morpho vaults</p>
      
      {/* All Vaults Display */}
      <div className={styles.vaultsGrid}>
        {Object.entries(vaults).map(([key, vault]) => {
          const vaultBalance = vaultBalances.find(b => b.vault.symbol === vault.symbol);
          const currentVaultTab = activeTabs[key] || 'deposit';
          
          return (
            <div key={key} className={styles.vaultCard}>
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
                <div className={styles.vaultCardContent}>
                  {/* Vault Header */}
                  <div className={styles.vaultHeader}>
                    <h3 className={styles.vaultTitle}>{vault.name}</h3>
                    <p className={styles.vaultDescription}>{vault.description}</p>
                  </div>

                  {/* Vault Balance Info */}
                  <div className={styles.vaultBalanceInfo}>
                    <div className={styles.balanceRow}>
                      <span className={styles.balanceLabel}>Your Balance:</span>
                      <div className={styles.balanceValue}>
                        <span className={styles.balanceAmount}>
                          {vaultBalance ? vaultBalance.formatted : '0.000000'} {vault.symbol}
                        </span>
                        <span className={styles.balanceUsd}>
                          ${vaultBalance ? vaultBalance.usdValue.toFixed(2) : '0.00'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.balanceRow}>
                      <span className={styles.balanceLabel}>Interest Earned:</span>
                      <div className={styles.balanceValue}>
                        <span className={styles.balanceAmount}>
                          {vaultBalance ? vaultBalance.interest.toFixed(6) : '0.000000'} {vault.symbol}
                        </span>
                        <span className={styles.balanceUsd}>
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
                        className={`${styles.tabButton} ${currentVaultTab === 'deposit' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(key, 'deposit')}
                      >
                        Deposit
                      </button>
                      <button 
                        className={`${styles.tabButton} ${currentVaultTab === 'withdraw' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(key, 'withdraw')}
                      >
                        Withdraw
                      </button>
                    </div>
                    
                    <div className={styles.actionContent}>
                      {currentVaultTab === 'deposit' ? (
                        <>
                          <DepositBalance />
                          <DepositAmountInput className={styles.amountInput} />
                          <DepositButton className={styles.actionButton} />
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
          );
        })}
      </div>
    </div>
  );
}
