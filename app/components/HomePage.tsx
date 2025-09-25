"use client";
import { TokenRow } from "@coinbase/onchainkit/token";
import { WalletIsland } from "@coinbase/onchainkit/wallet";
import { Transaction } from "@coinbase/onchainkit/transaction";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { base } from "wagmi/chains";
import { formatUnits } from "viem";
import { useState, useEffect, useMemo } from "react";
import styles from "../page.module.css";

export default function HomePage() {
  const { address, isConnected } = useAccount();
  
  // Define tokens to track on Base network
  const tokensToTrack = useMemo(() => [
    {
      name: 'Ethereum',
      address: '0x0000000000000000000000000000000000000000' as const,
      symbol: 'ETH',
      decimals: 18,
      image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
      chainId: base.id,
    },
    {
      name: 'USD Coin',
      address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as const,
      symbol: 'USDC',
      decimals: 6,
      image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
      chainId: base.id,
    },
    {
      name: 'Wrapped Bitcoin',
      address: '0x4200000000000000000000000000000000000006' as const,
      symbol: 'WBTC',
      decimals: 8,
      image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
      chainId: base.id,
    },
  ], []);

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
    chainId: base.id,
  });

  // State for token balances
  const [tokenBalances, setTokenBalances] = useState<Array<{
    token: typeof tokensToTrack[0];
    balance: string;
    formatted: string;
    value: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Get token balances using useReadContract for each token
  const usdcBalance = useReadContract({
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as const,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const wbtcBalance = useReadContract({
    address: '0x4200000000000000000000000000000000000006' as const,
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
      },
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Process token balances
  useEffect(() => {
    if (!isConnected || !address) {
      setTokenBalances([]);
      return;
    }

    setIsLoading(usdcBalance.isLoading || wbtcBalance.isLoading);
    setError(usdcBalance.error || wbtcBalance.error || null);

    try {
      const balances = [];

      // USDC balance
      if (usdcBalance.data) {
        const usdcToken = tokensToTrack.find(t => t.symbol === 'USDC');
        if (usdcToken) {
          const formatted = formatUnits(usdcBalance.data, usdcToken.decimals);
          const value = parseFloat(formatted);
          if (value > 0) {
            balances.push({
              token: usdcToken,
              balance: usdcBalance.data.toString(),
              formatted: value.toFixed(6),
              value: value,
            });
          }
        }
      }

      // WBTC balance
      if (wbtcBalance.data) {
        const wbtcToken = tokensToTrack.find(t => t.symbol === 'WBTC');
        if (wbtcToken) {
          const formatted = formatUnits(wbtcBalance.data, wbtcToken.decimals);
          const value = parseFloat(formatted);
          if (value > 0) {
            balances.push({
              token: wbtcToken,
              balance: wbtcBalance.data.toString(),
              formatted: value.toFixed(6),
              value: value,
            });
          }
        }
      }

      setTokenBalances(balances);
    } catch (err) {
      setError(err as Error);
    }
  }, [address, isConnected, usdcBalance.data, wbtcBalance.data, usdcBalance.isLoading, wbtcBalance.isLoading, usdcBalance.error, wbtcBalance.error, tokensToTrack]);

  // Add ETH to balances if it exists
  const allBalances = [
    ...(ethBalance && parseFloat(ethBalance.formatted) > 0 ? [{
      token: {
        name: 'Ethereum',
        address: '0x0000000000000000000000000000000000000000' as const,
        symbol: 'ETH',
        decimals: 18,
        image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
        chainId: base.id,
      },
      balance: ethBalance.value.toString(),
      formatted: ethBalance.formatted,
      value: parseFloat(ethBalance.formatted),
    }] : []),
    ...tokenBalances,
  ];

  return (
    <div className={styles.tabContent}>

      {/* Wallet Section */}
      <div className={styles.walletSection}>
        <h2 className={styles.sectionTitle}>Your Wallet</h2>
        <div className={styles.walletIslandContainer}>
          <WalletIsland />
        </div>
        
        <div className={styles.topCoinsSection}>
          <h3 className={styles.subsectionTitle}>Your Portfolio</h3>
          <div className={styles.coinsList}>
            {!isConnected ? (
              <div className={styles.connectPrompt}>
                <p>Connect your wallet to view your token balances</p>
              </div>
            ) : isLoading ? (
              <div className={styles.loadingPrompt}>
                <p>Loading your tokens...</p>
              </div>
            ) : error ? (
              <div className={styles.errorPrompt}>
                <p>Error loading tokens: {error.message}</p>
              </div>
            ) : allBalances && allBalances.length > 0 ? (
              allBalances
                .filter(balance => parseFloat(balance.formatted) > 0) // Only show tokens with balance
                .sort((a, b) => b.value - a.value) // Sort by value
                .map((balance) => (
                  <div key={balance.token.address} className={styles.coinRow}>
                    <TokenRow 
                      token={balance.token} 
                      amount={balance.formatted}
                      onClick={(token) => console.log('Clicked token:', token)}
                    />
                  </div>
                ))
            ) : (
              <div className={styles.emptyPrompt}>
                <p>No tokens found in your wallet</p>
              </div>
            )}
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

    </div>
  );
}
