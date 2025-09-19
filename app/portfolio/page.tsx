'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import type { UiPortfolio } from './_lib/getPortfolio';
import { fetchPortfolio } from './_lib/getPortfolio';

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const [data, setData] = useState<UiPortfolio | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!address) return;
      setLoading(true);
      try {
        const res = await fetchPortfolio(address as `0x${string}`);
        if (!ignore) setData(res);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [address]);

  if (!isConnected) return <div>Connect your wallet to view your portfolio.</div>;
  if (loading || !data) return <div>Loading portfolio…</div>;

  return (
    <div className="space-y-6">
      <div className="text-2xl font-semibold">Total Value</div>
      <div className="text-4xl font-bold">${data.totalUsd.toLocaleString()}</div>

      <div className="text-xl font-semibold">Assets</div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.tokens.map(t => (
          <div key={t.address} className="rounded-2xl border p-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {t.image ? <img src={t.image} alt={t.symbol} className="h-8 w-8 rounded-full" /> : <div className="h-8 w-8 rounded-full bg-gray-600" />}
            <div className="flex-1">
              <div className="font-medium">{t.name} ({t.symbol})</div>
              <div className="text-sm opacity-70">{Number(t.cryptoBalance).toLocaleString()} {t.symbol}</div>
            </div>
            <div className="font-semibold">${(t.fiatBalance ?? 0).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
