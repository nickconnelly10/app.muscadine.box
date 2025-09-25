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
import { useState, useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import { base } from "wagmi/chains";
import { formatUnits } from "viem";
import styles from "../page.module.css";

export default function LendingPage() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const { address, isConnected } = useAccount();

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

  // Token prices for USD calculations
  const tokenPrices = useMemo(() => ({
    USDC: 1,
    cBETH: 3500,
    WETH: 3500,
  }), []);

  // Get vault balances for each vault
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
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Calculate vault balances and values
  const vaultBalances = useMemo(() => {
    const balances = [];
    
    // USDC Vault
    if (usdcVaultBalance.data) {
      const formatted = formatUnits(usdcVaultBalance.data, vaults.usdc.decimals);
      const value = parseFloat(formatted);
      const usdValue = value * tokenPrices.USDC;
      balances.push({
        vault: vaults.usdc,
        balance: value,
        formatted: value.toFixed(6),
        usdValue: usdValue,
        interest: 0, // Placeholder - would need to calculate from vault
        interestUsd: 0,
      });
    }

    // cBETH Vault
    if (cbethVaultBalance.data) {
      const formatted = formatUnits(cbethVaultBalance.data, vaults.cbeth.decimals);
      const value = parseFloat(formatted);
      const usdValue = value * tokenPrices.cBETH;
      balances.push({
        vault: vaults.cbeth,
        balance: value,
        formatted: value.toFixed(6),
        usdValue: usdValue,
        interest: 0, // Placeholder - would need to calculate from vault
        interestUsd: 0,
      });
    }

    // WETH Vault
    if (wethVaultBalance.data) {
      const formatted = formatUnits(wethVaultBalance.data, vaults.weth.decimals);
      const value = parseFloat(formatted);
      const usdValue = value * tokenPrices.WETH;
      balances.push({
        vault: vaults.weth,
        balance: value,
        formatted: value.toFixed(6),
        usdValue: usdValue,
        interest: 0, // Placeholder - would need to calculate from vault
        interestUsd: 0,
      });
    }

    return balances;
  }, [usdcVaultBalance.data, cbethVaultBalance.data, wethVaultBalance.data, tokenPrices, vaults.usdc, vaults.cbeth, vaults.weth]);

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.title}>Lending</h2>
      <p className={styles.subtitle}>Earn interest on your crypto with Morpho vaults</p>
      
      {/* All Vaults Display */}
      <div className={styles.vaultsGrid}>
        {Object.entries(vaults).map(([key, vault]) => {
          const vaultBalance = vaultBalances.find(b => b.vault.symbol === vault.symbol);
          
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
                        className={`${styles.tabButton} ${activeTab === 'deposit' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('deposit')}
                      >
                        Deposit
                      </button>
                      <button 
                        className={`${styles.tabButton} ${activeTab === 'withdraw' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('withdraw')}
                      >
                        Withdraw
                      </button>
                    </div>
                    
                    <div className={styles.actionContent}>
                      {activeTab === 'deposit' ? (
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
