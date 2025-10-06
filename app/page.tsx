"use client";
import { WalletIsland } from "@coinbase/onchainkit/wallet";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { base } from "wagmi/chains";
import { formatUnits } from "viem";
import { useState, useEffect } from "react";
import Image from "next/image";
import SharedLayout from "./components/SharedLayout";
import styles from "./page.module.css";

export default function Home() {
  const { address, isConnected } = useAccount();
  
  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
    chainId: base.id,
  });

  // Muscadine Vault addresses
  const vaults = {
    usdc: {
      address: '0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F' as const,
      name: 'Muscadine USDC Vaults',
      symbol: 'USDC',
      decimals: 6,
      image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
    },
    cbbtc: {
      address: '0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9' as const,
      name: 'Muscadine cbBTC Vaults',
      symbol: 'cbBTC',
      decimals: 8,
      image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
    },
    eth: {
      address: '0x21e0d366272798da3A977FEBA699FCB91959d120' as const,
      name: 'Muscadine ETH Vaults',
      symbol: 'ETH',
      decimals: 18,
      image: 'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
    }
  };

  // Get vault balances
  const usdcVaultBalance = useReadContract({
    address: vaults.usdc.address,
    abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] }],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: !!address && isConnected },
  });

  const cbbtcVaultBalance = useReadContract({
    address: vaults.cbbtc.address,
    abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] }],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: !!address && isConnected },
  });

  const ethVaultBalance = useReadContract({
    address: vaults.eth.address,
    abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] }],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: !!address && isConnected },
  });

  // Demo portfolio with basic ETH support and real-time prices
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
      try {
        // Using CoinGecko API for real-time prices
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin,bitcoin,ripple,aerodrome-finance,moonwell,well,morpho&vs_currencies=usd'
        );
        const data = await response.json();
        
        setTokenPrices(prevPrices => ({
          ETH: data.ethereum?.usd || prevPrices.ETH,
          USDC: data['usd-coin']?.usd || prevPrices.USDC,
          cbBTC: data.bitcoin?.usd || prevPrices.cbBTC,
          WETH: data.ethereum?.usd || prevPrices.WETH,
          cbXRP: data.ripple?.usd || prevPrices.cbXRP,
          AERO: data['aerodrome-finance']?.usd || prevPrices.AERO,
          MOONWELL: data.moonwell?.usd || prevPrices.MOONWELL,
          MORPHO: data.morpho?.usd || prevPrices.MORPHO,
        }));
      } catch (error) {
        console.error('Failed to fetch token prices:', error);
      }
    };

    fetchPrices();
    // Update prices every 30 seconds for real-time accuracy
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add ETH to balances if it exists
  const tokenBalances: Array<{
    token: {
      name: string;
      address: `0x${string}`;
      symbol: string;
      decimals: number;
      image: string;
      chainId: number;
    };
    balance: string;
    formatted: string;
    value: number;
    price: number;
    totalValue: number;
  }> = [];
  const allBalances = [
    ...(ethBalance && ethBalance.value && ethBalance.value > 0 ? (() => {
      const formattedBalance = formatUnits(ethBalance.value, ethBalance.decimals);
      const ethValue = parseFloat(formattedBalance);
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
          formatted: formattedBalance,
          value: ethValue,
          price: ethPrice,
          totalValue: ethTotalValue,
        }];
      }
      return [];
    })() : []),
    // Add Muscadine Vault balances
    ...(usdcVaultBalance.data && usdcVaultBalance.data > 0 ? (() => {
      const formattedBalance = formatUnits(usdcVaultBalance.data, vaults.usdc.decimals);
      const vaultValue = parseFloat(formattedBalance);
      const vaultPrice = tokenPrices.USDC;
      const vaultTotalValue = vaultValue * vaultPrice;
      
      if (vaultTotalValue >= 0.001) {
        return [{
          token: {
            name: vaults.usdc.name,
            address: vaults.usdc.address,
            symbol: vaults.usdc.symbol,
            decimals: vaults.usdc.decimals,
            image: vaults.usdc.image,
            chainId: base.id,
          },
          balance: usdcVaultBalance.data.toString(),
          formatted: formattedBalance,
          value: vaultValue,
          price: vaultPrice,
          totalValue: vaultTotalValue,
        }];
      }
      return [];
    })() : []),
    ...(cbbtcVaultBalance.data && cbbtcVaultBalance.data > 0 ? (() => {
      const formattedBalance = formatUnits(cbbtcVaultBalance.data, vaults.cbbtc.decimals);
      const vaultValue = parseFloat(formattedBalance);
      const vaultPrice = tokenPrices.cbBTC;
      const vaultTotalValue = vaultValue * vaultPrice;
      
      if (vaultTotalValue >= 0.001) {
        return [{
          token: {
            name: vaults.cbbtc.name,
            address: vaults.cbbtc.address,
            symbol: vaults.cbbtc.symbol,
            decimals: vaults.cbbtc.decimals,
            image: vaults.cbbtc.image,
            chainId: base.id,
          },
          balance: cbbtcVaultBalance.data.toString(),
          formatted: formattedBalance,
          value: vaultValue,
          price: vaultPrice,
          totalValue: vaultTotalValue,
        }];
      }
      return [];
    })() : []),
    ...(ethVaultBalance.data && ethVaultBalance.data > 0 ? (() => {
      const formattedBalance = formatUnits(ethVaultBalance.data, vaults.eth.decimals);
      const vaultValue = parseFloat(formattedBalance);
      const vaultPrice = tokenPrices.ETH;
      const vaultTotalValue = vaultValue * vaultPrice;
      
      if (vaultTotalValue >= 0.001) {
        return [{
          token: {
            name: vaults.eth.name,
            address: vaults.eth.address,
            symbol: vaults.eth.symbol,
            decimals: vaults.eth.decimals,
            image: vaults.eth.image,
            chainId: base.id,
          },
          balance: ethVaultBalance.data.toString(),
          formatted: formattedBalance,
          value: vaultValue,
          price: vaultPrice,
          totalValue: vaultTotalValue,
        }];
      }
      return [];
    })() : []),
    ...tokenBalances,
  ];

  // Calculate total portfolio value including ETH
  const totalValue = allBalances.reduce((sum, balance) => sum + balance.totalValue, 0);

  return (
    <SharedLayout>
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
              {allBalances.map((balance) => (
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
    </SharedLayout>
  );
}
