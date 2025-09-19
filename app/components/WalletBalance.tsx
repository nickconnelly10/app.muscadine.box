"use client";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";

export function WalletBalance() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading, error } = useBalance({
    address: address,
  });

  if (!isConnected) {
    return (
      <div className="wallet-balance">
        <h3>Wallet Balance</h3>
        <p>Connect your wallet to view balance</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wallet-balance">
        <h3>Wallet Balance</h3>
        <p>Loading balance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wallet-balance">
        <h3>Wallet Balance</h3>
        <p>Error loading balance</p>
      </div>
    );
  }

  const balanceInEth = balance ? parseFloat(formatEther(balance.value)) : 0;
  const balanceInUsd = balanceInEth * 3000; // Approximate ETH to USD conversion

  return (
    <div className="wallet-balance">
      <h3>Wallet Balance</h3>
      <div className="balance-display">
        <div className="balance-amount">
          <span className="eth-amount">{balanceInEth.toFixed(4)} ETH</span>
          <span className="usd-amount">${balanceInUsd.toFixed(2)} USD</span>
        </div>
        <div className="balance-details">
          <p>Address: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
        </div>
      </div>
    </div>
  );
}
