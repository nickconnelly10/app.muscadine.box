"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useReadContract } from "wagmi";
import { base } from "wagmi/chains";
import { formatUnits } from "viem";
import SharedLayout from "./components/SharedLayout";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  // Muscadine Vault addresses
  const vaults = {
    usdc: {
      address: '0xf7e26Fa48A568b8b0038e104DfD8ABdf0f99074F' as const,
      symbol: 'USDC',
      decimals: 6,
      price: 1
    },
    cbbtc: {
      address: '0xAeCc8113a7bD0CFAF7000EA7A31afFD4691ff3E9' as const,
      symbol: 'cbBTC',
      decimals: 8,
      price: 65000
    },
    eth: {
      address: '0x21e0d366272798da3A977FEBA699FCB91959d120' as const,
      symbol: 'ETH',
      decimals: 18,
      price: 3500
    }
  };

  // Get vault balances
  const usdcVaultBalance = useReadContract({
    address: vaults.usdc.address,
    abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] }],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: !!address && isConnected },
  });

  const cbbtcVaultBalance = useReadContract({
    address: vaults.cbbtc.address,
    abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] }],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: !!address && isConnected },
  });

  const ethVaultBalance = useReadContract({
    address: vaults.eth.address,
    abi: [{ name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] }],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: { enabled: !!address && isConnected },
  });

  // Calculate total deposits
  const calculateTotalDeposits = () => {
    let total = 0;
    
    if (usdcVaultBalance.data) {
      const usdcAmount = parseFloat(formatUnits(usdcVaultBalance.data, vaults.usdc.decimals));
      total += usdcAmount * vaults.usdc.price;
    }
    
    if (cbbtcVaultBalance.data) {
      const cbbtcAmount = parseFloat(formatUnits(cbbtcVaultBalance.data, vaults.cbbtc.decimals));
      total += cbbtcAmount * vaults.cbbtc.price;
    }
    
    if (ethVaultBalance.data) {
      const ethAmount = parseFloat(formatUnits(ethVaultBalance.data, vaults.eth.decimals));
      total += ethAmount * vaults.eth.price;
    }
    
    return total;
  };

  const totalDeposits = calculateTotalDeposits();

  useEffect(() => {
    // Redirect to lending page after a short delay to show the total deposits
    const timer = setTimeout(() => {
      router.replace("/lending");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SharedLayout>
      <div className={styles.tabContent}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Muscadine Vaults</h2>
        </div>
        
        {isConnected && address ? (
          <div className={styles.totalDepositsSection}>
            <div className={styles.totalDepositsCard}>
              <h3 className={styles.totalDepositsTitle}>Total Deposited</h3>
              <div className={styles.totalDepositsAmount}>
                ${totalDeposits.toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
              <div className={styles.totalDepositsSubtext}>
                Across all Muscadine vaults
              </div>
            </div>
            
            <div className={styles.vaultBreakdown}>
              <div className={styles.vaultBreakdownItem}>
                <span className={styles.vaultBreakdownLabel}>USDC Vault:</span>
                <span className={styles.vaultBreakdownValue}>
                  ${usdcVaultBalance.data ? 
                    (parseFloat(formatUnits(usdcVaultBalance.data, vaults.usdc.decimals)) * vaults.usdc.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                    : '0.00'}
                </span>
              </div>
              <div className={styles.vaultBreakdownItem}>
                <span className={styles.vaultBreakdownLabel}>cbBTC Vault:</span>
                <span className={styles.vaultBreakdownValue}>
                  ${cbbtcVaultBalance.data ? 
                    (parseFloat(formatUnits(cbbtcVaultBalance.data, vaults.cbbtc.decimals)) * vaults.cbbtc.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                    : '0.00'}
                </span>
              </div>
              <div className={styles.vaultBreakdownItem}>
                <span className={styles.vaultBreakdownLabel}>ETH Vault:</span>
                <span className={styles.vaultBreakdownValue}>
                  ${ethVaultBalance.data ? 
                    (parseFloat(formatUnits(ethVaultBalance.data, vaults.eth.decimals)) * vaults.eth.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                    : '0.00'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.connectWalletPrompt}>
            <p>Connect your wallet to view your vault deposits</p>
          </div>
        )}
        
        <div className={styles.redirectMessage}>
          <p>Redirecting to lending page...</p>
        </div>
      </div>
    </SharedLayout>
  );
}
