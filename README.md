# Muscadine Box

A comprehensive DeFi platform built as a Farcaster Mini App providing portfolio management, lending services, and token swapping capabilities on the Base network.

**Live URL**: [app.muscadine.box](https://app.muscadine.box)

## Overview

Muscadine Box is a production-ready DeFi application that combines sophisticated portfolio tracking, lending services, and token swapping in a unified interface optimized for the Base network. Built using modern web technologies and seamlessly integrated with the Farcaster ecosystem, it provides secure access to decentralized finance protocols.

## Features

### Portfolio Management
- Real-time token balance tracking for ETH, USDC, cBBTC, WETH, MORPHO, cbXRP, AERO, and MOONWELL
- Dynamic portfolio valuation with CoinGecko API integration
- Interactive token cards with fallback image generation
- Wallet address integration with external analytics platforms
- Direct BaseScan integration for complete transaction visibility

### Lending Services
- Morpho Protocol vault integration supporting USDC, cBETH, and WETH deposits
- Accurate vault balance tracking using convertToAssets methodology
- Transparent deposit and withdrawal mechanisms with OnchainKit validation
- Real-time yield calculation and vault analytics display
- Sponsored transaction processing to eliminate gas costs
- Dynamic token pricing with automatic refresh capabilities

### Token Swapping
- 1inch DEX integration for optimal token exchange routing
- Comprehensive token support with real-time slippage management
- Advanced swap interface with transaction preview functionality
- Seamless integration with Aerodrome Finance for native Base liquidity
- Intelligent quote aggregation for best execution strategies

### Enhanced Platform Features
- Farcaster Mini App integration for embedded discovery
- Multi-wallet compatibility with secure transaction handling
- Responsive design optimized for mobile and desktop experiences
- Real-time data synchronization for portfolio accuracy
- External integrations with Zerion for advanced portfolio analytics
- **Unified Navigation System** - Persistent tab navigation across all pages
- **Consistent UI/UX** - Shared layout component ensuring uniform experience
- **Light Theme Design** - Optimized color scheme for better visibility and readability

## User Interface and Experience

### Navigation System
- **Persistent Tab Navigation** - Consistent navigation bar across all pages (Portfolio, Lending, Swap, Transactions)
- **Active State Management** - Dynamic highlighting of current page using Next.js `usePathname()` hook
- **Seamless Page Transitions** - Smooth navigation between different sections without losing context
- **Responsive Design** - Optimized for both mobile and desktop experiences

### Visual Design
- **Light Theme Implementation** - Clean, modern color scheme optimized for readability
- **Consistent Color Palette** - Light blue (`#0ea5e9`) and cyan (`#06b6d4`) gradients for interactive elements
- **High Contrast Text** - Ensured visibility with proper color contrast ratios
- **Unified Component Styling** - Shared CSS classes for consistent appearance across all pages

### Layout Architecture
- **SharedLayout Component** - Centralized layout management with header, navigation, and content areas
- **Modular Page Structure** - Each page wrapped in SharedLayout for consistency
- **Responsive Grid Systems** - Flexible layouts that adapt to different screen sizes
- **Component Reusability** - Shared styling and layout patterns across the application

## Technical Architecture

### Frontend Infrastructure
- **Next.js 15.3.4** - Advanced React framework with App Router optimization
- **TypeScript 5** - Comprehensive type safety enforcement
- **Tailwind CSS** - Utility-first styling framework
- **React 19** - Latest React capabilities with concurrent rendering

### Blockchain Integration Stack
- **OnchainKit 1.0.0** - Coinbase's enterprise Web3 development kit
- **Wagmi 2.16.3** - React hooks for Ethereum interaction
- **Viem 2.31.6** - TypeScript library for Ethereum contract interaction
- **Base Network** - Optimized Ethereum Layer 2 for transaction processing

### DeFi Protocol Integrations
- **Morpho Labs** - Advanced lending protocol with yield optimization
- **Morpho Vaults** - Specialized vault support with precise balance conversions
  - USDC Vault (0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F)
  - cBETH Vault (0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9)
  - WETH Vault (0x21e0d366272798da3A977FEBA699FCB91959d120)

### Authentication Framework
- **Farcaster MiniKit 1.0.8** - Mini App development framework
- **Farcaster Quick Auth 0.0.7** - Streamlined user authentication
- **Wallet-agnostic support** - Compatible with all major Web3 wallet providers

## Project Configuration

### Environment Setup

Prerequisites:
- Node.js 18 or higher
- Modern package manager (npm, yarn, pnpm, or bun)
- OnchainKit API key from Coinbase Developer Platform
- Base network access through wallet or RPC providers

### Installation Process

1. Clone and configure environment:
```bash
git clone https://github.com/nickconnelly10/app.muscadine.box.git
cd app.muscadine.box
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env.local
```

3. Set required environment variables in `.env.local`:
```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_URL=https://app.muscadine.box
NEXT_PUBLIC_PROJECT_NAME=app.muscadine.box
```

4. Initialize development environment:
```bash
npm run dev
```
Access application at `http://localhost:3000`

### Production Deployment

```bash
npm run build
npm start
```

## Project Structure and Organization

```
project/
├── app/
│   ├── .well-known/
│   │   └── farcaster.json              # Mini App manifest
│   ├── api/
│   │   ├── auth/                       # Authentication endpoints
│   │   ├── webhook/                    # Webhook implementation
│   │   ├── farcaster/                  # Farcaster integration
│   │   ├── simple/                     # Standard API routes
│   │   └── test/                       # Testing endpoints
│   ├── components/
│   │   ├── SharedLayout.tsx            # Unified navigation and layout component
│   │   ├── HomePage.tsx                # Portfolio and swap interface
│   │   └── LendingPage.tsx             # Lending vault interface
│   ├── lending/
│   │   └── page.tsx                    # Lending page with shared layout
│   ├── swap/
│   │   └── page.tsx                    # Swap page with shared layout
│   ├── transactions/
│   │   └── page.tsx                    # Transactions page with shared layout
│   ├── services/
│   │   └── dexService.ts               # 1inch integration service
│   ├── layout.tsx                      # Root layout component
│   ├── page.tsx                        # Primary application page
│   ├── page.module.css                 # Comprehensive styling with light theme
│   ├── rootProvider.tsx               # OnchainKit configuration
│   └── globals.css                     # Global styling definitions
├── public/                            # Static asset directory
├── package.json                       # Dependencies and scripts
├── minikit.config.ts                  # Mini App configuration
├── next.config.ts                      # Next.js configuration
├── tsconfig.json                       # TypeScript configuration
└── eslint.config.mjs                   # Linting configuration
```

## API Architecture

### Authentication Endpoints
- `GET /.well-known/farcaster.json` - Mini App distribution manifest
- `POST /api/auth` - Secure authentication verification
- `POST /api/farcaster` - Farcaster integration management
- `POST /api/webhook` - Event processing infrastructure
- `GET /api/simple` - Standard API access point
- `GET /api/test` - Comprehensive testing framework

### External Service Integration Access Points
- Platform analytics through Zerion integration for wallet analysis
- Comprehensive swap functionality via Aerodrome Finance routing
- Direct transaction verification through BaseScan monitoring
- Real-time pricing synchronization with CoinGecko market data

## Performance and Optimization

### Application Metrics
- Optimized bundle size: 96.1 kB primary bundle with efficient tree shaking
- First load optimization: 574 kB total including framework dependencies
- Static generation optimization with zero server responses for critical paths
- Comprehensive route-based code splitting with automatic bundle optimization

### Real-time Data Synchronization
- Dynamic token pricing with thirty-second refresh intervals
- Vault balance recalculation using Morpho protocol's convertToAssets methodology
- Comprehensive transaction tracking with BaseScan integration
- Real-time monitoring for asset price fluctuations and yield optimization

### Security Implementation
- Secure transaction flow with OnchainKit transaction validation
- Private key management through hardware wallet integration
- Comprehensive cryptographic validation for all financial operations
- Encrypted API communications with certificate pinning

## Development Environment

### Code Standards and Quality
- Full TypeScript implementation with strict mode enforcement
- Advanced ESLint configuration with comprehensive type checking
- Automatic code formatting with Prettier integration
- Comprehensive component-level testing capabilities
- Production-ready error handling with graceful degradation paths

### Development Commands
```bash
npm run dev     # Development server initialization
npm run build   # Production build verification
npm run start   # Production server distribution
npm run lint    # Comprehensive code quality analysis
```

### Contribution Framework
1. Repository forking with persistent integration
2. Structured feature branch development
3. Comprehensive testing including build verification
4. Automated pull request review initialization

## Deployment Optimization

### Vercel Production Configuration
- Automatic deployment pipeline through Git repository integration
- Environment variable management in Vercel dashboard configuration
- Automatic deployment triggering on main branch updates
- Comprehensive performance monitoring and optimization analysis

### Platform Compatibility
- Full compatibility with Vercel hosting infrastructure
- Standard Netlify deployment configuration support
- Comprehensive Cloudflare Pages deployment options
- Next.js application framework compatibility for enterprise hosting

## Implementation Verification

### Authentication Framework Validation
- Certified OnchainKit configuration with Base network optimization
- Complete Farcaster Mini App specification compliance verification
- Comprehensive wallet authentication testing through multi-provider support
- Thorough transaction security validation with digital signature verification

### Financial Protocol Integration
- Morpho Protocol integration with comprehensive vault configuration
- Precise yield calculation through convertToAssets methodology validation
- Real-time lending protocol interaction with accurate balance tracking
- Sophisticated interest calculation with continuous vault monitoring

### DEX Integration Completion
- Full 1inch API integration for advanced token exchange
- Comprehensive transaction routing with optimal slippage management
- Aerodrome Finance connection for expanded trading functionality
- Real-time quote aggregation with intelligent price optimization

## Technical Support and Documentation

Comprehensive technical support accessible through:
- Automated issue tracking platform
- Complete OnchainKit documentation reference
- Farcaster Mini Apps development guidance
- Professional development documentation assistance

## Primary External Resources

- [OnchainKit Documentation](https://docs.base.org/onchainkit)
- [Farcaster Mini Apps Implementation Guide](https://miniapps.farcaster.xyz)
- [Base Network Platform](https://base.org)
- [Morpho Protocol Implementation](https://morpho.org)
- [Next.js Framework Documentation](https://nextjs.org/docs)
- [Wagmi Development Library](https://wagmi.sh)
- [Zerion Portfolio Analytics](https://app.zerion.io)
- [Aerodrome Finance Platform](https://aerodrome.finance)

## License and Distribution

This application is licensed under the MIT License formal implementation and comprehensive licensing framework following enterprise software distribution standards.