This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-onchain`](https://www.npmjs.com/package/create-onchain).


## Getting Started

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# OnchainKit Configuration
# Get these from https://portal.cdp.coinbase.com/products/onchainkit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
NEXT_PUBLIC_ONCHAINKIT_PROJECT_ID=your_project_id_here

# Server-side API key (for server actions)
ONCHAINKIT_API_KEY=your_api_key_here
```

**Important:** Both `apiKey` and `projectId` are required for portfolio functionality to work properly.

### Install Dependencies

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## Learn More

To learn more about OnchainKit, see our [documentation](https://docs.base.org/onchainkit).

To learn more about Next.js, see the [Next.js documentation](https://nextjs.org/docs).
