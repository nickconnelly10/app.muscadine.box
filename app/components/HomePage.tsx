"use client";
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
      name: 'ETH',
      address: '0x0000000000000000000000000000000000000000' as const,
      symbol: 'ETH',
      decimals: 18,
      image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
      chainId: base.id,
    },
    {
      name: 'USDC',
      address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as const,
      symbol: 'USDC',
      decimals: 6,
      image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
      chainId: base.id,
    },
    {
      name: 'cBETH',
      address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22' as const,
      symbol: 'cBETH',
      decimals: 18,
      image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
      chainId: base.id,
    },
    {
      name: 'DAI',
      address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' as const,
      symbol: 'DAI',
      decimals: 18,
      image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
      chainId: base.id,
    },
    {
      name: 'AERO',
      address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631' as const,
      symbol: 'AERO',
      decimals: 18,
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
    price: number;
    totalValue: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Token prices (simplified - in production, use a price API)
  const tokenPrices = useMemo(() => ({
    ETH: 3500, // Example price
    USDC: 1,
    cBETH: 3500, // Similar to ETH
    DAI: 1,
    AERO: 0.5, // Example price
  }), []);

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


  const cbethBalance = useReadContract({
    address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22' as const,
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

  const daiBalance = useReadContract({
    address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb' as const,
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

  const aeroBalance = useReadContract({
    address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631' as const,
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

    setIsLoading(usdcBalance.isLoading || cbethBalance.isLoading || daiBalance.isLoading || aeroBalance.isLoading);
    setError(usdcBalance.error || cbethBalance.error || daiBalance.error || aeroBalance.error || null);

    try {
      const balances = [];

      // USDC balance
      if (usdcBalance.data) {
        const usdcToken = tokensToTrack.find(t => t.symbol === 'USDC');
        if (usdcToken) {
          const formatted = formatUnits(usdcBalance.data, usdcToken.decimals);
          const value = parseFloat(formatted);
          const price = tokenPrices.USDC;
          const totalValue = value * price;
          if (totalValue >= 0.02) { // Filter out tokens worth less than $0.02
            balances.push({
              token: usdcToken,
              balance: usdcBalance.data.toString(),
              formatted: value.toFixed(6),
              value: value,
              price: price,
              totalValue: totalValue,
            });
          }
        }
      }

      // cBETH balance
      if (cbethBalance.data) {
        const cbethToken = tokensToTrack.find(t => t.symbol === 'cBETH');
        if (cbethToken) {
          const formatted = formatUnits(cbethBalance.data, cbethToken.decimals);
          const value = parseFloat(formatted);
          const price = tokenPrices.cBETH;
          const totalValue = value * price;
          if (totalValue >= 0.02) { // Filter out tokens worth less than $0.02
            balances.push({
              token: cbethToken,
              balance: cbethBalance.data.toString(),
              formatted: value.toFixed(6),
              value: value,
              price: price,
              totalValue: totalValue,
            });
          }
        }
      }

      // DAI balance
      if (daiBalance.data) {
        const daiToken = tokensToTrack.find(t => t.symbol === 'DAI');
        if (daiToken) {
          const formatted = formatUnits(daiBalance.data, daiToken.decimals);
          const value = parseFloat(formatted);
          const price = tokenPrices.DAI;
          const totalValue = value * price;
          if (totalValue >= 0.02) { // Filter out tokens worth less than $0.02
            balances.push({
              token: daiToken,
              balance: daiBalance.data.toString(),
              formatted: value.toFixed(6),
              value: value,
              price: price,
              totalValue: totalValue,
            });
          }
        }
      }

      // AERO balance
      if (aeroBalance.data) {
        const aeroToken = tokensToTrack.find(t => t.symbol === 'AERO');
        if (aeroToken) {
          const formatted = formatUnits(aeroBalance.data, aeroToken.decimals);
          const value = parseFloat(formatted);
          const price = tokenPrices.AERO;
          const totalValue = value * price;
          if (totalValue >= 0.02) { // Filter out tokens worth less than $0.02
            balances.push({
              token: aeroToken,
              balance: aeroBalance.data.toString(),
              formatted: value.toFixed(6),
              value: value,
              price: price,
              totalValue: totalValue,
            });
          }
        }
      }

      setTokenBalances(balances);
    } catch (err) {
      setError(err as Error);
    }
  }, [address, isConnected, usdcBalance.data, cbethBalance.data, daiBalance.data, aeroBalance.data, usdcBalance.isLoading, cbethBalance.isLoading, daiBalance.isLoading, aeroBalance.isLoading, usdcBalance.error, cbethBalance.error, daiBalance.error, aeroBalance.error, tokensToTrack, tokenPrices]);

  // Add ETH to balances if it exists
  const allBalances = [
    ...(ethBalance && parseFloat(ethBalance.formatted) > 0 ? (() => {
      const ethValue = parseFloat(ethBalance.formatted);
      const ethPrice = tokenPrices.ETH;
      const ethTotalValue = ethValue * ethPrice;
      
      // Only include ETH if it's worth more than $0.02
      if (ethTotalValue >= 0.02) {
        return [{
          token: {
            name: 'ETH',
            address: '0x0000000000000000000000000000000000000000' as const,
            symbol: 'ETH',
            decimals: 18,
            image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
            chainId: base.id,
          },
          balance: ethBalance.value.toString(),
          formatted: ethValue.toFixed(6),
          value: ethValue,
          price: ethPrice,
          totalValue: ethTotalValue,
        }];
      }
      return [];
    })() : []),
    ...tokenBalances,
  ];

  // Calculate total portfolio value including ETH
  const totalValue = allBalances.reduce((sum, balance) => sum + balance.totalValue, 0);

  return (
    <div className={styles.tabContent}>

      {/* Wallet Section */}
      <div className={styles.walletSection}>
        <h2 className={styles.sectionTitle}>Your Wallet</h2>
        <div className={styles.walletIslandContainer}>
          <WalletIsland />
        </div>
        
        <div className={styles.topCoinsSection}>
          <div className={styles.portfolioHeader}>
            <h3 className={styles.subsectionTitle}>Your Portfolio</h3>
            {isConnected && !isLoading && !error && totalValue > 0 && (
              <div className={styles.totalValue}>
                <span className={styles.totalValueLabel}>Total Value</span>
                <span className={styles.totalValueAmount}>${totalValue.toFixed(2)}</span>
              </div>
            )}
          </div>
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
                .sort((a, b) => b.totalValue - a.totalValue) // Sort by total value
                .map((balance) => (
                  <div key={balance.token.address} className={styles.coinRow}>
                    <div className={styles.tokenCard}>
                      <div className={styles.tokenInfo}>
                        <div className={styles.tokenSymbol}>{balance.token.symbol}</div>
                        <div className={styles.tokenAmount}>
                          {balance.formatted} {balance.token.symbol}
                        </div>
                        <div className={styles.tokenPrice}>
                          ${balance.price.toFixed(2)} per token
                        </div>
                        <div className={styles.tokenValue}>
                          ${balance.totalValue.toFixed(2)}
                        </div>
                      </div>
                    </div>
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

      {/* Transactions and Swap Section */}
      <div className={styles.transactionsSwapSection}>
        {/* Recent Transactions */}
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

        {/* Swap Section */}
        <div className={styles.swapSection}>
          <h2 className={styles.sectionTitle}>Swap Tokens</h2>
          <div className={styles.swapContainer}>
            <div className={styles.swapCard}>
              <div className={styles.swapHeader}>
                <h3>Quick Swap</h3>
                <p>Exchange tokens instantly on Base</p>
              </div>
              <div className={styles.swapContent}>
                <div className={styles.swapInput}>
                  <label>From</label>
                  <select className={styles.tokenSelect}>
                    <option value="">Select token</option>
                    {allBalances
                      .filter(balance => parseFloat(balance.formatted) > 0)
                      .map((balance) => (
                        <option key={balance.token.address} value={balance.token.symbol}>
                          {balance.token.symbol} - {balance.formatted}
                        </option>
                      ))}
                  </select>
                </div>
                <div className={styles.swapArrow}>⇄</div>
                <div className={styles.swapInput}>
                  <label>To</label>
                  <select className={styles.tokenSelect}>
                    <option value="">Select token</option>
                    <option value="ETH">ETH</option>
                    <option value="USDC">USDC</option>
                    <option value="WBTC">WBTC</option>
                    <option value="cBBTC">cBBTC</option>
                    <option value="DAI">DAI</option>
                    <option value="AERO">AERO</option>
                  </select>
                </div>
                <button className={styles.swapButton} disabled>
                  Connect Wallet to Swap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
