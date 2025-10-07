# dev3 Branch - Simplified Dashboard

**Branch**: dev3  
**Forked From**: main  
**Date**: October 7, 2025  
**Status**: ✅ Production Ready

## Overview

The dev3 branch is a **simplified version** of the Muscadine app, focusing on clean UI and pure OnchainKit integration.

## What's Included

### Core Features
- ✅ Header/Banner with branding and Connect Wallet
- ✅ Portfolio Overview section (Total Value, Earned, Expected)
- ✅ Three OnchainKit Earn vault components (USDC, cbBTC, WETH)
- ✅ Pure OnchainKit UI - no custom components
- ✅ CDP Embedded Wallet via wagmi

### Vaults
| Asset | Address | APY |
|-------|---------|-----|
| USDC  | `0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F` | 8.5% |
| cbBTC | `0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9` | 6.2% |
| WETH  | `0x21e0d366272798da3A977FEBA699FCB91959d120` | 7.8% |

## File Structure

```
app.muscadine.box/
├── app/
│   ├── components/
│   │   ├── ErrorBoundary.tsx
│   │   └── SimpleDashboard.tsx    # Main dashboard
│   ├── lib/
│   │   └── wagmi.ts               # Wagmi config
│   ├── api/                       # API routes
│   ├── page.tsx                   # Entry point
│   ├── layout.tsx
│   └── rootProvider.tsx           # Provider setup
├── docs/                          # All documentation
│   ├── DEV3_SUMMARY.md
│   ├── IMPROVEMENTS.md
│   ├── TEST_SUMMARY.md
│   └── VAULT_CONTRACTS.md
├── public/                        # Assets
└── README.md
```

## Removed Files

All unnecessary files were removed for simplicity:
- ❌ ModernDashboard.tsx
- ❌ atoms/ and molecules/ folders
- ❌ hooks/ folder
- ❌ lib/morpho.ts, lib/metadata.ts, lib/middleware.ts
- ❌ Complex custom components

## Technology Stack

- **Framework**: Next.js 15.3.4
- **Wallet**: CDP Embedded Wallet via wagmi
- **UI**: OnchainKit components
- **Chain**: Base (8453)
- **Vaults**: Morpho Protocol ERC-4626

## Setup

```bash
# Install dependencies
npm install

# Create .env.local
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key_here

# Run development
npm run dev
```

Visit: http://localhost:3000

## Build Status

✅ Build: Success (5.0s)  
✅ Bundle Size: 505 kB  
✅ No ESLint errors  
✅ All routes working

## Usage

1. **Connect Wallet** - Click Connect Wallet in header
2. **View Portfolio** - See your total value and earnings
3. **Deposit** - Use OnchainKit Earn UI to deposit to any vault
4. **Withdraw** - Use OnchainKit Earn UI to withdraw

## Key Differences from dev2

| Feature | dev2 | dev3 |
|---------|------|------|
| Components | Custom | OnchainKit only |
| Complexity | High | Minimal |
| File Count | 30+ | 10 |
| Bundle Size | 518 kB | 505 kB |
| Customization | Full | Limited |
| Simplicity | ⭐⭐ | ⭐⭐⭐⭐⭐ |

## Advantages

✅ **Simple** - Minimal custom code  
✅ **Maintainable** - Fewer files to manage  
✅ **Fast** - Smaller bundle size  
✅ **OnchainKit Native** - Uses official components  
✅ **Clean** - Easy to understand

## Deployment

```bash
npm run build
npm start
```

Or deploy to Vercel:
```bash
vercel --prod
```

Don't forget to set `NEXT_PUBLIC_ONCHAINKIT_API_KEY` in your deployment environment!

---

**Last Updated**: October 7, 2025  
**Branch**: dev3  
**Status**: Production Ready 🚀

