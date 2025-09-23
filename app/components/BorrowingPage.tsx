"use client";
import styles from "../page.module.css";

export default function BorrowingPage() {
  return (
    <div className={styles.tabContent}>
      <h2 className={styles.title}>Borrowing</h2>
      <p className={styles.subtitle}>Borrow against your assets with competitive rates</p>
      
      <div className={styles.comingSoonContainer}>
        <div className={styles.comingSoonCard}>
          <h3>Coming Soon</h3>
          <p>Borrowing features are currently in development. Stay tuned for updates!</p>
          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>💱</span>
              <span>Borrow against your crypto assets</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>📊</span>
              <span>Competitive interest rates</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>🛡️</span>
              <span>Safe and secure lending protocols</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>⚡</span>
              <span>Instant borrowing with no waiting</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
