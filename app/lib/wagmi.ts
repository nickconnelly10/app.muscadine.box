"use client";
import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";
import { 
  coinbaseWallet, 
  metaMask, 
  walletConnect,
  injected
} from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    coinbaseWallet({
      appName: "Muscadine DeFi",
      preference: "smartWalletOnly",
    }),
    metaMask({
      dappMetadata: {
        name: "Muscadine DeFi",
        url: "https://app.muscadine.box",
      },
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "your-project-id",
      metadata: {
        name: "Muscadine DeFi",
        description: "DeFi lending platform on Base",
        url: "https://app.muscadine.box",
        icons: ["https://app.muscadine.box/icon.png"],
      },
    }),
    injected({
      target: "phantom",
    }),
    injected({
      target: "rabby",
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});

