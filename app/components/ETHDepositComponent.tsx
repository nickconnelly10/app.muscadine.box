"use client";
import { useState } from 'react';
import { useAccount, useBalance, useWriteContract } from 'wagmi';
import { base } from 'wagmi/chains';
import { formatUnits, parseUnits } from 'viem';
import styles from '../page.module.css';

interface ETHDepositProps {
  vaultAddress: string;
  onSuccess?: (receipt: unknown) => void;
  onError?: (error: unknown) => void;
}

export function ETHDepositComponent({ vaultAddress, onSuccess, onError }: ETHDepositProps) {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  // Get ETH balance
  const ethBalance = useBalance({
    address: address,
    chainId: base.id,
    query: { enabled: !!address && isConnected }
  });

  // Write contract for deposit
  const { writeContract } = useWriteContract({
    mutation: {
      onSuccess: (receipt) => {
        setIsDepositing(false);
        setAmount('');
        onSuccess?.(receipt);
      },
      onError: (error) => {
        setIsDepositing(false);
        onError?.(error);
      },
    },
  });

  const handleDeposit = async () => {
    if (!amount || !address) return;

    try {
      setIsDepositing(true);
      
      // Convert ETH to WETH first, then deposit
      const amountWei = parseUnits(amount, 18);
      
      // Step 1: Wrap ETH to WETH
      await writeContract({
        address: '0x4200000000000000000000000000000000000006', // WETH contract
        abi: [
          {
            name: 'deposit',
            type: 'function',
            stateMutability: 'payable',
            inputs: [],
            outputs: [],
          },
        ],
        functionName: 'deposit',
        value: amountWei,
      });

      // Step 2: Approve WETH for vault
      await writeContract({
        address: '0x4200000000000000000000000000000000000006', // WETH contract
        abi: [
          {
            name: 'approve',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'spender', type: 'address' },
              { name: 'amount', type: 'uint256' },
            ],
            outputs: [{ name: '', type: 'bool' }],
          },
        ],
        functionName: 'approve',
        args: [vaultAddress as `0x${string}`, amountWei],
      });

      // Step 3: Deposit WETH to vault
      await writeContract({
        address: vaultAddress as `0x${string}`,
        abi: [
          {
            name: 'deposit',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'assets', type: 'uint256' },
              { name: 'receiver', type: 'address' },
            ],
            outputs: [{ name: '', type: 'uint256' }],
          },
        ],
        functionName: 'deposit',
        args: [amountWei, address],
      });

    } catch (error) {
      setIsDepositing(false);
      onError?.(error);
    }
  };

  const handleMaxAmount = () => {
    if (ethBalance.data) {
      const balance = parseFloat(formatUnits(ethBalance.data.value, ethBalance.data.decimals));
      // Leave a small amount for gas
      const maxAmount = Math.max(0, balance - 0.001);
      setAmount(maxAmount.toFixed(6));
    }
  };

  const isValidAmount = () => {
    if (!amount || !ethBalance.data) return false;
    const inputAmount = parseFloat(amount);
    const availableAmount = parseFloat(formatUnits(ethBalance.data.value, ethBalance.data.decimals));
    return inputAmount > 0 && inputAmount <= availableAmount;
  };

  return (
    <div className={styles.actionContent}>
      {/* Custom balance display */}
      <div className={styles.customBalanceDisplay}>
        <div className={styles.balanceRow}>
          <span className={styles.balanceLabel}>Available ETH:</span>
          <span className={styles.balanceValue}>
            {ethBalance.data ? 
              parseFloat(formatUnits(ethBalance.data.value, ethBalance.data.decimals)).toFixed(6) 
              : '0.000000'} ETH
          </span>
        </div>
        <div className={styles.balanceRow}>
          <span className={styles.balanceLabel}>Available WETH:</span>
          <span className={styles.balanceValue}>
            0.000000 WETH
          </span>
        </div>
        <div className={styles.balanceRow}>
          <span className={styles.balanceLabel}>Total Available:</span>
          <span className={styles.balanceValue}>
            {ethBalance.data ? 
              parseFloat(formatUnits(ethBalance.data.value, ethBalance.data.decimals)).toFixed(6) 
              : '0.000000'} ETH
          </span>
        </div>
      </div>

      {/* Amount input */}
      <div className={styles.amountInputContainer}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.000000"
          className={styles.amountInput}
          step="0.000001"
          min="0"
        />
        <button 
          onClick={handleMaxAmount}
          className={styles.maxButton}
          disabled={!ethBalance.data}
        >
          Use max
        </button>
      </div>

      {/* Deposit button */}
      <button
        onClick={handleDeposit}
        disabled={!isValidAmount() || isDepositing || !isConnected}
        className={styles.actionButton}
      >
        {isDepositing ? 'Depositing...' : 'Deposit ETH'}
      </button>

      {/* Error message */}
      {amount && !isValidAmount() && (
        <div className={styles.errorMessage}>
          Amount exceeds the balance
        </div>
      )}
    </div>
  );
}
