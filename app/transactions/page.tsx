"use client";
import { WalletIsland } from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";
import { useState } from "react";
import styles from "../page.module.css";

export default function Transactions() {
  const { address, isConnected } = useAccount();
  
  // Transaction history state
  const [txHistory] = useState([{
    id: 1,
    hash: "0x123456789abcdef...",
    amount: "-1.5 ETH",
    type: "Swap",
    date: "2025-01-26 15:42 UTC",
    status: "Completed"
  }]);

  return (
    <div className={styles.tabContent}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Transactions</h2>
        <WalletIsland />
      </div>

      {isConnected && address ? (
        <div className={styles.transactionsSection}>
          {/* Transactions Header */}
          <div className={styles.transactionsHeader}>
            <h3 className={styles.subsectionTitle}>Recent Transactions</h3>
            <div className={styles.transactionIndicator}>
              <div className={styles.liveIndicator}>Live</div>
            </div>
          </div>

          {/* Transactions List */}
          <div className={styles.transactionsList}>
            {txHistory && txHistory.length > 0 ? (
              txHistory.map((tx) => (
                <div key={tx.id} className={styles.transactionCard}>
                  <div className={styles.transactionDetails}>
                    <div className={styles.transactionMain}>
                      <span className={styles.transactionAmount}>{tx.amount}</span>
                      <span className={styles.transactionType}>{tx.type}</span>
                    </div>
                    <div className={styles.transactionMeta}>
                      <span className={styles.statusBadge}>{tx.status}</span>
                      <span className={styles.transactionDate}>{tx.date}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyTransactions}>
                <p>No recent transactions</p>
              </div>
            )}
            {isConnected && address && (
              <div className={styles.transactionFooter}>
                <a 
                  href={`https://basescan.org/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.basescanLink}
                >
                  View on BaseScan ↗
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.emptyPrompt}>
          <span>Connect wallet to view transaction history</span>
          <p>Wallet Connect to see your transaction activity on Base network</p>
        </div>
      )}
    </div>
  );
}
