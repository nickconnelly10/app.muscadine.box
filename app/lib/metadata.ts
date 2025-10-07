import { Metadata } from 'next';

interface VaultMetadata {
  title: string;
  description: string;
  symbol: string;
}

const vaultMetadata: Record<string, VaultMetadata> = {
  usdc: {
    title: 'USDC Vault - Earn Interest on USD Coin',
    description: 'Deposit USDC into our Morpho v1 vault and earn competitive interest rates on Base network.',
    symbol: 'USDC'
  },
  cbbtc: {
    title: 'cbBTC Vault - Earn Interest on Coinbase Wrapped BTC',
    description: 'Deposit cbBTC into our Morpho v1 vault and earn interest on your Bitcoin holdings.',
    symbol: 'cbBTC'
  },
  eth: {
    title: 'ETH Vault - Earn Interest on Ethereum',
    description: 'Deposit ETH into our Morpho v1 vault and earn interest. ETH is automatically wrapped to WETH.',
    symbol: 'ETH'
  }
};

export function generateVaultMetadata(vaultKey: string): Metadata {
  const vault = vaultMetadata[vaultKey];
  
  if (!vault) {
    return {
      title: 'Vault Not Found',
      description: 'The requested vault could not be found.',
    };
  }

  return {
    title: `${vault.title} | Muscadine`,
    description: vault.description,
    keywords: [
      'DeFi',
      'yield farming',
      'lending',
      'Morpho',
      'Base network',
      vault.symbol,
      'cryptocurrency',
      'interest',
      'vault'
    ],
    openGraph: {
      title: vault.title,
      description: vault.description,
      type: 'website',
      siteName: 'Muscadine',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${vault.symbol} Vault on Muscadine`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: vault.title,
      description: vault.description,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateHomeMetadata(): Metadata {
  return {
    title: 'Muscadine - DeFi Vaults on Base Network',
    description: 'Earn competitive interest rates on your crypto assets with Muscadine\'s Morpho v1 vaults. Deposit USDC, cbBTC, and ETH on Base network.',
    keywords: [
      'DeFi',
      'yield farming',
      'lending',
      'Morpho',
      'Base network',
      'USDC',
      'cbBTC',
      'ETH',
      'cryptocurrency',
      'interest',
      'vaults'
    ],
    openGraph: {
      title: 'Muscadine - DeFi Vaults on Base Network',
      description: 'Earn competitive interest rates on your crypto assets with Muscadine\'s Morpho v1 vaults.',
      type: 'website',
      siteName: 'Muscadine',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Muscadine DeFi Platform',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Muscadine - DeFi Vaults on Base Network',
      description: 'Earn competitive interest rates on your crypto assets with Muscadine\'s Morpho v1 vaults.',
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
