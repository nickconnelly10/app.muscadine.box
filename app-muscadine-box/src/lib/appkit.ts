import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum, base } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';

// Get projectId from your .env.local file
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined in your environment variables');
}

// Set up metadata
const metadata = {
  name: 'muscadine',
  description: 'Muscadine app',
  url: 'https://app.muscadine.box',
  icons: ['/favicon.png']
};

// Create the Wagmi Adapter with SSR configuration
export const wagmiAdapter = new WagmiAdapter({
  // THIS IS CRUCIAL for SSR hydration
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true, 
  // ---
  projectId,
  networks: [mainnet, arbitrum, base]
});

// Create and export the AppKit modal instance
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, base],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true
  }
});