# Portfolio - Quick Start Guide

## What is the Portfolio?

The Portfolio is Muscadine's new Zerion-style dashboard that gives you a complete view of your DeFi positions on Base. It's now the default home page when you visit app.muscadine.box.

---

## Getting Started

### 1. Visit the App
Navigate to `http://localhost:3000` (dev) or `https://app.muscadine.box` (prod)

### 2. Connect Your Wallet
Click "Connect Wallet" in the top right corner. The Portfolio automatically loads your:
- Wallet token balances (USDC, cbBTC, WETH, ETH)
- Vault positions (Muscadine vaults)
- Total portfolio value
- Earned interest

### 3. Explore Your Dashboard

**Desktop Layout:**
```
┌─────────────────────┬─────────────────────┐
│ Left Column         │ Right Column        │
│ (Sticky)            │ (Scrollable)        │
├─────────────────────┼─────────────────────┤
│ Portfolio Metrics   │ Tokens List         │
│ - Total Value       │ - USDC              │
│ - Net Deposits      │ - cbBTC             │
│ - Earned Interest   │ - WETH              │
│ - Vault PnL         │ - ETH               │
│                     │                     │
│ Historical Graph    │ DeFi Positions      │
│ [1D|7D|30D|ALL]     │ - USDC Vault        │
│                     │ - cbBTC Vault       │
│                     │ - WETH Vault        │
│                     │                     │
│                     │ Lend/Borrow CTA     │
└─────────────────────┴─────────────────────┘
```

**Mobile Layout:**
```
┌─────────────────────┐
│ Portfolio Metrics   │
├─────────────────────┤
│ Historical Graph    │
├─────────────────────┤
│ Tokens List         │
├─────────────────────┤
│ DeFi Positions      │
├─────────────────────┤
│ Lend/Borrow CTA     │
└─────────────────────┘
```

---

## Key Features

### 📊 Portfolio Metrics
**What you see:**
- **Total Value**: All your assets (wallet + vaults) in USD
- **Net Deposits**: Total deposited - withdrawn across vaults
- **Earned Interest**: Estimated interest earned (current value - deposits)
- **Vault PnL**: Profit/Loss from vault positions

**How to use:**
- Hover over "?" icons for detailed explanations
- Values update automatically every 60 seconds

### 📈 Historical Graph
**What you see:**
- Interactive graph of your portfolio value over time
- Time ranges: 1D, 7D, 30D, ALL
- Delta (change) in $ and %

**How to use:**
- Click time range buttons to change view
- Hover over graph points to see exact values and dates
- Data is saved locally and accumulates over time

### 💵 Tokens List
**What you see:**
- All tokens in your wallet on Base
- Columns: Token name, Balance, USD Value
- Stablecoins (USDC) appear first

**How to use:**
- Toggle "Show zero balances" to see all tokens
- Click on a row (future: opens token details)

### 🏦 DeFi Positions
**What you see:**
- All your Muscadine vault positions
- For each vault: Current Value, Deposited, Earned Interest, APY
- OnchainKit Earn component for deposits/withdrawals

**How to use:**
- View your vault performance at a glance
- Click "Deposit" or "Withdraw" on any vault
- APY is pulled directly from Morpho (real-time)

### 💰 Lend/Borrow CTA
**What you see:**
- Quick access to Muscadine vaults (internal)
- Link to Morpho borrowing (external)
- Pro tip for advanced strategies

**How to use:**
- Click "Lend in Muscadine Vaults" to see all vaults
- Click "Borrow on Morpho" to explore borrowing options

---

## Common Actions

### Deposit into a Vault
1. Scroll to "DeFi Positions"
2. Find the vault you want (USDC, cbBTC, or WETH)
3. Click the "Deposit" button in the Earn component
4. Follow OnchainKit's deposit flow
5. Portfolio updates automatically within 5 seconds

### Withdraw from a Vault
1. Scroll to "DeFi Positions"
2. Find the vault
3. Click "Withdraw"
4. Enter amount and confirm
5. Portfolio updates automatically

### View Historical Performance
1. Look at the Historical Graph (left column on desktop)
2. Click different time ranges (1D, 7D, 30D, ALL)
3. Hover over the graph to see exact values
4. Note: Data accumulates over time as you use the app

### Check Earned Interest
1. Look at Portfolio Metrics for total earned interest
2. Or scroll to DeFi Positions to see per-vault interest
3. Hover over the "ⓘ" icon for calculation details

---

## Understanding the Metrics

### Total Value
**What it means:** The sum of all your assets on Base (wallet + vaults)  
**Formula:** Σ(wallet token values) + Σ(vault position values)  
**Updates:** Every 60 seconds (prices) and on-chain events

### Net Deposits
**What it means:** How much you've put into vaults (deposits - withdrawals)  
**Formula:** Σ(deposits) - Σ(withdrawals) across all vaults  
**Source:** On-chain event logs (Deposit/Withdraw events)

### Earned Interest
**What it means:** Estimated interest earned from vaults  
**Formula:** Current vault value - Net deposits  
**Note:** Labeled "Estimated" because it includes price changes

### Vault PnL
**What it means:** Profit/Loss from your vault positions  
**Formula:** Same as Earned Interest (for now)  
**Future:** Will separate price changes from interest

---

## Troubleshooting

### "No historical data yet"
**Why:** You just started using the app, or cleared browser data  
**Fix:** Keep using the app; data accumulates over time (1 snapshot per hour)

### Prices show "—"
**Why:** CoinGecko API temporarily unavailable  
**Fix:** Wait 60 seconds for automatic retry, or refresh page  
**Note:** Cached/fallback prices are used when API fails

### "Please switch to Base network"
**Why:** Your wallet is connected to a different chain  
**Fix:** Switch to Base network in your wallet

### Portfolio value seems wrong
**Why:** Prices may be cached or using fallback values  
**Fix:** Check the error banner at top - it will say if prices are cached  
**Note:** All numbers use the same price source for consistency

### Deposit/Withdraw not working
**Why:** Could be insufficient balance, gas, or approval  
**Fix:** Check OnchainKit error messages in the Earn component

---

## Tips & Best Practices

### 💡 Pro Tips
1. **Check regularly**: Historical data builds over time
2. **Use time ranges**: Switch between 1D/7D/30D to spot trends
3. **Compare vaults**: See which vault earns most for you
4. **Set expectations**: "Earned Interest" is estimated, not exact
5. **Mobile friendly**: Full experience works on phone

### 🔒 Security
- Always verify the vault addresses match the README
- Double-check amounts before depositing
- Use hardware wallet for large amounts
- Keep your seed phrase safe

### ⚡ Performance
- First load takes ~2 seconds (normal)
- Prices update every 60 seconds
- Historical snapshots: max 1 per hour
- LocalStorage used for graph data (max 30 days)

---

## Keyboard Shortcuts

*Coming soon*

---

## FAQ

**Q: Why is my earned interest lower than expected?**  
A: Earned interest includes the impact of token price changes. If the underlying token price dropped, your interest might be offset.

**Q: Can I export my portfolio data?**  
A: Not yet, but it's on the roadmap! For now, you can screenshot or manually track.

**Q: How accurate are the APY numbers?**  
A: Very accurate - they come directly from Morpho in real-time. However, APYs can change based on market conditions.

**Q: What happens if I switch wallet accounts?**  
A: The entire portfolio updates to show the new account's data.

**Q: Is my data stored on a server?**  
A: No. Historical graph data is stored locally in your browser (localStorage). Your wallet data is always fetched fresh from the blockchain.

**Q: Why don't I see all my tokens?**  
A: The app currently tracks USDC, cbBTC, WETH, and ETH on Base. More tokens coming soon!

---

## Need Help?

- **Documentation**: Check `/docs/PORTFOLIO_FEATURE.md`
- **Bug Reports**: GitHub Issues
- **Questions**: Discord/Telegram community
- **Feedback**: We'd love to hear from you!

---

## What's Next?

We're constantly improving the Portfolio. Upcoming features:
- Full transaction history
- CSV/PDF export
- Price alerts
- Multi-chain support
- NFT display

Stay tuned! 🚀

