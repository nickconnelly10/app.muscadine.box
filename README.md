# Muscadine Box

A DeFi lending platform built as a Farcaster Mini App using Next.js, OnchainKit, and MiniKit. Earn interest on your crypto with Morpho vaults on Base network.

**Live URL**: [app.muscadine.box](https://app.muscadine.box)

## About

Muscadine Box is a Farcaster Mini App that enables users to lend their crypto assets and earn interest through Morpho vaults on the Base network. Built with OnchainKit and MiniKit technologies, it provides a seamless DeFi experience within the Farcaster ecosystem.

### Features

- **Lending**: Earn interest on your crypto with Morpho vaults
- **Wallet Integration**: Connect and manage your crypto wallets
- **Mini App**: Native Farcaster Mini App experience
- **Base Network**: Built for Base blockchain
- **Secure**: Powered by proven DeFi protocols

## Tech Stack

- Next.js 15.3.4
- Base Network (Ethereum L2)
- Morpho Labs
- OnchainKit
- Farcaster MiniKit
- Farcaster Quick Auth
- TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone and install
git clone <repository-url>
cd app.muscadine.box
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
app/
├── .well-known/farcaster.json/  # Farcaster Mini App manifest
├── api/
│   ├── auth/                    # Authentication endpoint
│   └── webhook/                 # Webhook handler
├── components/
│   ├── HomePage.tsx             # Home dashboard
│   └── LendingPage.tsx          # Lending interface
├── layout.tsx                   # Root layout
├── page.tsx                     # Main page
└── rootProvider.tsx             # OnchainKit provider
```

## Configuration

The app includes a Farcaster manifest at `/.well-known/farcaster.json` with complete frame metadata, required capabilities, and Base Builder integration.

### Environment Variables

```bash
NEXT_PUBLIC_URL=https://your-domain.com
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
```

## Deployment

```bash
npm run build
npm start
```

Ready for deployment on Vercel, Netlify, or any Next.js-compatible platform.

## API Endpoints

- `GET /.well-known/farcaster.json` - Farcaster manifest
- `GET /api/auth` - Authentication verification
- `POST /api/webhook` - Webhook event handler

## Learn More

- [OnchainKit Documentation](https://docs.base.org/onchainkit)
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz)
- [Base Network](https://base.org)
- [Morpho Labs](https://morpho.org)
- [Next.js Documentation](https://nextjs.org/docs)

## License

This project is licensed under the MIT License.
