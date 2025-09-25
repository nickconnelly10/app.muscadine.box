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

  return (
    <div className={styles.tabContent}>
      <h2 className={styles.title}>Lending</h2>
      <p className={styles.subtitle}>Earn interest on your crypto with Morpho vaults</p>
      
      <div className={styles.unifiedVaultContainer}>
        <Earn 
          vaultAddress="0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A"
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
              <h3 className={styles.vaultTitle}>USDC Morpho Vault</h3>
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
