# Muscadine Box

DeFi lending platform on Base. Farcaster Mini App.

**Live**: [app.muscadine.box](https://app.muscadine.box)

## Stack

- Next.js 15.3.4 + TypeScript
- OnchainKit 1.1.1
- Wagmi 2.16.3 + Viem 2.31.6
- Farcaster MiniKit 0.1.8

## Vaults

**USDC** `0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F` - 8.5% APY  
**cbBTC** `0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9` - 6.2% APY  
**WETH** `0x21e0d366272798da3A977FEBA699FCB91959d120` - 7.8% APY

All ERC-4626 on Morpho Protocol v1 (Base).

## Setup

```bash
npm install
cp .env.example .env.local
# Add NEXT_PUBLIC_ONCHAINKIT_API_KEY
npm run dev
```

## Features

- Real-time vault balances
- Deposit/withdraw via OnchainKit
- Interest calculations (ERC-4626)
- Token prices (CoinGecko)
- Farcaster auth

## Deploy

```bash
npm run build
npm start
```

## License

MIT