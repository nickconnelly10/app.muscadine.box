'use client';

import { wagmiAdapter } from '@/lib/appkit'; // Import the configured adapter
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';

const queryClient = new QueryClient();

export function Providers({ children, cookies }: { children: ReactNode; cookies: string | null }) {
    // This correctly uses the cookies passed down from the Server Component (RootLayout)
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);
  
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}