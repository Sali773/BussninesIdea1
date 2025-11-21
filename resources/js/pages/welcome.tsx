import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ShoppingBag, TrendingUp, Store, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to BussninesIdea">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-black dark:via-slate-950 dark:to-black">
                {/* Navigation */}
                <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                                <h1 className="text-lg sm:text-2xl font-bold text-white">BussninesIdea</h1>
                            </div>

                            <div className="flex gap-2 sm:gap-4">
                                {auth.user ? (
                                    <Button asChild size="sm" className="sm:h-10 sm:px-4 sm:py-2">
                                        <Link href={dashboard.url()}>
                                            Dashboard
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild variant="outline" size="sm" className="sm:h-10 sm:px-4 sm:py-2 text-xs sm:text-sm">
                                            <Link href={login.url()}>
                                                Log in
                                            </Link>
                                        </Button>
                                        {canRegister && (
                                            <Button asChild size="sm" className="sm:h-10 sm:px-4 sm:py-2 text-xs sm:text-sm">
                                                <Link href={register.url()}>
                                                    Register
                                                </Link>
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-32 sm:pt-32 sm:pb-40">
                    {/* Background decoration */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                            Your Digital Boutique
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                                Marketplace
                            </span>
                        </h2>

                        <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                            Connect boutique owners with customers worldwide. Create your shop, showcase your products,
                            and build your brand on the most innovative e-commerce platform.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 px-4">
                            <Button asChild size="lg" className="w-full sm:w-auto">
                                <Link href="/products">
                                    Browse Products
                                </Link>
                            </Button>
                            {!auth.user && canRegister && (
                                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                                    <Link href={register.url()}>
                                        Start Selling
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-slate-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                                Why Choose BussninesIdea?
                            </h3>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                Everything you need to succeed as a boutique seller
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: Store,
                                    title: 'Easy Store Setup',
                                    description: 'Create your boutique in minutes with our intuitive platform'
                                },
                                {
                                    icon: ShoppingBag,
                                    title: 'Product Management',
                                    description: 'Upload products with images and manage inventory effortlessly'
                                },
                                {
                                    icon: TrendingUp,
                                    title: 'Sales Analytics',
                                    description: 'Track your sales, orders, and customer insights in real-time'
                                },
                                {
                                    icon: Users,
                                    title: 'Global Audience',
                                    description: 'Reach customers from around the world on our platform'
                                }
                            ].map((feature, idx) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="bg-slate-700/50 backdrop-blur border border-slate-600/50 rounded-lg p-6 hover:border-blue-500/50 transition-colors"
                                    >
                                        <Icon className="h-10 w-10 text-blue-400 mb-4" />
                                        <h4 className="text-lg font-semibold text-white mb-2">
                                            {feature.title}
                                        </h4>
                                        <p className="text-slate-400 text-sm">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            {[
                                { label: 'Active Boutiques', value: '500+' },
                                { label: 'Products Listed', value: '10K+' },
                                { label: 'Happy Customers', value: '50K+' }
                            ].map((stat, idx) => (
                                <div key={idx}>
                                    <div className="text-4xl font-bold text-blue-400 mb-2">
                                        {stat.value}
                                    </div>
                                    <p className="text-slate-400 text-lg">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 border-y border-slate-700/50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                            Ready to Start Your Boutique?
                        </h3>
                        <p className="text-lg text-slate-300 mb-8">
                            Join thousands of successful sellers and build your business today
                        </p>
                        {!auth.user && (
                            <div className="flex gap-4 justify-center flex-wrap">
                                <Button asChild size="lg">
                                    <Link href={register.url()}>
                                        Create Account
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="lg">
                                    <Link href="/products">
                                        Explore Marketplace
                                    </Link>
                                </Button>
                            </div>
                        )}
                        {auth.user && (
                            <Button asChild size="lg">
                                <Link href={dashboard.url()}>
                                    Go to Dashboard
                                </Link>
                            </Button>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-slate-950 border-t border-slate-800 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <ShoppingBag className="h-6 w-6 text-blue-500" />
                                    <span className="text-white font-bold">BussninesIdea</span>
                                </div>
                                <p className="text-slate-400 text-sm">
                                    The ultimate platform for boutique sellers and shoppers
                                </p>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Browse</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="/products" className="text-slate-400 hover:text-white transition-colors">
                                            Products
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                            Boutiques
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Seller</h4>
                                <ul className="space-y-2">
                                    {!auth.user ? (
                                        <>
                                            <li>
                                                <Link href={register.url()} className="text-slate-400 hover:text-white transition-colors">
                                                    Register Shop
                                                </Link>
                                            </li>
                                        </>
                                    ) : (
                                        <li>
                                            <Link href={dashboard.url()} className="text-slate-400 hover:text-white transition-colors">
                                                Dashboard
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                            Help Center
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Company</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                            About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-slate-800 pt-8">
                            <p className="text-slate-500 text-center text-sm">
                                © 2024 BussninesIdea. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
