'use client';

import { useAccount } from 'wagmi';
import Dashboard from '@/components/Dashboard';
import ConnectScreen from '@/components/ConnectScreen';
import { useState, useEffect } from 'react';

export default function Home() {
  const { isConnected, status } = useAccount();
  const [hydrated, setHydrated] = useState(false);

  // Wait until client hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // While SSR or reconnecting
  if (!hydrated || status === 'reconnecting' || status === 'connecting') {
    return <div>Loading...</div>;
  }

  // Client knows the true connection state
  return <>{isConnected ? <Dashboard /> : <ConnectScreen />}</>;
}
