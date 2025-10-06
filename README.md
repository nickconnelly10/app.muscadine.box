# Muscadine Box

A comprehensive DeFi lending platform built as a Farcaster Mini App providing Muscadine vault lending services on the Base network.

**Live URL**: [app.muscadine.box](https://app.muscadine.box)

## Overview

Muscadine Box is a production-ready DeFi lending application featuring Muscadine vaults powered by Morpho Protocol v1. Built using modern web technologies and seamlessly integrated with the Farcaster ecosystem, it provides secure access to decentralized lending protocols with a focus on yield generation.

## Features

### Lending Services
- Morpho Protocol v1 vault integration supporting USDC, cbBTC, and ETH deposits
- Accurate vault balance tracking using convertToAssets methodology
- Transparent deposit and withdrawal mechanisms with OnchainKit validation
- Real-time yield calculation and vault analytics display
- Sponsored transaction processing to eliminate gas costs
- Dynamic token pricing with automatic refresh capabilities
- Collapsible vault interface for improved user experience

### Enhanced Platform Features
- **Streamlined Interface** - Focused lending experience with clean navigation
- **Consistent UI/UX** - Clean, modern design with light theme
- **Light Theme Design** - Optimized visibility and user experience
- **Collapsible Vault Interface** - Clean bars that expand to show full functionality
- **Real-time Balance Tracking** - Live updates of vault balances and yields
- **Gasless Transactions** - Sponsored transactions for seamless user experience

## Technical Architecture

### Core Technologies
- **Next.js 15.3.4** - React framework with App Router and Server Components
- **TypeScript 5.7.2** - Type-safe development with comprehensive type definitions
- **Tailwind CSS 3.4.17** - Utility-first CSS framework for responsive design
- **OnchainKit 1.0.0** - Coinbase's enterprise Web3 development kit
- **Wagmi 2.16.3** - React hooks for Ethereum interaction
- **Viem 2.31.6** - TypeScript library for Ethereum contract interaction
- **Base Network** - Optimized Ethereum Layer 2 for transaction processing

### DeFi Protocol Integrations
- **Morpho Labs v1** - Advanced lending protocol with yield optimization
- **Morpho v1 Vaults** - Specialized vault support with precise balance conversions
  - Muscadine USDC Vaults (0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F)
  - Muscadine cbBTC Vaults (0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9)
  - Muscadine ETH Vaults (0x21e0d366272798da3A977FEBA699FCB91959d120)

### Authentication Framework
- **Farcaster MiniKit 1.0.8** - Mini App development framework
- **Farcaster Quick Auth 0.0.7** - Streamlined user authentication
- **Wallet-agnostic support** - Compatible with all major Web3 wallet providers

## Project Structure and Organization

```
app/
├── components/
│   ├── SharedLayout.tsx          # Unified layout component
│   └── LendingPage.tsx           # Main lending interface
├── lending/
│   └── page.tsx                  # Lending page entry point
├── layout.tsx                    # Root layout with providers
├── page.tsx                      # Main page (redirects to lending)
├── globals.css                   # Global styles and light theme
└── page.module.css               # Component-specific styles
```

## User Interface and Experience

### Navigation System
- **Single-Page Focus** - Streamlined interface focused on lending
- **Clean Navigation** - Simple tab-based navigation
- **Consistent Layout** - SharedLayout component ensures uniform experience

### Visual Design
- **Light Theme** - Optimized for visibility and user experience
- **Modern UI** - Clean, professional interface design
- **Responsive Design** - Mobile-first approach with adaptive layouts

### Layout Architecture
- **Collapsible Vault Bars** - Clean interface showing vault name and balance
- **Expandable Content** - Click to reveal full deposit/withdraw functionality
- **Real-time Updates** - Live data synchronization for vault balances

## Development and Deployment

### Environment Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables
Create a `.env.local` file with:
```
COINGECKO_API_KEY=your_coingecko_api_key
```

### Deployment
The application is deployed on Vercel with automatic deployments from the main branch.

## Security and Best Practices

- **Type Safety** - Comprehensive TypeScript implementation
- **Input Validation** - Robust validation for all user inputs
- **Error Handling** - Graceful error handling with user-friendly messages
- **Security Headers** - Proper security headers and CSP configuration
- **Gas Optimization** - Sponsored transactions to eliminate user gas costs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.