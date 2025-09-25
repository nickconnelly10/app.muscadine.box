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
import { useState } from "react";
import styles from "../page.module.css";

export default function LendingPage() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedVault, setSelectedVault] = useState<'usdc' | 'cbbtc' | 'weth'>('usdc');

  const vaults = {
    usdc: {
      address: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A' as const,
      name: 'USDC Morpho Vault',
      symbol: 'USDC',
      description: 'Earn interest on USDC deposits'
    },
    cbbtc: {
      address: '0x6770216aC60F634483Ec073cBABC4011c94307Cb' as const,
      name: 'cBBTC Morpho Vault',
      symbol: 'cBBTC',
      description: 'Earn interest on cBBTC deposits'
    },
    weth: {
      address: '0x6b13c060F13Af1fdB319F52315BbbF3fb1D88844' as const,
      name: 'WETH Morpho Vault',
      symbol: 'WETH',
      description: 'Earn interest on WETH deposits'
    }
  };

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.title}>Lending</h2>
      <p className={styles.subtitle}>Earn interest on your crypto with Morpho vaults</p>
      
      {/* Vault Selection */}
      <div className={styles.vaultSelection}>
        <h3 className={styles.vaultSelectionTitle}>Select Vault</h3>
        <div className={styles.vaultButtons}>
          {Object.entries(vaults).map(([key, vault]) => (
            <button
              key={key}
              className={`${styles.vaultButton} ${selectedVault === key ? styles.activeVault : ''}`}
              onClick={() => setSelectedVault(key as 'usdc' | 'cbbtc' | 'weth')}
            >
              <div className={styles.vaultButtonContent}>
                <span className={styles.vaultSymbol}>{vault.symbol}</span>
                <span className={styles.vaultName}>{vault.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Vault */}
      <div className={styles.unifiedVaultContainer}>
        <Earn 
          vaultAddress={vaults[selectedVault].address}
          isSponsored={true}
          onSuccess={(receipt) => {
            console.log("Transaction successful:", receipt);
          }}
          onError={(error) => {
            console.error("Transaction error:", error);
          }}
        >
          <div className={styles.unifiedVaultCard}>
            {/* Vault Header Section */}
            <div className={styles.vaultInfoSection}>
              <h3 className={styles.vaultTitle}>{vaults[selectedVault].name}</h3>
              <p className={styles.vaultDescription}>{vaults[selectedVault].description}</p>
              <div className={styles.vaultDetails}>
                <VaultDetails />
                <YieldDetails />
              </div>
            </div>
            
            {/* Single Action Section with Tabs */}
            <div className={styles.actionSection}>
              {/* Tab Selector */}
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
              
              {/* Action Content */}
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
    </div>
  );
}
