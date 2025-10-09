# Unused Files Cleanup Report

## Files Not In Use

After migrating to OnchainKit components, the following files are no longer being used:

### 1. ❌ `app/services/dexService.ts` (255 lines)
**Status:** Not imported anywhere  
**Purpose:** 1inch DEX integration for token swapping  
**Reason for removal:** Swap functionality not currently used in the application

### 2. ❌ `app/hooks/useVaultData.ts` (322 lines)
**Status:** Only used in test file  
**Purpose:** Custom hooks for vault balances and data fetching  
**Reason for removal:** Replaced by OnchainKit's `useMorphoVault` hook

### 3. ❌ `app/hooks/__tests__/useVaultData.test.tsx`
**Status:** Test file for unused hook  
**Purpose:** Tests for useVaultData hook  
**Reason for removal:** No longer needed since useVaultData is not used

## Currently Used Files

These files are still being actively used:

✅ **`app/hooks/useMorphoRewards.ts`** - Used in Dashboard and Portfolio components  
✅ **`app/hooks/usePricing.ts`** - Used in PortfolioContext  
✅ **`app/hooks/useTokenPrices.ts`** - Used in Portfolio and Dashboard  
✅ **`app/hooks/useVaultHistory.ts`** - Used in PortfolioMetrics and Dashboard  
✅ **`app/services/pricingService.ts`** - Used in usePricing and PortfolioContext

## What Replaced These Files

The vault detail pages now use OnchainKit's comprehensive vault integration:

- **Instead of `useVaultData.ts`:**
  - ✅ `useMorphoVault()` from OnchainKit/earn
  - ✅ `<EarnDetails>` component
  - ✅ `<VaultDetails>` component
  - ✅ Built-in balance and APY calculations

- **Instead of `dexService.ts`:**
  - No swap functionality currently implemented
  - Can use OnchainKit's `<Swap>` component when needed

## Recommendation

**Safe to delete:**
1. `app/services/dexService.ts`
2. `app/hooks/useVaultData.ts`
3. `app/hooks/__tests__/useVaultData.test.tsx`

**Impact:** Zero - These files are not imported or used anywhere in the application

**Tests:** Will drop from 32 to 30 tests (removing 2 useVaultData tests)

**Bundle Size Savings:** ~577 lines of unused code removed

## Cleanup Commands

```bash
# Remove unused files
rm app/services/dexService.ts
rm app/hooks/useVaultData.ts
rm app/hooks/__tests__/useVaultData.test.tsx
```

After removal, run tests to verify:
```bash
npm test
npm run build
```

Expected result: 30/30 tests passing (down from 32/32)

