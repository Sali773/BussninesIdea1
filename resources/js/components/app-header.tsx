import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { AdminNavbar } from '@/components/admin-navbar';
import { useInitials } from '@/hooks/use-initials';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Heart, Menu, Search, ShoppingCart, User, LogOut, LayoutDashboard, ShoppingBag, Package, Store } from 'lucide-react';

interface AppHeaderProps {
    breadcrumbs?: any[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth, cart } = page.props;
    const getInitials = useInitials();
    const isAdminPage = page.url.startsWith('/admin');
    const cartCount = (cart as any)?.count || 0;

    return (
        <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
            <div className="w-full">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Mobile Menu - On the left */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden text-slate-600 dark:text-slate-400">
                                        <Menu className="w-5 h-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-80 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                    <SheetDescription className="sr-only">
                                        Access main navigation links including Shop, Boutiques, and Admin dashboard
                                    </SheetDescription>

                                    {/* Header with Logo */}
                                    <div className="pt-6 pb-8 border-b border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                                <ShoppingBag className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">BussninesIdea</h2>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Your Marketplace</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Navigation Links */}
                                    <nav className="flex flex-col gap-2 mt-6">
                                        <Link
                                            href="/products"
                                            className="group flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950 dark:hover:to-purple-950 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-semibold text-base">Shop</span>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Browse products</p>
                                            </div>
                                        </Link>

                                        <Link
                                            href="/boutiques"
                                            className="group flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950 dark:hover:to-pink-950 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Store className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-semibold text-base">Boutiques</span>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Discover stores</p>
                                            </div>
                                        </Link>

                                        {auth.user?.is_admin && (
                                            <Link
                                                href="/admin/dashboard"
                                                className="group flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 dark:hover:from-indigo-950 dark:hover:to-blue-950 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <LayoutDashboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-semibold text-base">Admin</span>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage platform</p>
                                                </div>
                                            </Link>
                                        )}
                                    </nav>

                                    {/* Footer */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                                        <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                                            © 2024 BussninesIdea. All rights reserved.
                                        </p>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Logo */}
                            <Link href="/" className="flex-shrink-0">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">B</span>
                                    </div>
                                    <span className="text-xl font-bold hidden sm:inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                        BussnessIdea
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8 ml-12">
                            <Link href="/products" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                Shop
                            </Link>
                            <Link href="/boutiques" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                Boutiques
                            </Link>
                            {auth.user?.is_admin && (
                                <Link href="/admin/dashboard" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                    Admin
                                </Link>
                            )}
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {/* Search Button */}
                            <Button variant="ghost" size="icon" className="hidden sm:flex text-slate-600 dark:text-slate-400">
                                <Search className="w-5 h-5" />
                            </Button>

                            {/* Cart Button */}
                            <Link href="/cart">
                                <Button variant="ghost" size="icon" className="relative text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                                    <ShoppingCart className="w-5 h-5" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>

                            {/* Wishlist Button */}
                            <Button variant="ghost" size="icon" className="hidden sm:flex text-slate-600 dark:text-slate-400 hover:text-red-500">
                                <Heart className="w-5 h-5" />
                            </Button>

                            {/* User Menu / Auth */}
                            {auth.user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                                    {getInitials(auth.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <UserMenuContent user={auth.user} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-slate-600 dark:text-slate-400">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isAdminPage && auth.user?.is_admin && <AdminNavbar />}
        </header>
    );
}
