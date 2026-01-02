import type { ReactNode } from 'react';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Desktop Header - Hidden on mobile (< md) */}
      {/* Header - Visible on all screens */}
      <div>
        <TopHeader />
      </div>

      <main className="container mx-auto max-w-5xl px-0 md:px-4 pb-20 md:pb-8 pt-4">
        {children}
      </main>

      {/* Mobile Bottom Nav - Hidden on desktop (>= md) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
