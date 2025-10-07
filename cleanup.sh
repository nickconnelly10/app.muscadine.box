#!/bin/bash

# Cleanup Script - Remove Unused Code
# Created: 2025-10-07

echo "🧹 Starting cleanup of unused code..."
echo ""

# Create a log of what's being deleted
LOG_FILE="cleanup_log.txt"
echo "Cleanup Log - $(date)" > $LOG_FILE
echo "==========================================\n" >> $LOG_FILE

# Function to delete and log
delete_file() {
    if [ -f "$1" ]; then
        echo "Deleting: $1" | tee -a $LOG_FILE
        rm "$1"
    else
        echo "Not found (skipped): $1" | tee -a $LOG_FILE
    fi
}

echo "📁 Removing deprecated routes/pages..."
delete_file "app/lending/page.tsx"
delete_file "app/simple/route.ts"
delete_file "app/test/route.ts"

echo ""
echo "🎨 Removing unused CSS files..."
delete_file "app/page.module.css"
delete_file "app/styles/design-system.css"

echo ""
echo "🧩 Removing unused components..."
delete_file "app/components/LendingPage.tsx"
delete_file "app/components/ModernDashboard.tsx"
delete_file "app/components/ETHDepositComponent.tsx"
delete_file "app/components/SharedLayout.tsx"
delete_file "app/components/LoadingStates.tsx"
delete_file "app/components/atoms/index.tsx"
delete_file "app/components/molecules/index.tsx"

echo ""
echo "🪝 Removing unused hooks..."
delete_file "app/hooks/useWallet.ts"
delete_file "app/hooks/useVaultData.ts"

echo ""
echo "🔧 Removing unused services..."
delete_file "app/services/dexService.ts"

echo ""
echo "📚 Removing unused lib files..."
delete_file "app/lib/middleware.ts"
delete_file "app/lib/erc4626.ts"

echo ""
echo "♻️  Removing deprecated provider file..."
delete_file "app/providers.tsx"

echo ""
echo "🗑️  Removing empty directories..."
if [ -d "app/lending" ] && [ -z "$(ls -A app/lending)" ]; then
    echo "Removing empty directory: app/lending" | tee -a $LOG_FILE
    rmdir "app/lending"
fi

if [ -d "app/simple" ] && [ -z "$(ls -A app/simple)" ]; then
    echo "Removing empty directory: app/simple" | tee -a $LOG_FILE
    rmdir "app/simple"
fi

if [ -d "app/test" ] && [ -z "$(ls -A app/test)" ]; then
    echo "Removing empty directory: app/test" | tee -a $LOG_FILE
    rmdir "app/test"
fi

if [ -d "app/components/atoms" ] && [ -z "$(ls -A app/components/atoms)" ]; then
    echo "Removing empty directory: app/components/atoms" | tee -a $LOG_FILE
    rmdir "app/components/atoms"
fi

if [ -d "app/components/molecules" ] && [ -z "$(ls -A app/components/molecules)" ]; then
    echo "Removing empty directory: app/components/molecules" | tee -a $LOG_FILE
    rmdir "app/components/molecules"
fi

if [ -d "app/services" ] && [ -z "$(ls -A app/services)" ]; then
    echo "Removing empty directory: app/services" | tee -a $LOG_FILE
    rmdir "app/services"
fi

if [ -d "app/styles" ] && [ -z "$(ls -A app/styles)" ]; then
    echo "Removing empty directory: app/styles" | tee -a $LOG_FILE
    rmdir "app/styles"
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  - Log saved to: $LOG_FILE"
echo ""
echo "📦 Kept for reference:"
echo "  ✓ app/components/APYDisplay.tsx (reference implementation)"
echo "  ✓ app/components/VaultDepositFlow.tsx (reference implementation)"
echo "  ✓ app/hooks/usePermit.ts (future feature)"
echo "  ✓ app/hooks/useERC4626.ts (future feature)"
echo "  ✓ app/vaults/[symbol]/*.example (documentation)"
echo ""
echo "🔨 Next steps:"
echo "  1. Review cleanup_log.txt"
echo "  2. Run: npm run build"
echo "  3. Test the app locally"
echo "  4. Commit changes: git add . && git commit -m 'chore: Remove unused code'"
echo ""
