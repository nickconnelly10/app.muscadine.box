# Muscadine Box

A professional DeFi lending platform built as a Farcaster Mini App, providing secure access to Muscadine vaults powered by Morpho Protocol v1 on Base.

**Live URL**: [app.muscadine.box](https://app.muscadine.box)

## Overview

Muscadine Box is a production-ready DeFi lending application featuring Muscadine vaults powered by Morpho Protocol v1. Built with modern web technologies and integrated with the Farcaster ecosystem, it provides secure access to decentralized lending protocols with real-time yield generation.

## Features

### Core Functionality
- **Morpho Protocol v1 Integration** - Support for USDC, cbBTC, and WETH vaults on Base
- **Real-time Balance Tracking** - Accurate vault balance calculations using ERC-4626 `convertToAssets` 
- **Dynamic Pricing** - Live token prices from CoinGecko API with 30-second refresh
- **OnchainKit Earn Integration** - Seamless deposits and withdrawals using Coinbase's OnchainKit components
- **Professional Dashboard** - Modern portfolio overview with detailed vault metrics
- **Interest Projections** - Monthly earnings estimates based on current APY rates
- **Wallet Integration** - Support for all major Web3 wallets via OnchainKit

### Vault Support
- **USDC Vault** - `0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F`
  - Morpho Protocol v1 USDC vault on Base
  - ~8.5% APY (estimated)
  - Full deposit/withdraw functionality via OnchainKit
  - Real-time balance tracking with ERC-4626 standard
- **cbBTC Vault** - `0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9`
  - Morpho Protocol v1 cbBTC vault on Base
  - ~6.2% APY (estimated)
  - Coinbase Wrapped Bitcoin yield generation
  - OnchainKit Earn components integration
- **WETH Vault** - `0x21e0d366272798da3A977FEBA699FCB91959d120`
  - Morpho Protocol v1 WETH vault on Base
  - ~7.8% APY (estimated)
  - Ethereum yield farming on Layer 2
  - Seamless deposit and withdrawal flows

### Token Addresses (BaseScan Verified)
- **USDC**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **cbBTC**: `0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf`
- **WETH**: `0x4200000000000000000000000000000000000006`

### Vault Contract Details
All vault contracts implement the ERC-4626 standard and include the following functions:
- `balanceOf(address)` - Returns user's vault shares
- `convertToAssets(uint256)` - Converts shares to current asset value
- `name()` - Returns the official vault name (fetched dynamically)
- `symbol()` - Returns the vault token symbol
- `decimals()` - Returns the vault's decimal precision

**Contract Verification**: All contracts are verified on BaseScan and can be viewed at:
- [USDC Vault](https://basescan.org/address/0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F)
- [cbBTC Vault](https://basescan.org/address/0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9)
- [WETH Vault](https://basescan.org/address/0x21e0d366272798da3A977FEBA699FCB91959d120)

## Technical Stack

### Frontend Technologies
- **Next.js 15.3.4** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Custom CSS** - Design system with CSS variables for theming
- **OnchainKit 1.1.1** - Coinbase Web3 development kit
- **Wagmi 2.16.3** - React hooks for Ethereum interaction
- **Viem 2.31.6** - TypeScript library for contract interaction
- **React Query 5.81.5** - Data fetching and caching

### Blockchain Integration
- **Base Network** - Ethereum Layer 2 for low-cost transactions
- **Morpho Protocol v1** - Advanced lending protocol with yield optimization
- **OnchainKit 1.1.1** - Coinbase's Web3 development kit with built-in vault support
- **Farcaster MiniKit SDK 0.1.8** - Mini App development framework
- **Farcaster Quick Auth 0.0.7** - Secure authentication for Mini Apps
- **Wallet Integration** - Support for all major Web3 wallets via OnchainKit

### OnchainKit Integration
- **Earn Components** - Full vault management with deposit and withdraw flows
  - `DepositBalance`, `DepositAmountInput`, `DepositButton` for deposits
  - `WithdrawBalance`, `WithdrawAmountInput`, `WithdrawButton` for withdrawals
- **Wallet Components** - `ConnectWallet` integration for seamless authentication
- **Gas Optimization** - OnchainKit handles gas estimation and transaction optimization
- **Error Handling** - Comprehensive error states and user feedback
- **Real-time Updates** - Automatic balance and vault state updates
- **ERC-4626 Standard** - Native support for vault share calculations

## Project Structure

```
app/
├── components/
│   ├── atoms/
│   │   └── index.tsx             # Atomic UI components (Button, Badge, etc.)
│   ├── molecules/
│   │   └── index.tsx             # Compound components (VaultCard, DepositFlow, etc.)
│   ├── ErrorBoundary.tsx         # Error boundary component
│   ├── ETHDepositComponent.tsx   # Custom ETH deposit handling
│   ├── LendingPage.tsx           # Alternative lending interface
│   ├── ModernDashboard.tsx       # Main portfolio dashboard (PRIMARY)
│   └── SharedLayout.tsx          # Layout wrapper
├── hooks/
│   └── useVaultData.ts           # Custom blockchain hooks
├── lib/
│   ├── metadata.ts               # SEO metadata generation
│   └── middleware.ts             # Security & rate limiting
├── services/
│   └── dexService.ts             # DEX integration (future)
├── api/
│   ├── auth/route.ts             # Farcaster authentication
│   ├── farcaster/route.ts        # Farcaster manifest
│   └── webhook/route.ts          # Webhook handlers
├── styles/
│   └── design-system.css         # Global design tokens
├── layout.tsx                    # Root layout
├── page.tsx                      # Home page
├── rootProvider.tsx              # OnchainKit & React Query providers
└── minikit.config.ts             # Farcaster Mini App config
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nickconnelly10/app.muscadine.box.git
   cd app.muscadine.box
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   Add your OnchainKit API key:
   ```env
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

```bash
npm run build
npm start
```

## Key Features Breakdown

### Interest Calculations
- **ERC-4626 Compliant** - Uses standard `convertToAssets` for accurate share valuations
- **Projected Earnings** - Shows monthly earnings estimate based on current APY
- **Note**: Exact historical interest earned requires deposit tracking (not stored on-chain)
- **APY Display** - Real-time annual percentage yield for each vault

### Security Features
- **Rate Limiting** - Middleware protection against abuse
- **Security Headers** - X-Frame-Options, CSP, HSTS, XSS Protection
- **Error Boundaries** - Comprehensive error handling with fallbacks
- **Input Validation** - Middleware validation for API routes
- **CORS Protection** - Proper CORS configuration
- **JWT Verification** - Farcaster Quick Auth for Mini App security

## Performance Optimizations

- **React Query** - Intelligent caching with 5-minute stale time
- **Code Splitting** - Optimized package imports
- **Image Optimization** - WebP/AVIF support
- **Bundle Size** - Reduced with tree shaking
- **Loading States** - Skeleton screens for better perceived performance

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@muscadine.box or join our community discussions.

---

**Built with ❤️ by the Muscadine team**