'use client';

import type { ReactNode } from 'react';
import { NavBar } from './NavBar';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="mt-[60px]">
            {children}
      </main>
    </>
  );
}