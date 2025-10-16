// config.ts
import { createConfig, http, createStorage, cookieStorage } from 'wagmi'
import { mainnet, sepolia, base } from 'wagmi/chains'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
if (!projectId) throw new Error('REOWN_PROJECT_ID is not set')

// App metadata
const metadata = {
  name: 'Muscadine',
  description: 'Muscadine App',
  url: 'https://yourapp.com',
  icons: ['/favicon.png'],
}

// Create adapter
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [mainnet, sepolia, base],
})

// AppKit instance
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, sepolia, base],
  metadata,
})

// Export adapter’s Wagmi config for Providers
export const config = wagmiAdapter.wagmiConfig
