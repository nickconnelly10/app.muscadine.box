# Muscadine Box

A comprehensive DeFi platform built as a Farcaster Mini App, providing portfolio management, lending services, and token swapping capabilities on the Base network.

**Live URL**: [app.muscadine.box](https://app.muscadine.box)

## Overview

Muscadine Box is a full-featured DeFi application that combines portfolio management, lending services, and token swapping in a single, user-friendly interface. Built with modern web technologies and integrated with the Farcaster ecosystem, it provides seamless access to decentralized finance on the Base network.

## Features

### Portfolio Management
- Real-time token balance tracking for ETH, USDC, WBTC, cBBTC, DAI, and AERO
- Total portfolio value calculation and display
- Interactive token selection and management
- Responsive design optimized for mobile and desktop

### Lending Services
- Multiple Morpho vault support (USDC, cBBTC, WETH)
- Dynamic vault selection interface
- Deposit and withdraw functionality with OnchainKit integration
- Real-time yield and vault details display
- Sponsored transactions for gas-free operations

### Token Swapping
- Custom swap interface with token selection
- Support for all tracked tokens
- Integration-ready for DEX aggregators
- User-friendly swap flow design

### Wallet Integration
- Seamless wallet connection via OnchainKit
- Support for multiple wallet providers
- Farcaster Mini App authentication
- Secure transaction handling

## Technology Stack

### Frontend
- **Next.js 15.3.4** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React 19** - Latest React features

### Blockchain Integration
- **OnchainKit** - Coinbase's Web3 development kit
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum
- **Base Network** - Ethereum L2 for transactions

### DeFi Protocols
- **Morpho Labs** - Lending protocol integration
- **Multiple Vault Support** - USDC, cBBTC, WETH vaults

### Authentication & Mini Apps
- **Farcaster MiniKit** - Mini App framework
- **Farcaster Quick Auth** - Seamless authentication
- **Wallet Integration** - Multi-provider support

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun package manager
- OnchainKit API key from Coinbase Developer Platform

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nickconnelly10/app.muscadine.box.git
cd app.muscadine.box
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_URL=https://app.muscadine.box
NEXT_PUBLIC_PROJECT_NAME=app.muscadine.box
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── .well-known/
│   └── farcaster.json           # Farcaster Mini App manifest
├── api/
│   ├── auth/                    # Authentication endpoints
│   ├── webhook/                 # Webhook handlers
│   ├── simple/                  # Simple API routes
│   └── test/                    # Test endpoints
├── components/
│   ├── HomePage.tsx             # Portfolio and swap interface
│   └── LendingPage.tsx          # Lending vault interface
├── layout.tsx                   # Root layout with providers
├── page.tsx                     # Main application page
├── not-found.tsx                # 404 error page
├── rootProvider.tsx             # OnchainKit provider setup
├── globals.css                  # Global styles
└── page.module.css              # Component-specific styles
```

## Configuration

### Farcaster Mini App Setup

The application includes a complete Farcaster Mini App manifest at `/.well-known/farcaster.json` with:
- Frame metadata and capabilities
- Base Builder integration
- Proper authentication flow
- Mini App specifications compliance

### Environment Variables

Required environment variables:

```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
NEXT_PUBLIC_URL=https://app.muscadine.box
NEXT_PUBLIC_PROJECT_NAME=app.muscadine.box
```

### Vault Configuration

The application supports multiple Morpho vaults:
- **USDC Vault**: `0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A`
- **cBBTC Vault**: `0x6770216aC60F634483Ec073cBABC4011c94307Cb`
- **WETH Vault**: `0x6b13c060F13Af1fdB319F52315BbbF3fb1D88844`

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm start
```

The application is optimized for deployment on Vercel, Netlify, or any Next.js-compatible platform.

## API Endpoints

- `GET /.well-known/farcaster.json` - Farcaster Mini App manifest
- `GET /api/auth` - Authentication verification
- `POST /api/webhook` - Webhook event handler
- `GET /api/simple` - Simple API endpoint
- `GET /api/test` - Test endpoint

## Development

### Code Quality

The project includes:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Next.js built-in optimizations

### Testing

```bash
npm run lint    # Run ESLint
npm run build   # Build and type check
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all environment variables are set correctly
2. **Wallet Connection**: Verify OnchainKit API key is valid
3. **Vault Errors**: Check that vault addresses are correct and accessible
4. **TypeScript Errors**: Run `npm run build` to identify type issues

### Support

For technical support or questions:
- Check the [Issues](https://github.com/nickconnelly10/app.muscadine.box/issues) page
- Review the [OnchainKit Documentation](https://docs.base.org/onchainkit)
- Consult [Farcaster Mini Apps Guide](https://miniapps.farcaster.xyz)

## Resources

- [OnchainKit Documentation](https://docs.base.org/onchainkit)
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz)
- [Base Network](https://base.org)
- [Morpho Labs](https://morpho.org)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
