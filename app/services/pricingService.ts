"use client";

// Token addresses on Base
export const TOKEN_ADDRESSES = {
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const,
  cbBTC: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf' as const,
  WETH: '0x4200000000000000000000000000000000000006' as const,
} as const;

export interface TokenPrice {
  symbol: string;
  price: number;
  lastUpdated: number;
  source: 'coingecko' | 'cached' | 'fallback';
}

export interface PricingCache {
  [symbol: string]: TokenPrice;
}

// In-memory cache for prices (session-scoped)
let priceCache: PricingCache = {};

// Fallback prices (conservative estimates)
const FALLBACK_PRICES: Record<string, number> = {
  USDC: 1.0,
  cbBTC: 65000,
  WETH: 3500,
};

// Cache duration: 60 seconds
const CACHE_DURATION = 60 * 1000;

/**
 * Fetches token prices from CoinGecko API
 */
async function fetchPricesFromAPI(): Promise<Partial<Record<string, number>>> {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
      { 
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(5000) // 5s timeout
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      USDC: 1.0, // USDC is pegged
      cbBTC: data.bitcoin?.usd,
      WETH: data.ethereum?.usd,
    };
  } catch (error) {
    console.error('[PricingService] Error fetching prices from CoinGecko:', error);
    return {};
  }
}

/**
 * Gets the price for a specific token
 * @param symbol Token symbol (USDC, cbBTC, WETH)
 * @returns TokenPrice object with price and metadata
 */
export async function getTokenPrice(symbol: string): Promise<TokenPrice> {
  const now = Date.now();
  
  // Check cache first
  const cached = priceCache[symbol];
  if (cached && (now - cached.lastUpdated) < CACHE_DURATION) {
    return cached;
  }

  // Try to fetch fresh price
  const freshPrices = await fetchPricesFromAPI();
  const freshPrice = freshPrices[symbol];

  if (freshPrice && freshPrice > 0) {
    const tokenPrice: TokenPrice = {
      symbol,
      price: freshPrice,
      lastUpdated: now,
      source: 'coingecko',
    };
    priceCache[symbol] = tokenPrice;
    return tokenPrice;
  }

  // Use cached price even if stale
  if (cached) {
    return { ...cached, source: 'cached' as const };
  }

  // Fallback to conservative estimate
  const fallbackPrice: TokenPrice = {
    symbol,
    price: FALLBACK_PRICES[symbol] || 0,
    lastUpdated: now,
    source: 'fallback',
  };
  
  return fallbackPrice;
}

/**
 * Gets prices for all tokens
 * @returns Object with all token prices
 */
export async function getAllTokenPrices(): Promise<{
  USDC: TokenPrice;
  cbBTC: TokenPrice;
  WETH: TokenPrice;
}> {
  const now = Date.now();

  // Try to fetch all fresh prices
  const freshPrices = await fetchPricesFromAPI();

  // Build result with fresh, cached, or fallback prices
  const result = {
    USDC: buildTokenPrice('USDC', freshPrices.USDC, now),
    cbBTC: buildTokenPrice('cbBTC', freshPrices.cbBTC, now),
    WETH: buildTokenPrice('WETH', freshPrices.WETH, now),
  };

  // Update cache
  priceCache = { ...priceCache, ...result };

  return result;
}

function buildTokenPrice(symbol: string, freshPrice: number | undefined, now: number): TokenPrice {
  // Use fresh price if available
  if (freshPrice && freshPrice > 0) {
    return {
      symbol,
      price: freshPrice,
      lastUpdated: now,
      source: 'coingecko',
    };
  }

  // Use cached price if available
  const cached = priceCache[symbol];
  if (cached) {
    return { ...cached, source: 'cached' as const };
  }

  // Fallback
  return {
    symbol,
    price: FALLBACK_PRICES[symbol] || 0,
    lastUpdated: now,
    source: 'fallback',
  };
}

/**
 * Converts token amount to USD value
 */
export function toUSD(amount: number, tokenPrice: TokenPrice): number {
  return amount * tokenPrice.price;
}

/**
 * Clears the price cache (useful for testing)
 */
export function clearPriceCache(): void {
  priceCache = {};
}

