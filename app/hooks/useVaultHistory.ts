"use client";
import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { Address, formatUnits, parseAbiItem } from 'viem';

export type VaultHistory = {
  totalDeposited: number;
  totalWithdrawn: number;
  netDeposits: number;
  interestEarned: number;
  isLoading: boolean;
};

export function useVaultHistory(
  vaultAddress: Address,
  userAddress: Address | undefined,
  currentBalance: number,
  decimals: number,
  tokenPriceUSD: number = 1
): VaultHistory {
  const publicClient = usePublicClient();
  const [history, setHistory] = useState<VaultHistory>({
    totalDeposited: 0,
    totalWithdrawn: 0,
    netDeposits: 0,
    interestEarned: 0,
    isLoading: true,
  });

  useEffect(() => {
    if (!publicClient || !userAddress || !vaultAddress) {
      setHistory({
        totalDeposited: 0,
        totalWithdrawn: 0,
        netDeposits: 0,
        interestEarned: 0,
        isLoading: false,
      });
      return;
    }

    async function fetchHistory() {
      try {
        console.log(`[VaultHistory] Fetching history for vault ${vaultAddress}, user ${userAddress}`);
        console.log(`[VaultHistory] Token price: $${tokenPriceUSD}, Decimals: ${decimals}, Current balance: $${currentBalance}`);

        // Deposit event: event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)
        const depositLogs = await publicClient!.getLogs({
          address: vaultAddress,
          event: parseAbiItem('event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)'),
          args: {
            owner: userAddress,
          },
          fromBlock: 0n,
          toBlock: 'latest',
        });

        // Withdraw event: event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)
        const withdrawLogs = await publicClient!.getLogs({
          address: vaultAddress,
          event: parseAbiItem('event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)'),
          args: {
            owner: userAddress,
          },
          fromBlock: 0n,
          toBlock: 'latest',
        });

        console.log(`[VaultHistory] ${vaultAddress} - Found ${depositLogs.length} deposits, ${withdrawLogs.length} withdrawals`);
        console.log(`[VaultHistory] Deposit logs:`, depositLogs);
        console.log(`[VaultHistory] Withdraw logs:`, withdrawLogs);

        // Calculate total deposited (in USD)
        const totalDeposited = depositLogs.reduce((sum, log) => {
          const assets = log.args.assets as bigint;
          const tokenAmount = Number(formatUnits(assets, decimals));
          const usdAmount = tokenAmount * tokenPriceUSD;
          console.log(`[VaultHistory] Deposit: ${assets.toString()} raw -> ${tokenAmount} tokens -> $${usdAmount.toFixed(2)} USD`);
          return sum + usdAmount;
        }, 0);

        // Calculate total withdrawn (in USD)
        const totalWithdrawn = withdrawLogs.reduce((sum, log) => {
          const assets = log.args.assets as bigint;
          const tokenAmount = Number(formatUnits(assets, decimals));
          const usdAmount = tokenAmount * tokenPriceUSD;
          console.log(`[VaultHistory] Withdraw: ${assets.toString()} raw -> ${tokenAmount} tokens -> $${usdAmount.toFixed(2)} USD`);
          return sum + usdAmount;
        }, 0);

        // Net deposits = deposits - withdrawals
        const netDeposits = totalDeposited - totalWithdrawn;

        // Interest earned = current balance - net deposits
        const interestEarned = Math.max(0, currentBalance - netDeposits);

        console.log(`[VaultHistory] ${vaultAddress} - Total Deposited: ${totalDeposited}, Total Withdrawn: ${totalWithdrawn}, Net: ${netDeposits}, Current Balance: ${currentBalance}, Interest: ${interestEarned}`);

        setHistory({
          totalDeposited,
          totalWithdrawn,
          netDeposits,
          interestEarned,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error fetching vault history:', error);
        setHistory({
          totalDeposited: 0,
          totalWithdrawn: 0,
          netDeposits: 0,
          interestEarned: 0,
          isLoading: false,
        });
      }
    }

    fetchHistory();
  }, [publicClient, vaultAddress, userAddress, currentBalance, decimals, tokenPriceUSD]);

  return history;
}

