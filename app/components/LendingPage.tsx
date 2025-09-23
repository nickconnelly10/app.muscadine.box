"use client";
import { Earn, EarnDeposit, EarnWithdraw, EarnDetails } from "@coinbase/onchainkit/earn";
import styles from "../page.module.css";

export default function LendingPage() {
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.title}>Lending</h2>
      <p className={styles.subtitle}>Earn interest on your crypto with Morpho vaults</p>
      
      <div className={styles.morphoVaultContainer}>
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
          <div className={styles.vaultHeader}>
            <h3>USDC Morpho Vault</h3>
            <EarnDetails />
          </div>
          
          <div className={styles.vaultActions}>
            <div className={styles.actionCard}>
              <h4>Deposit</h4>
              <EarnDeposit />
            </div>
            
            <div className={styles.actionCard}>
              <h4>Withdraw</h4>
              <EarnWithdraw />
            </div>
          </div>
        </Earn>
      </div>
    </div>
  );
}
