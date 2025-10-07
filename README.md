# Muscadine Box

A professional DeFi lending platform built as a Farcaster Mini App, providing access to Muscadine vaults powered by Morpho Protocol v1 on the Base network.

**Live URL**: [app.muscadine.box](https://app.muscadine.box)

## Overview

Muscadine Box is a production-ready DeFi lending application featuring Muscadine vaults powered by Morpho Protocol v1. Built with modern web technologies and integrated with the Farcaster ecosystem, it provides secure access to decentralized lending protocols with real-time yield generation.

## Features

### Core Functionality
- **Morpho Protocol v1 Integration** - Support for USDC, cbBTC, and ETH deposits
- **Real-time Balance Tracking** - Accurate vault balance calculations using convertToAssets methodology
- **Dynamic Pricing** - Live token prices from CoinGecko API with 30-second refresh
- **Sponsored Transactions** - Gasless transactions for seamless user experience
- **Professional Interface** - Horizontal vault design with expandable functionality
- **ETH/WETH Auto-conversion** - Native ETH deposits automatically wrapped to WETH

### Vault Support
- **Muscadine USDC Vaults** - `0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F`
- **Muscadine cbBTC Vaults** - `0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9`
- **Muscadine ETH Vaults** - `0x21e0d366272798da3A977FEBA699FCB91959d120`

### Token Addresses (BaseScan Verified)
- **USDC**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **cbBTC**: `0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf`
- **WETH**: `0x4200000000000000000000000000000000000006`

## Technical Stack

### Frontend Technologies
- **Next.js 15.3.4** - React framework with App Router
- **TypeScript 5.7.2** - Type-safe development
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **OnchainKit 1.1.1** - Coinbase Web3 development kit
- **Wagmi 2.16.3** - React hooks for Ethereum interaction
- **Viem 2.31.6** - TypeScript library for contract interaction

### Blockchain Integration
- **Base Network** - Ethereum Layer 2 for transaction processing
- **Morpho Labs v1** - Advanced lending protocol with yield optimization
- **Farcaster MiniKit 1.0.8** - Mini App development framework
- **Wallet Integration** - Support for all major Web3 wallets

## Project Structure

```
app/
├── components/
│   ├── SharedLayout.tsx          # Unified layout component
│   └── LendingPage.tsx           # Main lending interface
├── lending/
│   └── page.tsx                  # Lending page entry point
├── layout.tsx                    # Root layout with providers
├── page.tsx                      # Main page with total deposits
└── page.module.css               # Component styles
```

## Key Features

### Real-time Data Integration
- **Live Token Prices** - USDC ($1.00), cbBTC (Bitcoin price), ETH (Ethereum price)
- **Wallet Balance Tracking** - Real-time wallet balances for all supported tokens
- **Vault Balance Calculation** - Accurate deposit amounts using OnchainKit
- **Interest Accrual** - Real-time interest earned calculations
- **Combined ETH/WETH Balances** - Shows total ETH value including wrapped tokens

### User Interface
- **Compact Total Display** - Streamlined total deposits section
- **Expandable Vault Interface** - Full-width expansion for detailed operations
- **Professional Design** - Clean, modern interface with proper asset icons
- **Responsive Layout** - Mobile-first design with adaptive layouts
- **Smart Interest Display** - Shows accrued interest or helpful messaging

## Development

### Setup
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
npm start
```

### Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
```

## Recent Updates

### Latest Improvements
- **USDC Price Formatting** - Displayed as $1.00 for professional appearance
- **ETH/WETH Integration** - Native ETH deposits with automatic WETH conversion
- **Compact UI Design** - Streamlined total deposits section
- **Smart Interest Display** - Better messaging for interest accrual
- **BaseScan Token Integration** - Verified token addresses for accurate data
- **Redundant Data Removal** - Cleaner interface without duplicate information

## Security

- **Type Safety** - Comprehensive TypeScript implementation
- **Input Validation** - Robust validation for all user inputs
- **Error Handling** - Graceful error handling with fallback values
- **Gas Optimization** - Sponsored transactions eliminate user costs

## Deployment

The application is deployed on Vercel with automatic deployments from the main branch.

## License

MIT License