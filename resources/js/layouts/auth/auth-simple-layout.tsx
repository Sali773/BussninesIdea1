import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { ShoppingBag } from 'lucide-react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 flex-col justify-between relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10">
                    <Link href={home.url()} className="flex items-center gap-3 text-white">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold">BussninesIdea</span>
                    </Link>
                </div>

                <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Your Digital Boutique Marketplace
                    </h2>
                    <p className="text-blue-100 text-lg">
                        Connect with customers worldwide, showcase your products, and grow your business on our innovative platform.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-8 text-white/80 text-sm">
                    <span>© 2024 BussninesIdea</span>
                    <span>•</span>
                    <span>All rights reserved</span>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href={home.url()} className="inline-flex items-center gap-2 text-slate-900 dark:text-white">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">BussninesIdea</span>
                        </Link>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
                            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
