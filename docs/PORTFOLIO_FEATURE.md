# Portfolio Feature - Zerion-style Dashboard

## Overview

The new Portfolio feature provides a clean, trust-building Zerion-style dashboard for Muscadine users. It's now the default home page after wallet connection, offering comprehensive portfolio tracking, historical performance graphs, and easy access to vault operations.

## Features Implemented

### ✅ Core Components

1. **Portfolio Metrics**
   - Total Portfolio Value (wallet + vaults)
   - Net Deposits (deposits - withdrawals)
   - Earned Interest (estimated)
   - Vault PnL ($ and %)
   - All metrics include tooltips with explanations

2. **Historical Graph**
   - Time range selector (1D, 7D, 30D, ALL)
   - Interactive SVG graph with hover tooltips
   - Local storage persistence for historical data
   - Automatic snapshots (max 1 per hour)
   - Shows delta value and percentage

3. **Tokens List**
   - Shows all wallet balances on Base
   - Columns: Token, Balance, USD Value
   - Stablecoins (USDC) grouped at top
   - Toggle to show/hide zero balances
   - Hover states for better UX

4. **DeFi Positions (Vaults)**
   - All three Muscadine vaults (USDC, cbBTC, WETH)
   - Shows: Current Value, Deposited, Earned Interest, APY
   - Integrated OnchainKit Earn component for deposits/withdrawals
   - Real-time vault balance updates

5. **Lend/Borrow CTA**
   - Links to Muscadine vaults (internal)
   - Links to Morpho borrowing (external)
   - Pro tip section for advanced strategies

### ✅ Infrastructure

1. **Unified Pricing Service** (`app/services/pricingService.ts`)
   - Single source of truth for token prices
   - 60-second caching
   - Fallback to cached prices if API fails
   - Conservative fallback prices
   - CoinGecko integration (free, no API key)

2. **Portfolio Context** (`app/contexts/PortfolioContext.tsx`)
   - Shared wallet, chain, and pricing data
   - Centralized balance fetching
   - Memoized calculations
   - Used across all portfolio components

3. **Custom Hooks**
   - `usePricing` - Token price fetching with caching
   - Reuses existing `useVaultHistory` for historical data

### ✅ UX/UI Features

1. **Responsive Design**
   - Desktop: Two-column layout (left sticky, right scrollable)
   - Mobile: Stacked layout (Total → Graph → Tokens → Positions → CTA)
   - Breakpoint: 1024px

2. **Loading States**
   - Skeleton loaders for all cards
   - Pulse animation
   - Lazy loading for lower-priority components (Suspense)

3. **Error Handling**
   - Error banner for pricing failures
   - Chain mismatch warning (not on Base)
   - Graceful fallbacks (shows "—" when data unavailable)
   - Non-blocking error states

4. **Empty States**
   - Not connected: Shows connect wallet CTA with feature highlights
   - No tokens: Helpful message to deposit into vaults
   - No historical data: Explains data collection

5. **Tooltips**
   - "?" icons on metrics
   - Title attributes for hover explanations
   - Plain English descriptions for DeFi terms

### ✅ Performance

1. **Code Splitting**
   - Lazy loading of TokensList, DeFiPositions, LendBorrowCTA
   - Suspense boundaries with loading fallbacks

2. **Memoization**
   - Portfolio calculations memoized
   - Format functions use useCallback
   - Dependency arrays optimized

3. **Caching**
   - React Query for price data (60s stale time)
   - LocalStorage for historical portfolio snapshots
   - Session-scoped price cache

### ✅ Backward Compatibility

- Old Dashboard accessible at `/dashboard` route
- New Portfolio is default home (`/`)
- Also available at `/portfolio` route
- No breaking changes to existing features

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Portfolio | New default - Zerion-style portfolio home |
| `/portfolio` | Portfolio | Same as home |
| `/dashboard` | Dashboard | Original dashboard (backward compatibility) |
| `/lending` | Lending | Existing lending page |

## Technical Details

### Data Flow

```
User connects wallet
  ↓
PortfolioContext fetches:
  - Wallet balances (USDC, cbBTC, WETH, ETH)
  - Vault positions (3 vaults)
  - Token prices (CoinGecko)
  ↓
Components consume context:
  - PortfolioMetrics (calculates totals, PnL)
  - HistoricalGraph (loads/saves snapshots)
  - TokensList (displays wallet balances)
  - DeFiPositions (displays vault positions)
  - LendBorrowCTA (static CTAs)
```

### Pricing Logic

1. Fetch from CoinGecko API
2. If fresh price available → cache and return
3. If API fails → return cached price (with "cached" source)
4. If no cache → return fallback price (with "fallback" source)
5. Refresh every 60 seconds

### Historical Data

- Stored in localStorage per wallet address
- Key: `portfolio_history_${address}`
- Max 30 days of data
- Max 1 snapshot per hour (or on significant value change >1%)
- Prepared for future subgraph/API integration (interface abstraction)

### Portfolio Calculations

```typescript
Total Value = Σ(wallet balances) + Σ(vault balances)
Net Deposits = Σ(deposits - withdrawals) across all vaults
Earned Interest = Current Vault Value - Net Deposits
PnL = Earned Interest (same for now, will include price changes later)
```

## QA Checklist

### ✅ Completed

- [x] TypeScript compilation
- [x] Next.js build
- [x] No linter errors
- [x] Responsive layout (desktop/mobile)
- [x] Component lazy loading
- [x] Error boundaries
- [x] Loading states

### 🔄 Manual Testing Required

- [ ] Connect wallet flow
- [ ] Disconnect and reconnect
- [ ] Switch wallet accounts mid-session
- [ ] Chain switching (Base ↔ other chains)
- [ ] Deposit into vault → portfolio updates
- [ ] Withdraw from vault → portfolio updates
- [ ] Mobile layout (phone/tablet)
- [ ] Historical graph time ranges
- [ ] Price fallback when API fails
- [ ] LocalStorage persistence
- [ ] Tooltip interactions

## Known Limitations (MVP)

1. **Historical Data**: Currently uses localStorage snapshots
   - Future: Migrate to subgraph/API for full on-chain history
   - Future: Show historical APY changes

2. **PnL Calculation**: Basic calculation (current value - net deposits)
   - Future: Account for token price changes
   - Future: Show realized vs unrealized gains

3. **24h Change**: Not yet implemented for tokens
   - Future: Add 24h price change column to tokens list

4. **Vault Borrow**: External link to Morpho (no embedded UI)
   - Future: Consider iframe or modal integration

## Files Created

```
app/
├── services/
│   └── pricingService.ts          # Unified pricing service
├── hooks/
│   └── usePricing.ts              # Pricing hook
├── contexts/
│   └── PortfolioContext.tsx       # Portfolio data provider
├── components/portfolio/
│   ├── Portfolio.tsx              # Main portfolio page
│   ├── PortfolioMetrics.tsx       # Total value, PnL, etc.
│   ├── HistoricalGraph.tsx        # Time-range graph
│   ├── TokensList.tsx             # Wallet balances table
│   ├── DeFiPositions.tsx          # Vaults table
│   ├── LendBorrowCTA.tsx          # CTA section
│   └── ErrorBanner.tsx            # Error display component
├── portfolio/
│   └── page.tsx                   # /portfolio route
├── dashboard/
│   └── page.tsx                   # /dashboard route (legacy)
└── page.tsx                       # Home (uses Portfolio)
```

## Future Enhancements

1. **Historical Data**: Subgraph integration for full on-chain history
2. **Transaction List**: Show recent deposits/withdrawals
3. **Notifications**: Transaction confirmations, APY changes
4. **Export**: CSV/PDF portfolio reports
5. **Multi-chain**: Support for other chains beyond Base
6. **NFTs**: Display NFT holdings
7. **Onboarding Tutorial**: Interactive walkthrough (Intro.js/Shepherd.js)
8. **Advanced Filters**: Filter tokens by value, hide dust, etc.
9. **Price Alerts**: Set alerts for specific prices
10. **Social Features**: Share portfolio performance

## Migration Guide

For users coming from the old Dashboard:

1. **Default Route Changed**: `/` now shows Portfolio instead of Dashboard
2. **Old Dashboard**: Still accessible at `/dashboard`
3. **Feature Parity**: All vault operations work the same way
4. **New Features**: Historical graphs, detailed metrics, token list
5. **No Breaking Changes**: All existing functionality preserved

## Support

- Issues: Report to GitHub repository
- Docs: See `/docs` folder
- Questions: Discord/Telegram community

