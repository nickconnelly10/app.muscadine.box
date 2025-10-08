"use client";
import { useEffect, useState } from 'react';
import { Address } from 'viem';

export type ClaimableReward = {
  amount: string;
  proof: string[];
  token: Address;
  tokenSymbol: string;
};

export type MorphoRewards = {
  claimable: ClaimableReward[];
  totalClaimableUSD: number;
  isLoading: boolean;
  error: Error | null;
};

// Universal Rewards Distributor contract address on Base
export const URD_ADDRESS = '0x330eefa8a787552DC5cAd3C3cA644844B1E61Ddb' as Address;

export function useMorphoRewards(userAddress: Address | undefined): MorphoRewards {
  const [rewards, setRewards] = useState<MorphoRewards>({
    claimable: [],
    totalClaimableUSD: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!userAddress) {
      setRewards({
        claimable: [],
        totalClaimableUSD: 0,
        isLoading: false,
        error: null,
      });
      return;
    }

    async function fetchRewards() {
      try {
        // Fetch claimable rewards from Morpho's rewards API
        const response = await fetch(
          `https://rewards.morpho.org/v1/users/${userAddress}?chainId=8453`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch rewards');
        }

        const data = await response.json();

        // Parse the rewards data
        const claimableRewards: ClaimableReward[] = [];
        let totalUSD = 0;

        if (data.rewards && Array.isArray(data.rewards)) {
          for (const reward of data.rewards) {
            if (reward.claimable && parseFloat(reward.claimable) > 0) {
              claimableRewards.push({
                amount: reward.claimable,
                proof: reward.proof || [],
                token: reward.token as Address,
                tokenSymbol: reward.symbol || 'MORPHO',
              });
              totalUSD += parseFloat(reward.claimableUsd || '0');
            }
          }
        }

        setRewards({
          claimable: claimableRewards,
          totalClaimableUSD: totalUSD,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching Morpho rewards:', error);
        setRewards({
          claimable: [],
          totalClaimableUSD: 0,
          isLoading: false,
          error: error as Error,
        });
      }
    }

    fetchRewards();
    // Refresh every 60 seconds
    const interval = setInterval(fetchRewards, 60000);
    return () => clearInterval(interval);
  }, [userAddress]);

  return rewards;
}

