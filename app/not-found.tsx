import Link from "next/link";
import styles from "./page.module.css";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.mainContentBox}>
        <h1 className={styles.title}>404 - Page Not Found</h1>
        <p className={styles.subtitle}>The page you're looking for doesn't exist.</p>
        <Link href="/" className={styles.actionButton}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
