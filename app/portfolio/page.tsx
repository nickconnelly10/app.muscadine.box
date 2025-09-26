"use client";
import Link from "next/link";
import { WalletIsland } from "@coinbase/onchainkit/wallet";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { base } from "wagmi/chains";
import { formatUnits } from "viem";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import styles from "../page.module.css";

export default function Portfolio() {
  const { address, isConnected } = useAccount();
  
  // Define tokens to track on Base network
  const tokensToTrack = useMemo(() => [
    {
      name: 'ETH',
      address: '0x0000000000000000000000000000000000000000' as const,
      symbol: 'ETH',
      decimals: 18,
      image: 'https://base.basescan.org/images/main/empty-token.png',
      chainId: base.id,
    },
    {
      name: 'USDC',
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const,
      symbol: 'USDC',
      decimals: 6,
      image: 'https://base.basescan.org/token/images/binanceusd_32.png',
      chainId: base.id,
    },
    {
      name: 'cbBTC',
      address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf' as const,
      symbol: 'cbBTC',
      decimals: 8,
      image: 'https://base.basescan.org/token/images/wrappedbitcoin_42.png',
      chainId: base.id,
    },
    {
      name: 'WETH',
      address: '0x4200000000000000000000000000000000000006' as const,
      symbol: 'WETH',
      decimals: 18,
      image: 'https://base.basescan.org/token/images/eth_28.png',
      chainId: base.id,
    },
    {
      name: 'MORPHO',
      address: '0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842' as const,
      symbol: 'MORPHO',
      decimals: 18,
      image: 'https://base.basescan.org/images/main/empty-token.png',
      chainId: base.id,
    },
    {
      name: 'cbXRP',
      address: '0xcb585250f852C6c6bf90434AB21A00f02833a4af' as const,
      symbol: 'cbXRP',
      decimals: 6,
      image: 'https://base.basescan.org/images/main/empty-token.png',
      chainId: base.id,
    },
    {
      name: 'AERO',
      address: '0x940181a94A35A4569E4529A3CDfB74e38FD98631' as const,
      symbol: 'AERO',
      decimals: 18,
      image: 'https://base.basescan.org/images/main/empty-token.png',
      chainId: base.id,
    },
    {
      name: 'MOONWELL',
      address: '0xA88594D404727625A9437C3f886C7643872296AE' as const,
      symbol: 'MOONWELL',
      decimals: 18,
      image: 'https://base.basescan.org/images/main/empty-token.png',
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
  const [pricesLoading, setPricesLoading] = useState(true);
  
  const [swapFromToken, setSwapFromToken] = useState<string>('');
  const [swapToToken, setSwapToToken] = useState<string>('');
  const [swapAmount, setSwapAmount] = useState<string>('');
  const [swapAmountBuy, setSwapAmountBuy] = useState<string>('');
  const [swapMode, setSwapMode] = useState<'sell' | 'buy'>('sell');
  const [isSwapLoading, setIsSwapLoading] = useState(false);

  // Token prices with real-time data
  const [tokenPrices, setTokenPrices] = useState({
    ETH: 3500,
    USDC: 1,
    cbBTC: 65000,
    WETH: 3500,
    MORPHO: 2.5,
    cbXRP: 0.6,
    AERO: 0.5,
    MOONWELL: 0.1,
  });

  // Fetch real-time token prices
  useEffect(() => {
    const fetchPrices = async () => {
      setPricesLoading(true);
      try {
        // Using CoinGecko API for real-time prices - batch request with correct coin IDs
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin,bitcoin,ripple,aerodrome-finance,moonwell,well,morpho&vs_currencies=usd'
        );
        const data = await response.json();
        
        setTokenPrices(prevPrices => ({
          ETH: data.ethereum?.usd || prevPrices.ETH,
          USDC: data['usd-coin']?.usd || prevPrices.USDC,
          cbBTC: data.bitcoin?.usd || prevPrices.cbBTC, // cbBTC tracks Bitcoin
          WETH: data.ethereum?.usd || prevPrices.WETH, // WETH tracks ETH price
          cbXRP: data.ripple?.usd || prevPrices.cbXRP,
          AERO: data['aerodrome-finance']?.usd || prevPrices.AERO,
          MOONWELL: data.moonwell?.usd || prevPrices.MOONWELL,
          MORPHO: data.morpho?.usd || prevPrices.MORPHO,
        }));
        
        console.log('Token prices updated:', data);
      } catch (error) {
        console.error('Failed to fetch token prices:', error);
        // API calls failed, keep existing values (no state change needed)
      } finally {
        setPricesLoading(false);
      }
    };

    fetchPrices();
    // Update prices every 30 seconds for real-time accuracy
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Create token balance hooks using useReadContract for each token
  const usdcBalance = useReadContract({
    address: tokensToTrack[1].address,
    abi: ['function balanceOf(address) view returns (uint256)'],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const cbethBalance = useReadContract({
    address: tokensToTrack[2].address,
    abi: ['function balanceOf(address) view returns (uint256)'],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const daiBalance = useReadContract({
    address: tokensToTrack[3].address,
    abi: ['function balanceOf(address) view returns (uint256)'],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const aeroBalance = useReadContract({
    address: tokensToTrack[4].address,
    abi: ['function balanceOf(address) view returns (uint256)'],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const wethBalance = useReadContract({
    address: tokensToTrack[5].address,
    abi: ['function balanceOf(address) view returns (uint256)'],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const cbbtcBalance = useReadContract({
    address: tokensToTrack[2].address,
    abi: ['function balanceOf(address) view returns (uint256)'],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const morphoBalance = useReadContract({
    address: tokensToTrack[5].address,
    abi: ['function balanceOf(address) view returns (uint256)'],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const cbxrpBalance = useReadContract({
    address: tokensToTrack[6].address,
    abi: ['function balanceOf(address) view returns (uint256)'],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  const moonwellBalance = useReadContract({
    address: tokensToTrack[7].address,
    abi: ['function balanceOf(address) view returns (uint256)'],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
    },
  });

  // Fetch token balances
  useEffect(() => {
    if (!isConnected || !address) {
      setTokenBalances([]);
      return;
    }

    const fetchBalances = async () => {
      setIsLoading(true);
      try {
        const balances = [];

        // Process each token balance
        if (usdcBalance.data) {
          const usdcToken = tokensToTrack.find(t => t.symbol === 'USDC');
          if (usdcToken) {
            const formatted = formatUnits(usdcBalance.data, usdcToken.decimals);
            const value = parseFloat(formatted);
            const price = tokenPrices.USDC;
            const totalValue = value * price;
            if (totalValue >= 0.001) {
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

        // ETH balance
        if (ethBalance && parseFloat(ethBalance.formatted) > 0) {
          const ethValue = parseFloat(ethBalance.formatted);
          const ethPrice = tokenPrices.ETH;
          const ethTotalValue = ethValue * ethPrice;
          
          // Only include ETH if it's worth more than $0.001
          if (ethTotalValue >= 0.001) {
            balances.push({
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
            });
          }
        }

        // Continue processing other tokens...
        setTokenBalances(balances);
      } catch (err) {
        setError(err as Error);
      }
    };
  }, [address, isConnected, tokenPrices]);

  // Add ETH to balances if it exists
  const allBalances = [
    ...(ethBalance && parseFloat(ethBalance.formatted) > 0 ? (() => {
      const ethValue = parseFloat(ethBalance.formatted);
      const ethPrice = tokenPrices.ETH;
      const ethTotalValue = ethValue * ethPrice;
      
      // Only include ETH if it's worth more than $0.001
      if (ethTotalValue >= 0.001) {
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
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Portfolio</h2>
        <WalletIsland />
      </div>

      {isConnected && address ? (
        <div className={styles.portfolioSection}>
          {/* Portfolio Header */}
          <div className={styles.portfolioHeader}>
            <h3 className={styles.subsectionTitle}>
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Your Portfolio'}
            </h3>
            {isConnected && address && (
              <div className={styles.portfolioLinks}>
                <a
                  href={`https://app.zerion.io/${address}/overview`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                >
                  View on Zerion ↗
                </a>
              </div>
            )}
          </div>

          {/* Total Value Indicator */}
          <div className={styles.totalValue}>
            <div className={styles.totalValueLabel}>Total Value</div>
            <div className={styles.totalValueAmount}>
              ${totalValue.toFixed(2)}
            </div>
          </div>

          {/* Token Assets Grid */}
          <div className={styles.assetsGrid}>
            {allBalances.map((balance, index) => (
              <div
                key={balance.token.symbol}
                className={styles.assetCard}
              >
                <div className={styles.assetHeader}>
                  <div className={styles.tokenInfo}>
                    <Image
                      src={balance.token.image}
                      alt={balance.token.name}
                      width={40}
                      height={40}
                      className={styles.tokenLogo}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/40x40/6653f1/white?text=${balance.token.symbol.slice(0, 2)}`;
                      }}
                    />
                    <div className={styles.tokenNameGroup}>
                      <span className={styles.tokenName}>{balance.token.name}</span>
                      <span className={styles.tokenBalance}>
                        {balance.formatted} {balance.token.symbol}
                      </span>
                    </div>
                  </div>
                  <div className={styles.tokenUsdValue}>
                    ${balance.totalValue.toFixed(2)}
                  </div>
                </div>
                <div className={styles.tokenPrice}>
                  Price: ${balance.price.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {allBalances.length === 0 && isConnected && (
            <div className={styles.emptyPromt}>
              <span>Your portfolio is empty</span>
              <p>Purchase tokens to start tracking your assets</p>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.emptyPrompt}>
          <span>Connect wallet to view your portfolio</span>
          <p>Wallet Connect to get started managing your tokens</p>
        </div>
      )}
    </div>
  );
}
