"use client";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { WalletBalance } from "./components/WalletBalance";
import { FloatingWallet } from "./components/FloatingWallet";

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
        <FloatingWallet />
      </header>

      <div className={styles.content}>
        <Image
          priority
          src="/sphere.svg"
          alt="Sphere"
          width={200}
          height={200}
        />
        <h1 className={styles.title}>Portfolio Dashboard</h1>

        <div className={styles.portfolioSection}>
          <WalletBalance />
          <div style={{ marginTop: '20px' }}>
            <Link href="/portfolio" style={{ 
              display: 'inline-block', 
              padding: '12px 24px', 
              backgroundColor: '#0070f3', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '8px',
              fontWeight: '500'
            }}>
              View Full Portfolio →
            </Link>
          </div>
        </div>

        <div className={styles.portfolioStats}>
          <h2>Portfolio Overview</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Value</h3>
              <p>Connect wallet to view</p>
            </div>
            <div className={styles.statCard}>
              <h3>Assets</h3>
              <p>0 tokens</p>
            </div>
            <div className={styles.statCard}>
              <h3>Networks</h3>
              <p>Base</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
