"use client";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../page.module.css";

interface SharedLayoutProps {
  children: React.ReactNode;
}

export default function SharedLayout({ children }: SharedLayoutProps) {
  const pathname = usePathname();
  const miniKit = useMiniKit();
  const user = miniKit?.context?.user;

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
        {user && (
          <div className={styles.userInfo}>
            <span>Welcome, {user.displayName || `User ${user.fid}`}</span>
          </div>
        )}
      </header>

      <div className={styles.mainContentBox}>
        <div className={styles.tabs}>
          <Link 
            href="/" 
            className={`${styles.tab} ${pathname === '/' ? styles.activeTab : ''}`}
          >
            Portfolio
          </Link>
          <Link 
            href="/lending" 
            className={`${styles.tab} ${pathname === '/lending' ? styles.activeTab : ''}`}
          >
            Lending  
          </Link>
          <Link 
            href="/swap" 
            className={`${styles.tab} ${pathname === '/swap' ? styles.activeTab : ''}`}
          >
            Swap
          </Link>
          <Link 
            href="/transactions" 
            className={`${styles.tab} ${pathname === '/transactions' ? styles.activeTab : ''}`}
          >
            Transactions
          </Link>
        </div>
        
        <div className={styles.tabPanel}>
          {children}
        </div>
      </div>
    </div>
  );
}
