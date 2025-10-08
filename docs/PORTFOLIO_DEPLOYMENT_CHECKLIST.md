# Portfolio Feature - Deployment Checklist

## Pre-Deployment Verification

### ✅ Development Testing
- [x] TypeScript compilation: `npm run build` ✅
- [x] Linter: No errors ✅
- [x] Dev server: `npm run dev` ✅
- [ ] Manual wallet connection test
- [ ] Manual vault interaction test
- [ ] Mobile responsive test (Chrome DevTools)

### ✅ Code Quality
- [x] No console errors in components ✅
- [x] All TODOs completed ✅
- [x] Error boundaries in place ✅
- [x] Loading states implemented ✅
- [x] Tooltips on all metrics ✅

### ✅ Performance
- [x] Lazy loading implemented ✅
- [x] Memoization applied ✅
- [x] React Query caching ✅
- [x] First Load JS: 512 kB (acceptable) ✅

---

## Deployment Steps

### 1. Environment Variables
Ensure `.env.local` has:
```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key_here
```

### 2. Build for Production
```bash
npm run build
npm start
```

### 3. Deploy to Vercel (or your platform)
```bash
# If using Vercel CLI
vercel --prod

# Or git push to trigger auto-deployment
git add .
git commit -m "feat: Add Zerion-style Portfolio home"
git push origin new-features
```

### 4. Verify Deployment
- [ ] Visit production URL
- [ ] Connect wallet
- [ ] Check all portfolio metrics load
- [ ] Test vault deposit/withdraw
- [ ] Verify mobile layout
- [ ] Check historical graph

---

## Post-Deployment Monitoring

### Week 1
- [ ] Monitor for JavaScript errors (Sentry/similar)
- [ ] Check CoinGecko API rate limits
- [ ] User feedback collection
- [ ] Performance metrics (Core Web Vitals)

### Metrics to Watch
1. **Error Rate**: Should be <1%
2. **Price Fetch Success**: Should be >95%
3. **Page Load Time**: Target <2s
4. **Bounce Rate**: Track vs. old dashboard

---

## Rollback Plan

If issues arise:

### Quick Rollback (5 minutes)
1. Revert `app/page.tsx` to use old Dashboard:
   ```typescript
   import Dashboard from './components/Dashboard';
   export default function Home() {
     return <Dashboard />;
   }
   ```
2. Redeploy

### Gradual Migration (Alternative)
1. Keep Portfolio at `/portfolio` only
2. Old Dashboard at `/` (default)
3. Add banner to old dashboard: "Try our new Portfolio view"
4. Migrate users gradually based on feedback

---

## User Communication

### Announcement Template

**Subject**: 🎉 New Portfolio Dashboard - Track Your DeFi Positions Like Never Before

**Body**:
We're excited to introduce Muscadine's new Portfolio Dashboard - a Zerion-style interface that makes tracking your DeFi positions easier than ever.

**What's New:**
✨ Beautiful portfolio overview with total value tracking
📊 Historical performance graphs (1D, 7D, 30D, ALL)
💰 Detailed earnings breakdown per vault
📱 Fully responsive mobile design
⚡ Faster load times with improved performance

**How to Access:**
Simply visit app.muscadine.box and connect your wallet. Your familiar vault operations are still one click away!

**Feedback:**
We'd love to hear your thoughts! Join us on [Discord/Telegram] or reach out at [support email].

---

## Known Issues & Workarounds

### Issue 1: CoinGecko Rate Limits
- **Symptom**: Prices show "—" or use fallback values
- **Impact**: Low - cached/fallback prices still shown
- **Workaround**: Users can refresh after 60s
- **Fix**: Upgrade to CoinGecko Pro API (future)

### Issue 2: Historical Data Takes Time
- **Symptom**: Graph shows "No historical data yet"
- **Impact**: Low - only affects new users
- **Workaround**: Data accumulates over time
- **Fix**: Subgraph integration (future enhancement)

### Issue 3: LocalStorage Limits
- **Symptom**: Very old historical data might be lost
- **Impact**: Very Low - only affects heavy users with months of data
- **Workaround**: Data auto-prunes to 30 days
- **Fix**: Move to backend storage (future)

---

## Support Resources

### For Users
- **Help Center**: Link to docs
- **Video Tutorial**: (Create and link)
- **FAQ**: Common questions

### For Developers
- **Documentation**: `/docs/PORTFOLIO_FEATURE.md`
- **Implementation**: `/docs/PORTFOLIO_IMPLEMENTATION_SUMMARY.md`
- **Code**: `/app/components/portfolio/`

---

## Success Criteria

### Week 1 Targets
- [ ] 0 critical bugs reported
- [ ] <5 minor bugs reported
- [ ] >90% price fetch success rate
- [ ] >80% user satisfaction (survey)

### Month 1 Targets
- [ ] Portfolio becomes default for >90% of users
- [ ] Increased user engagement (time on site)
- [ ] Positive feedback on historical graphs
- [ ] No rollback needed

---

## Future Enhancements Priority

Based on user feedback, prioritize:

1. **High Priority**
   - [ ] Subgraph for full historical data
   - [ ] Transaction history/activity feed
   - [ ] Advanced PnL with price change tracking

2. **Medium Priority**
   - [ ] Export portfolio to CSV/PDF
   - [ ] Price alerts
   - [ ] Multi-chain support

3. **Low Priority**
   - [ ] NFT support
   - [ ] Social sharing
   - [ ] Portfolio comparison with others

---

## Sign-Off

Before deploying to production, confirm:

- [ ] All tests passed
- [ ] Code reviewed
- [ ] Documentation complete
- [ ] Environment variables set
- [ ] Rollback plan ready
- [ ] Monitoring in place
- [ ] Team notified

**Deployment Approved By**: ___________________  
**Date**: ___________________  
**Notes**: ___________________

