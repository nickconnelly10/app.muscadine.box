"use client";
import Image from "next/image";
import { TokenRow } from "@coinbase/onchainkit/token";
import { WalletIsland } from "@coinbase/onchainkit/wallet";
import { Transaction } from "@coinbase/onchainkit/transaction";
import styles from "../page.module.css";

export default function HomePage() {
  // Sample top coins data - in a real app, this would come from wallet data
  const topCoins = [
    {
      name: 'Ethereum',
      address: '0x0000000000000000000000000000000000000000' as const,
      symbol: 'ETH',
      decimals: 18,
      image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
      chainId: 8453,
    },
    {
      name: 'USD Coin',
      address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as const,
      symbol: 'USDC',
      decimals: 6,
      image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
      chainId: 8453,
    },
    {
      name: 'Wrapped Bitcoin',
      address: '0x4200000000000000000000000000000000000006' as const,
      symbol: 'WBTC',
      decimals: 8,
      image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
      chainId: 8453,
    },
  ];

  return (
    <div className={styles.tabContent}>
      <Image
        priority
        src="/sphere.svg"
        alt="Sphere"
        width={200}
        height={200}
      />
      <h1 className={styles.title}>MiniKit</h1>

      <p>
        Get started by editing <code>app/page.tsx</code>
      </p>

      {/* Wallet Section */}
      <div className={styles.walletSection}>
        <h2 className={styles.sectionTitle}>Your Wallet</h2>
        <div className={styles.walletIslandContainer}>
          <WalletIsland />
        </div>
        
        <div className={styles.topCoinsSection}>
          <h3 className={styles.subsectionTitle}>Top Holdings</h3>
          <div className={styles.coinsList}>
            {topCoins.map((coin) => (
              <div key={coin.address} className={styles.coinRow}>
                <TokenRow 
                  token={coin} 
                  amount="1,234.56"
                  onClick={(token) => console.log('Clicked token:', token)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className={styles.transactionsSection}>
        <h2 className={styles.sectionTitle}>Recent Transactions</h2>
        <div className={styles.transactionContainer}>
          <Transaction 
            calls={[]}
            onSuccess={(receipt) => {
              console.log('Transaction successful:', receipt);
            }}
            onError={(error) => {
              console.error('Transaction error:', error);
            }}
          />
        </div>
      </div>

      <h2 className={styles.componentsTitle}>Explore Components</h2>

      <ul className={styles.components}>
        {[
          {
            name: "Transaction",
            url: "https://docs.base.org/onchainkit/transaction/transaction",
          },
          {
            name: "Swap",
            url: "https://docs.base.org/onchainkit/swap/swap",
          },
          {
            name: "Checkout",
            url: "https://docs.base.org/onchainkit/checkout/checkout",
          },
          {
            name: "Wallet",
            url: "https://docs.base.org/onchainkit/wallet/wallet",
          },
          {
            name: "Identity",
            url: "https://docs.base.org/onchainkit/identity/identity",
          },
        ].map((component) => (
          <li key={component.name}>
            <a target="_blank" rel="noreferrer" href={component.url}>
              {component.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
