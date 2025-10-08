import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClaimRewardsButton from '../ClaimRewardsButton';
import type { Address } from 'viem';
import { vi } from 'vitest';

// Ensure React is available globally for JSX
global.React = React;

// Mock window object for browser environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const mockWriteContract = vi.fn();

vi.mock('wagmi', () => ({
  useAccount: () => ({ address: '0xuser' as Address, isConnected: true }),
  useWriteContract: () => ({ writeContract: mockWriteContract, data: null, isPending: false }),
  useWaitForTransactionReceipt: () => ({ isLoading: false, isSuccess: false }),
}));

vi.mock('../../hooks/useMorphoRewards', () => ({
  useMorphoRewards: (addr: Address | undefined) => {
    if (!addr) return { claimable: [], totalClaimableUSD: 0, isLoading: false, error: null };
    return {
      claimable: [{ amount: '1.5', proof: ['0xproof'], token: '0xtoken' as Address, tokenSymbol: 'ABC' }],
      totalClaimableUSD: 3,
      isLoading: false,
      error: null,
    };
  },
  URD_ADDRESS: '0xURD' as Address,
}));

vi.mock('../../lib/urdAbi', () => ({ URD_ABI: [] }));

// Mock viem utilities
vi.mock('viem', () => ({
  parseUnits: (value: string, decimals: number) => {
    // Convert decimal string to BigInt properly
    const [integer, decimal = ''] = value.split('.');
    const paddedDecimal = decimal.padEnd(decimals, '0').slice(0, decimals);
    return BigInt(integer + paddedDecimal);
  },
}));

describe('ClaimRewardsButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure clean DOM
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders when rewards are claimable', () => {
    render(<ClaimRewardsButton />);
    expect(screen.getByRole('button', { name: /Claim All Rewards/i })).toBeInTheDocument();
  });

  it('calls writeContract with correct args on claim', async () => {
    render(<ClaimRewardsButton />);
    const btn = screen.getByRole('button', { name: /Claim All Rewards/i });
    fireEvent.click(btn);
    
    expect(mockWriteContract).toHaveBeenCalledWith(
      expect.objectContaining({
        address: '0xURD',
        functionName: 'claim',
        args: expect.arrayContaining(['0xuser', '0xtoken']),
      })
    );
  });

  it('shows disabled state when pending', async () => {
    vi.resetModules();
    vi.doMock('wagmi', () => ({
      useAccount: () => ({ address: '0xuser' as Address }),
      useWriteContract: () => ({ writeContract: mockWriteContract, data: null, isPending: true }),
      useWaitForTransactionReceipt: () => ({ isLoading: false, isSuccess: false }),
    }));
    const { default: PendingButton } = await import('../ClaimRewardsButton');
    render(<PendingButton />);
    const btn = screen.getByRole('button', { name: /Confirming.../i });
    expect(btn).toBeDisabled();
  });
});

