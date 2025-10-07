# Muscadine Box

A professional DeFi lending platform built as a Farcaster Mini App, providing secure access to Muscadine vaults powered by Morpho Protocol v1 on Base.

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
│   ├── ErrorBoundary.tsx          # Error boundary component
│   ├── ETHDepositComponent.tsx   # Custom ETH deposit handling
│   ├── LoadingStates.tsx          # Loading components
│   ├── LendingPage.tsx           # Main lending interface
│   └── SharedLayout.tsx          # Layout wrapper
├── hooks/
│   └── useVaultData.ts           # Custom blockchain hooks
├── lib/
│   ├── metadata.ts               # SEO metadata generation
│   └── middleware.ts             # Security & rate limiting
├── api/
│   └── webhook/
│       └── route.ts              # Webhook handlers
├── layout.tsx                   # Root layout
├── rootProvider.tsx             # Global providers
└── next.config.ts               # Next.js configuration
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

## Security Features

- **Rate Limiting** - 100 requests per minute per IP
- **Security Headers** - X-Frame-Options, CSP, HSTS, XSS Protection
- **Error Boundaries** - Comprehensive error handling
- **Input Validation** - Middleware validation for API routes
- **CORS Protection** - Proper CORS configuration

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