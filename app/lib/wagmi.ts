"use client";
import { http, createConfig } from "wagmi";
import { base } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [],
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});

