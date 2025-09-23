"use client";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useState } from "react";
import HomePage from "./components/HomePage";
import LendingPage from "./components/LendingPage";
import { useQuickAuth, useMiniKit } from "@coinbase/onchainkit/minikit";
import styles from "./page.module.css";

type TabType = "home" | "lending";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  // If you need to verify the user's identity, you can use the useQuickAuth hook.
  // This hook will verify the user's signature and return the user's FID. You can update
  // this to meet your needs. See the /app/api/auth/route.ts file for more details.
  // Note: If you don't need to verify the user's identity, you can get their FID and other user data
  // via `useMiniKit().context?.user`.
  const { data: _data, isLoading: _isLoading, error: _error } = useQuickAuth<{
    userFid: string;
  }>("/api/auth");
  
  // Get user context and MiniKit state
  const miniKit = useMiniKit();
  const user = miniKit?.context?.user;

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />;
      case "lending":
        return <LendingPage />;
      default:
        return null;
    }
  };

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
          <button
            className={`${styles.tab} ${activeTab === "home" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            className={`${styles.tab} ${activeTab === "lending" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("lending")}
          >
            Lending
          </button>
        </div>
        
        <div className={styles.tabPanel}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
