"use client";
import { http, createConfig, fallback } from "wagmi";
import { base } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [],
  ssr: true,
  transports: {
    [base.id]: fallback([
      // Primary: Alchemy (more reliable)
      http("https://base-mainnet.g.alchemy.com/v2/demo", {
        retryCount: 3,
        retryDelay: 1000,
      }),
      // Fallback: Base public RPC
      http("https://mainnet.base.org", {
        retryCount: 2,
        retryDelay: 2000,
      }),
      // Backup: Ankr RPC
      http("https://rpc.ankr.com/base", {
        retryCount: 2,
        retryDelay: 2000,
      }),
    ]),
  },
});

