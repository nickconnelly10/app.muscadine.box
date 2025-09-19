"use client";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import type { UiPortfolio } from "../portfolio/_lib/getPortfolio";
import { fetchPortfolio } from "../portfolio/_lib/getPortfolio";

export function WalletBalance() {
  const { address, isConnected } = useAccount();
  const [portfolio, setPortfolio] = useState<UiPortfolio | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!address) return;
      setLoading(true);
      try {
        const res = await fetchPortfolio(address as `0x${string}`);
        if (!ignore) setPortfolio(res);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [address]);

  if (!isConnected) {
    return (
      <div className="wallet-balance">
        <h3>Wallet Balance</h3>
        <p>Connect your wallet to view balance</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wallet-balance">
        <h3>Wallet Balance</h3>
        <p>Loading balance...</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="wallet-balance">
        <h3>Wallet Balance</h3>
        <p>Unable to load portfolio data</p>
      </div>
    );
  }

  return (
    <div className="wallet-balance">
      <h3>Portfolio Value</h3>
      <div className="balance-display">
        <div className="balance-amount">
          <span className="usd-amount">${portfolio.totalUsd.toLocaleString()}</span>
          <span className="token-count">{portfolio.tokens.length} assets</span>
        </div>
        <div className="balance-details">
          <p>Address: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
        </div>
      </div>
    </div>
  );
}
