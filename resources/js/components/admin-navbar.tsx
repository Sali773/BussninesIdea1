import { Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { LayoutDashboard, Users, Store, Package, ShoppingCart, Star, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminNavbarProps {
    className?: string;
}

export function AdminNavbar({ className }: AdminNavbarProps) {
    const page = usePage<SharedData>();
    const currentUrl = page.url;

    const navItems = [
        {
            href: '/admin/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            active: currentUrl === '/admin/dashboard',
        },
        {
            href: '/admin/users',
            label: 'Users',
            icon: Users,
            active: currentUrl.startsWith('/admin/users'),
        },
        {
            href: '/admin/boutiques',
            label: 'Boutiques',
            icon: Store,
            active: currentUrl.startsWith('/admin/boutiques'),
        },
        {
            href: '/admin/products',
            label: 'Products',
            icon: Package,
            active: currentUrl.startsWith('/admin/products'),
        },
        {
            href: '/admin/orders',
            label: 'Orders',
            icon: ShoppingCart,
            active: currentUrl.startsWith('/admin/orders'),
        },
        {
            href: '/admin/commissions',
            label: 'Commissions',
            icon: DollarSign,
            active: currentUrl.startsWith('/admin/commissions'),
        },
        {
            href: '/admin/reviews',
            label: 'Reviews',
            icon: Star,
            active: currentUrl.startsWith('/admin/reviews'),
        },
    ];

    return (
        <nav className={cn('bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800', className)}>
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div className="flex h-14 items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0',
                                    item.active
                                        ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white'
                                )}
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span className="hidden sm:inline">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
