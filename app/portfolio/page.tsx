"use client";
import { PortfolioProvider } from '../contexts/PortfolioContext';
import Portfolio from '../components/portfolio/Portfolio';

export default function PortfolioPage() {
  return (
    <PortfolioProvider>
      <Portfolio />
    </PortfolioProvider>
  );
}

