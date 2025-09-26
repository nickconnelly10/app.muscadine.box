"use client";
import { WalletIsland } from "@coinbase/onchainkit/wallet";
import { useAccount, useBalance, useReadContract, useSendTransaction } from "wagmi";
import { base } from "wagmi/chains";
import { formatUnits } from "viem";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import styles from "../page.module.css";
import DEXService, { SwapQuote, SwapTransaction } from "../services/dexService";

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();
  
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
  
  // Swap state
  const [swapFromToken, setSwapFromToken] = useState<string>('');
  const [swapToToken, setSwapToToken] = useState<string>('');
  const [swapAmount, setSwapAmount] = useState<string>('');
  const [swapAmountBuy, setSwapAmountBuy] = useState<string>('');
  const [swapMode, setSwapMode] = useState<'sell' | 'buy'>('sell'); // Default to sell mode
  const [isSwapLoading, setIsSwapLoading] = useState(false);
  const [swapQuote, setSwapQuote] = useState<{ quote: SwapQuote | null; transaction: SwapTransaction | null } | null>(null);
  const [swapSlippage, _setSwapSlippage] = useState<number>(3);

  // Initialize DEX service
  const dexService = useMemo(() => DEXService.getInstance(), []);

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

  // Get token balances using useReadContract for each token
  const usdcBalance = useReadContract({
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const,
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

  const wethBalance = useReadContract({
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

  const cbbtcBalance = useReadContract({
    address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf' as const,
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

  const morphoBalance = useReadContract({
    address: '0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842' as const,
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

  const cbxrpBalance = useReadContract({
    address: '0xcb585250f852C6c6bf90434AB21A00f02833a4af' as const,
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

  const moonwellBalance = useReadContract({
    address: '0xA88594D404727625A9437C3f886C7643872296AE' as const,
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

    setIsLoading(usdcBalance.isLoading || cbethBalance.isLoading || daiBalance.isLoading || aeroBalance.isLoading || wethBalance.isLoading || cbbtcBalance.isLoading || morphoBalance.isLoading || cbxrpBalance.isLoading || moonwellBalance.isLoading);
    setError(usdcBalance.error || cbethBalance.error || daiBalance.error || aeroBalance.error || wethBalance.error || cbbtcBalance.error || morphoBalance.error || cbxrpBalance.error || moonwellBalance.error || null);

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
          if (totalValue >= 0.001) { // Filter out tokens worth less than $0.001
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
          const price = tokenPrices.WETH; // cBETH uses WETH price
          const totalValue = value * price;
          if (totalValue >= 0.001) { // Filter out tokens worth less than $0.001
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
          const price = tokenPrices.USDC; // DAI uses USDC price
          const totalValue = value * price;
          if (totalValue >= 0.001) { // Filter out tokens worth less than $0.001
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
          if (totalValue >= 0.001) { // Filter out tokens worth less than $0.001
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

      // WETH balance
      if (wethBalance.data) {
        const wethToken = tokensToTrack.find(t => t.symbol === 'WETH');
        if (wethToken) {
          const formatted = formatUnits(wethBalance.data, wethToken.decimals);
          const value = parseFloat(formatted);
          const price = tokenPrices.WETH;
          const totalValue = value * price;
          if (totalValue >= 0.001) { // Filter out tokens worth less than $0.001
            balances.push({
              token: wethToken,
              balance: wethBalance.data.toString(),
              formatted: value.toFixed(6),
              value: value,
              price: price,
              totalValue: totalValue,
            });
          }
        }
      }

      // cBBTC balance
      if (cbbtcBalance.data) {
        const cbbtcToken = tokensToTrack.find(t => t.symbol === 'cbBTC');
        if (cbbtcToken) {
          const formatted = formatUnits(cbbtcBalance.data, cbbtcToken.decimals);
          const value = parseFloat(formatted);
          const price = tokenPrices.cbBTC;
          const totalValue = value * price;
          if (totalValue >= 0.001) { // Filter out tokens worth less than $0.001
            balances.push({
              token: cbbtcToken,
              balance: cbbtcBalance.data.toString(),
              formatted: value.toFixed(8),
              value: value,
              price: price,
              totalValue: totalValue,
            });
          }
        }
      }

      // MORPHO balance
      if (morphoBalance.data) {
        const morphoToken = tokensToTrack.find(t => t.symbol === 'MORPHO');
        if (morphoToken) {
          const formatted = formatUnits(morphoBalance.data, morphoToken.decimals);
          const value = parseFloat(formatted);
          const price = tokenPrices.MORPHO;
          const totalValue = value * price;
          if (totalValue >= 0.001) { // Filter out tokens worth less than $0.001
            balances.push({
              token: morphoToken,
              balance: morphoBalance.data.toString(),
              formatted: value.toFixed(6),
              value: value,
              price: price,
              totalValue: totalValue,
            });
          }
        }
      }

      // cbXRP balance
      if (cbxrpBalance.data) {
        const cbxrpToken = tokensToTrack.find(t => t.symbol === 'cbXRP');
        if (cbxrpToken) {
          const formatted = formatUnits(cbxrpBalance.data, cbxrpToken.decimals);
          const value = parseFloat(formatted);
          const price = tokenPrices.cbXRP;
          const totalValue = value * price;
          if (totalValue >= 0.001) { // Filter out tokens worth less than $0.001
            balances.push({
              token: cbxrpToken,
              balance: cbxrpBalance.data.toString(),
              formatted: value.toFixed(6),
              value: value,
              price: price,
              totalValue: totalValue,
            });
          }
        }
      }

      // MOONWELL balance
      if (moonwellBalance.data) {
        const moonwellToken = tokensToTrack.find(t => t.symbol === 'MOONWELL');
        if (moonwellToken) {
          const formatted = formatUnits(moonwellBalance.data, moonwellToken.decimals);
          const value = parseFloat(formatted);
          const price = tokenPrices.MOONWELL;
          const totalValue = value * price;
          if (totalValue >= 0.001) { // Filter out tokens worth less than $0.001
            balances.push({
              token: moonwellToken,
              balance: moonwellBalance.data.toString(),
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
  }, [address, isConnected, usdcBalance.data, cbethBalance.data, daiBalance.data, aeroBalance.data, wethBalance.data, cbbtcBalance.data, morphoBalance.data, cbxrpBalance.data, moonwellBalance.data, usdcBalance.isLoading, cbethBalance.isLoading, daiBalance.isLoading, aeroBalance.isLoading, wethBalance.isLoading, cbbtcBalance.isLoading, morphoBalance.isLoading, cbxrpBalance.isLoading, moonwellBalance.isLoading, usdcBalance.error, cbethBalance.error, daiBalance.error, aeroBalance.error, wethBalance.error, cbbtcBalance.error, morphoBalance.error, cbxrpBalance.error, moonwellBalance.error, tokensToTrack, tokenPrices]);

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

  // Get swap quote
  const getSwapQuote = async () => {
    const amount = swapMode === 'sell' ? swapAmount : swapAmountBuy;
    if (!swapFromToken || !swapToToken || !amount || !address) return;

    try {
      const result = await dexService.swapTokens(
        swapFromToken,
        swapToToken,
        amount,
        address,
        swapSlippage
      );

      if (result.quote) {
        setSwapQuote(result);
        if (swapMode === 'sell') {
          alert(`Quote: Get ${result.quote.toAmount} ${swapToToken} for ${amount} ${swapFromToken}`);
        } else {
          alert(`Quote: Sell ${result.quote.fromAmount} ${swapFromToken} to get ${amount} ${swapToToken}`);
        }
      } else {
        alert('Could not get quote. Please check the token pair and ensure you have sufficient balance.');
      }
    } catch (error) {
      console.error('Quote error:', error);
      alert('Error getting swap quote');
    }
  };

  // Swap functionality
  const handleSwap = async () => {
    const amount = swapMode === 'sell' ? swapAmount : swapAmountBuy;
    if (!swapFromToken || !swapToToken || !amount) {
      alert('Please select tokens and enter amount');
      return;
    }

    if (!address) {
      alert('Please connect your wallet');
      return;
    }
    
    setIsSwapLoading(true);
    try {
      // Use the DEX service to get swap transaction
      const result = await dexService.swapTokens(
        swapFromToken,
        swapToToken,
        amount,
        address,
        swapSlippage
      );

      if (!result.transaction) {
        alert('Could not process swap transaction. Please check the token pair and try again. Ensure you have sufficient balance.');
        return;
      }

      // Execute the swap transaction - OnchainKit will handle routing
      try {
        const txHash = await sendTransaction({
          to: result.transaction.to as `0x${string}`,
          value: BigInt(result.transaction.value || '0'),
          data: result.transaction.data as `0x${string}`,
        });

        console.log('Transaction Hash:', txHash);
        alert(`Swap initiated: ${swapAmount} ${swapFromToken} → ${swapToToken}. Transaction submitted!`);
        setSwapQuote(null);
        setSwapAmount('');
        setSwapFromToken('');
        setSwapToToken('');
      } catch (txError) {
        console.error('Transaction error:', txError);
        alert('Transaction failed. Please try again.');
        return;
      }
      
    } catch (error) {
      console.error('Swap error:', error);
      alert('Swap failed. Please ensure you have sufficient balance and try again.');
    } finally {
      setIsSwapLoading(false);
    }
  };

  // Mock recent transactions data
  const recentTransactions = useMemo(() => [
    {
      id: '1',
      type: 'deposit',
      token: 'USDC',
      amount: '100.00',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      status: 'completed'
    },
    {
      id: '2',
      type: 'withdraw',
      token: 'ETH',
      amount: '0.05',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      status: 'completed'
    },
    {
      id: '3',
      type: 'swap',
      token: 'cBETH',
      amount: '0.1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      status: 'completed'
    }
  ], []);

  return (
    <div className={styles.tabContent}>

      {/* Wallet Section */}
      <div className={styles.walletSection}>
        <div className={styles.walletIslandContainer}>
          <WalletIsland />
        </div>
        
        <div className={styles.topCoinsSection}>
          <div className={styles.portfolioHeader}>
            <h3 className={styles.subsectionTitle}>
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Your Portfolio'}
            </h3>
            <div className={styles.priceIndicator}>
              {pricesLoading ? (
                <span className={styles.loadingIndicator}>Updating prices...</span>
              ) : (
                <span className={styles.liveIndicator}>Live Prices</span>
              )}
            </div>
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
                      <div className={styles.tokenLeft}>
                        <div className={styles.tokenImageContainer}>
                          <Image 
                            src={balance.token.image || `/token-default.png`} 
                            alt={balance.token.symbol}
                            width={24}
                            height={24}
                            className={styles.tokenImage}
                            onError={(e) => {
                              // Simple fallback to generate icon with token symbol first letter
                              const target = e.target as HTMLImageElement;
                              const tokenSymbol = balance.token.symbol;
                              target.src = `data:image/svg+xml;base64,${btoa(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                                  <rect width="40" height="40" rx="20" fill="#f3f4f6" />
                                  <text x="20" y="26" text-anchor="middle" font-size="16" fill="#6b7280" font-family="system-ui" font-weight="bold">${tokenSymbol.charAt(0)}</text>
                                </svg>
                              `)}`;
                            }}
                          />
                        </div>
                        <div className={styles.tokenInfo}>
                          <div className={styles.tokenSymbol}>{balance.token.symbol}</div>
                          <div className={styles.tokenAmount}>
                            {balance.formatted} {balance.token.symbol}
                          </div>
                          <div className={styles.tokenPrice}>
                            ${balance.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className={styles.tokenValue}>
                        ${balance.totalValue.toFixed(2)}
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
                {recentTransactions.length > 0 ? (
                  <div className={styles.transactionList}>
                    {recentTransactions.map((tx) => (
                      <div key={tx.id} className={styles.transactionItem}>
                        <div className={styles.transactionIcon}>
                          {tx.type === 'deposit' ? '⬇️' : tx.type === 'withdraw' ? '⬆️' : '🔄'}
                        </div>
                        <div className={styles.transactionDetails}>
                          <div className={styles.transactionType}>
                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} {tx.token}
                          </div>
                          <div className={styles.transactionAmount}>
                            {tx.amount} {tx.token}
                          </div>
                          <div className={styles.transactionTime}>
                            {tx.timestamp.toLocaleString()}
                          </div>
                        </div>
                        <div className={`${styles.transactionStatus} ${styles[tx.status]}`}>
                          {tx.status}
                        </div>
                      </div>
                    ))}
                  </div>
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

        {/* Swap Section */}
        <div className={styles.swapSection}>
          <h2 className={styles.sectionTitle}>Swap Tokens</h2>
          <div className={styles.swapContainer}>
          <div className={styles.swapCard}>
            <div className={styles.swapHeader}>
              <h3>Quick Swap</h3>
              <p>Exchange tokens instantly on Base</p>
              <div className={styles.swapLinks}>
                <a 
                  href="https://aerodrome.finance/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                >
                  Advanced Swap on Aerodrome ↗
                </a>
              </div>
            </div>
              <div className={styles.swapContent}>
                <div className={styles.swapRow}>
                  <div className={styles.swapInput}>
                    <label>From</label>
                    <select 
                      className={styles.tokenSelect}
                      value={swapFromToken}
                      onChange={(e) => setSwapFromToken(e.target.value)}
                      disabled={!isConnected}
                    >
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
                    <select 
                      className={styles.tokenSelect}
                      value={swapToToken}
                      onChange={(e) => setSwapToToken(e.target.value)}
                      disabled={!isConnected}
                    >
                      <option value="">Select token</option>
                      <option value="ETH">ETH</option>
                      <option value="USDC">USDC</option>
                      <option value="cbBTC">cbBTC</option>
                      <option value="WETH">WETH</option>
                      <option value="MORPHO">MORPHO</option>
                      <option value="cbXRP">cbXRP</option>
                      <option value="AERO">AERO</option>
                      <option value="MOONWELL">MOONWELL</option>
                    </select>
                  </div>
                </div>
                <div className={styles.swapModeSection}>
                  <div className={styles.swapModeToggle}>
                    <button
                      className={`${styles.modeButton} ${swapMode === 'sell' ? styles.modeButtonActive : ''}`}
                      onClick={() => setSwapMode('sell')}
                    >
                      Sell Amount
                    </button>
                    <button
                      className={`${styles.modeButton} ${swapMode === 'buy' ? styles.modeButtonActive : ''}`}
                      onClick={() => setSwapMode('buy')}
                    >
                      Buy Amount
                    </button>
                  </div>
                </div>
                <div className={styles.swapAmountSection}>
                  {swapMode === 'sell' ? (
                    <div className={styles.swapInput}>
                      <label>Amount to Sell</label>
                      <input
                        type="number"
                        className={styles.amountInput}
                        placeholder="0.00"
                        value={swapAmount}
                        onChange={(e) => setSwapAmount(e.target.value)}
                        disabled={!isConnected}
                      />
                    </div>
                  ) : (
                    <div className={styles.swapInput}>
                      <label>Amount to Buy</label>
                      <input
                        type="number"
                        className={styles.amountInput}
                        placeholder="0.00"
                        value={swapAmountBuy}
                        onChange={(e) => setSwapAmountBuy(e.target.value)}
                        disabled={!isConnected}
                      />
                    </div>
                  )}
                  {swapQuote && (
                    <div className={styles.swapQuote}>
                      <div className={styles.quoteRow}>
                        <div className={styles.quoteItem}>
                          <label>Amount to Sell:</label>
                          <span>{swapAmount} {swapFromToken}</span>
                        </div>
                        <div className={styles.quoteItem}>
                          <label>Amount to Buy:</label>
                          <span>{swapQuote.quote?.toAmount || '0'} {swapToToken}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.swapButtonContainer}>
                  <button 
                    className={styles.swapQuoteButton}
                    onClick={getSwapQuote}
                    disabled={!isConnected || !swapFromToken || !swapToToken || (!swapAmount && !swapAmountBuy)}
                    style={{ marginRight: '8px' }}
                  >
                    Get Quote
                  </button>
                  <button 
                    className={styles.swapButton} 
                    onClick={handleSwap}
                    disabled={!isConnected || isSwapLoading || !swapFromToken || !swapToToken || (!swapAmount && !swapAmountBuy)}
                  >
                    {isSwapLoading ? 'Swapping...' : !isConnected ? 'Connect Wallet to Swap' : 'Swap Tokens'}
                  </button>
                </div>
              </div>
            </div>
      </div>
        </div>
      </div>

    </div>
  );
}
