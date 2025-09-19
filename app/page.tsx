"use client";
import { useAccount, useBalance } from 'wagmi';
import Image from 'next/image';
import { Wallet } from "@coinbase/onchainkit/wallet";
import { FloatingWallet } from "./components/FloatingWallet";
import { formatEther } from 'viem';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading: balanceLoading, error: balanceError } = useBalance({
    address: address,
  });

  // Simple portfolio data structure
  const portfolioData = {
    totalUsd: balance ? parseFloat(formatEther(balance.value)) * 3000 : 0, // Approximate ETH price
    tokens: balance ? [{
      address: '0x0000000000000000000000000000000000000000' as `0x${string}`,
      symbol: 'ETH',
      name: 'Ethereum',
      image: undefined,
      decimals: 18,
      chainId: 8453,
      cryptoBalance: formatEther(balance.value),
      fiatBalance: parseFloat(formatEther(balance.value)) * 3000,
    }] : []
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Portfolio Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Wallet />
              <FloatingWallet />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Connect Your Wallet</h2>
              <p className="text-gray-600 mb-6">Connect your wallet to view your portfolio and token balances.</p>
              <Wallet />
            </div>
          </div>
        ) : balanceLoading ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading portfolio...</p>
            </div>
          </div>
        ) : balanceError ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-semibold text-red-600 mb-4">Error Loading Portfolio</h2>
              <p className="text-gray-600 mb-4">Failed to load wallet balance</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : portfolioData ? (
          <div className="space-y-8">
            {/* Portfolio Summary */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Portfolio Value</h2>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ${portfolioData.totalUsd.toLocaleString()}
              </div>
              <p className="text-gray-600">{portfolioData.tokens.length} assets</p>
            </div>

            {/* Token Holdings */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Assets</h2>
              {portfolioData.tokens.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolioData.tokens.map(t => (
                    <div key={t.address} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        {t.image ? (
                          <Image src={t.image} alt={t.symbol} width={32} height={32} className="h-8 w-8 rounded-full" />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">{t.symbol.charAt(0)}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{t.name}</div>
                          <div className="text-sm text-gray-500">{t.symbol}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">${(t.fiatBalance ?? 0).toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{Number(t.cryptoBalance).toLocaleString()} {t.symbol}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tokens found in your portfolio.</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
