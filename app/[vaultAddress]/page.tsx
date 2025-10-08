import { PortfolioProvider } from '../contexts/PortfolioContext';
import VaultDetailPage from '../components/vault/VaultDetailPage';

interface VaultPageProps {
  params: Promise<{
    vaultAddress: string;
  }>;
}

export default async function VaultPage({ params }: VaultPageProps) {
  const { vaultAddress } = await params;
  
  return (
    <PortfolioProvider>
      <VaultDetailPage vaultAddress={vaultAddress} />
    </PortfolioProvider>
  );
}
