import {
    useAppKitAccount,
    useAppKit,
    useDisconnect,
    useWalletInfo,
  } from '@reown/appkit/react'; // Assuming this is the import path
import Image from 'next/image';
  
  export default function ConnectButton() {
    // Hook to get account status and address
    const { address, isConnected } = useAppKitAccount();
  
    // Hook to control the connection modal
    const { open } = useAppKit();
  
    // Hook for the disconnect function
    const { disconnect } = useDisconnect();

    const { walletInfo } = useWalletInfo();
  
    // If connected, show the address and a disconnect option
    if (isConnected && address) {
      const truncatedAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
      return (
        <button
          onClick={() => disconnect()}
        className="px-2 py-2 bg-background-inverted text-foreground-inverted cursor-pointer rounded-3xl"
        ><div className="flex items-center gap-2">  
            {walletInfo?.icon && (
                <Image src={walletInfo.icon} alt={walletInfo.name} width={24} height={24} className="rounded-full"/>
            )}

         {truncatedAddress}
          </div>
        </button>
      );
    }
  
    // If not connected, show the connect option
    return (
      <button
        onClick={() => open()}
       className="px-6 py-3 transition-all font-bold hover:shadow-lg duration-300 rounded-3xl text-xs bg-gradient-to-br from-blue-600 to-purple-700 text-foreground-inverted text-boldcursor-pointer"
    >
        Connect Wallet
    </button>
    );
}