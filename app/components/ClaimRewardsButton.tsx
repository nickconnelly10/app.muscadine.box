"use client";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useMorphoRewards, URD_ADDRESS } from '../hooks/useMorphoRewards';
import { URD_ABI } from '../lib/urdAbi';
import { parseUnits } from 'viem';

export default function ClaimRewardsButton() {
  const { address } = useAccount();
  const rewards = useMorphoRewards(address);
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Debug logging
  if (typeof window !== 'undefined' && address) {
    console.log('[ClaimRewards] Address:', address);
    console.log('[ClaimRewards] Rewards state:', rewards);
    console.log('[ClaimRewards] Has claimable:', rewards.claimable.length);
  }

  const handleClaimAll = async () => {
    if (!address || rewards.claimable.length === 0) return;

    try {
      // Claim each reward token
      for (const reward of rewards.claimable) {
        await writeContract({
          address: URD_ADDRESS,
          abi: URD_ABI,
          functionName: 'claim',
          args: [
            address,
            reward.token,
            parseUnits(reward.amount, 18), // MORPHO has 18 decimals
            reward.proof as `0x${string}`[],
          ],
        });
      }
    } catch (error) {
      console.error('Error claiming rewards:', error);
    }
  };

  // Don't show button if not connected
  if (!address) {
    return null;
  }

  // Show loading state
  if (rewards.isLoading) {
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        marginBottom: '1rem',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.875rem'
      }}>
        Checking for claimable rewards...
      </div>
    );
  }

  // Show "no rewards" message temporarily for debugging
  if (rewards.claimable.length === 0) {
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        marginBottom: '1rem',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.875rem'
      }}>
        No MORPHO rewards available to claim yet. Keep earning! 🎯
      </div>
    );
  }

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    return num.toFixed(4);
  };

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      marginBottom: '2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 0.5rem'
          }}>
            Claimable Rewards
          </h3>
          <div style={{
            fontSize: '0.875rem',
            color: '#64748b'
          }}>
            {rewards.claimable.map((reward, i) => (
              <div key={i}>
                {formatAmount(reward.amount)} {reward.tokenSymbol}
              </div>
            ))}
            {rewards.totalClaimableUSD > 0 && (
              <div style={{ marginTop: '0.25rem', fontWeight: '500', color: '#0f172a' }}>
                ≈ ${rewards.totalClaimableUSD.toFixed(2)} USD
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={handleClaimAll}
          disabled={isPending || isConfirming}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: isPending || isConfirming ? '#94a3b8' : '#0052ff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          }}
          onMouseEnter={(e) => {
            if (!isPending && !isConfirming) {
              e.currentTarget.style.backgroundColor = '#0041cc';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isPending && !isConfirming) {
              e.currentTarget.style.backgroundColor = '#0052ff';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
            }
          }}
        >
          {isPending ? 'Confirming...' : isConfirming ? 'Claiming...' : isSuccess ? 'Claimed!' : 'Claim All Rewards'}
        </button>
      </div>
    </div>
  );
}

