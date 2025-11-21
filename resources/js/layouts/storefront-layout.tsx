import { AppHeader } from '@/components/app-header';
import { type ReactNode } from 'react';

interface StorefrontLayoutProps {
    children: ReactNode;
}

export default function StorefrontLayout({ children }: StorefrontLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
            <AppHeader />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
