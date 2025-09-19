"use client";

import {
  Wallet,
  WalletDropdown,
  WalletAdvancedAddressDetails,
  WalletAdvancedTokenHoldings,
  ConnectWallet
} from '@coinbase/onchainkit/wallet';

export function FloatingWallet() {
  return (
    <div className="flex justify-end">
      <Wallet draggable>
        <ConnectWallet />
        <WalletDropdown>
          <WalletAdvancedAddressDetails />      {/* shows fiat portfolio balance */}
          <WalletAdvancedTokenHoldings />      {/* shows tokens + fiat values */}
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
