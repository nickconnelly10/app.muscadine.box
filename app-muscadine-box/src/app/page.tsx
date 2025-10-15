'use client';
import ConnectScreen from "@/components/ConnectScreen";
import Dashboard from "@/components/Dashboard";
import { useAccount } from "wagmi";



export default function Home() {
  const { isConnected } = useAccount();
  return (<div>
    {isConnected ?  <Dashboard /> : <ConnectScreen />}
  </div>);
}
