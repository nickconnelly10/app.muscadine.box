"use client";
import { WalletIsland } from "@coinbase/onchainkit/wallet";
import { useAccount, useSendTransaction } from "wagmi";
import { useState, useMemo } from "react";
import styles from "../page.module.css";
import DEXService, { SwapQuote, SwapTransaction } from "../services/dexService";

export default function Swap() {
  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();
  
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

  return (
    <div className={styles.tabContent}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Swap Tokens</h2>
        <WalletIsland />
      </div>

      <div className={styles.swapSection}>
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
  );
}
