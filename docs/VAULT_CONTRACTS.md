# Vault Contract Information

This document contains the official vault contract addresses and details for the Muscadine Box DeFi platform.

## Supported Vault Contracts

All vault contracts are deployed on Base network and implement the ERC-4626 standard.

### USDC Vault
- **Contract Address**: `0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F`
- **Token**: USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)
- **Decimals**: 6
- **BaseScan**: [View Contract](https://basescan.org/address/0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F)
- **Protocol**: Morpho Protocol v1

### cbBTC Vault
- **Contract Address**: `0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9`
- **Token**: cbBTC (`0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf`)
- **Decimals**: 8
- **BaseScan**: [View Contract](https://basescan.org/address/0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9)
- **Protocol**: Morpho Protocol v1

### WETH Vault
- **Contract Address**: `0x21e0d366272798da3A977FEBA699FCB91959d120`
- **Token**: WETH (`0x4200000000000000000000000000000000000006`)
- **Decimals**: 18
- **BaseScan**: [View Contract](https://basescan.org/address/0x21e0d366272798da3A977FEBA699FCB91959d120)
- **Protocol**: Morpho Protocol v1

## Contract Functions

All vault contracts support the following standard ERC-4626 functions:

### Core Functions
- `balanceOf(address account)` - Returns the vault shares for a user
- `convertToAssets(uint256 shares)` - Converts shares to current asset value
- `convertToShares(uint256 assets)` - Converts assets to shares
- `deposit(uint256 assets, address receiver)` - Deposit assets into the vault
- `withdraw(uint256 assets, address receiver, address owner)` - Withdraw assets from the vault
- `redeem(uint256 shares, address receiver, address owner)` - Redeem shares for assets

### Metadata Functions
- `name()` - Returns the vault name (fetched dynamically by the app)
- `symbol()` - Returns the vault symbol
- `decimals()` - Returns the vault decimals
- `totalAssets()` - Returns the total assets in the vault
- `totalSupply()` - Returns the total shares supply

## OnchainKit Integration

The application uses OnchainKit's Earn components to interact with these vaults:

- **WithdrawBalance** - Displays user's vault balance
- **WithdrawAmountInput** - Input component for withdrawal amounts
- **WithdrawButton** - Executes withdrawal transactions
- **Earn** - Wrapper component that provides vault context

## Security Notes

- All contracts are verified on BaseScan
- Contracts implement standard ERC-4626 interface
- All transactions are processed on Base network (Layer 2)
- Gas optimization handled by OnchainKit
- Real-time balance updates via wagmi hooks

## Usage in Application

The vault contracts are integrated throughout the application:

1. **ModernDashboard.tsx** - Main portfolio view with balance calculations
2. **WithdrawFlow** - OnchainKit-powered withdrawal interface
3. **useVaultData.ts** - Custom hooks for vault data fetching
4. **Vault name fetching** - Dynamic name retrieval using `name()` function

## Development

To interact with these contracts in development:

```typescript
import { useReadContract } from 'wagmi';

const vaultAbi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'convertToAssets',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'shares', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'name',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const;

// Example usage
const { data: vaultName } = useReadContract({
  address: '0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F',
  abi: vaultAbi,
  functionName: 'name',
  chainId: 8453, // Base network
});
```
