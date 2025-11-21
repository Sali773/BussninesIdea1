import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, Store, ShoppingCart, CreditCard, Banknote, TrendingUp, Search, User } from 'lucide-react';
import { formatPrice } from '@/lib/currency';
import { useState, useMemo } from 'react';

export default function Commissions({ boutiques, summary }: any) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter boutiques by search
    const filteredBoutiques = useMemo(() => {
        if (!searchQuery.trim()) {
            return boutiques;
        }
        const query = searchQuery.toLowerCase();
        return boutiques.filter((boutique: any) =>
            boutique.name.toLowerCase().includes(query) ||
            boutique.owner.toLowerCase().includes(query)
        );
    }, [boutiques, searchQuery]);

    return (
        <AppLayout>
            <Head title="Commission Tracking" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Commission Tracking</h1>
                                <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">
                                    Track boutique sales and platform revenue
                                </p>
                            </div>
                            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                                <Link href="/admin/dashboard">Back to Dashboard</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 font-medium">Platform Commission</p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-900 dark:text-green-300 mt-1 sm:mt-2 truncate">
                                        {formatPrice(summary.total_platform_commission)}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-green-200 dark:bg-green-800 rounded-lg flex-shrink-0 ml-2">
                                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-700 dark:text-green-300" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Total Sales</p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2 truncate">
                                        {formatPrice(summary.total_sales)}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0 ml-2">
                                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">COD Commission</p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2 truncate">
                                        {formatPrice(summary.total_cod_commission)}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900 rounded-lg flex-shrink-0 ml-2">
                                    <Banknote className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Online Commission</p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2 truncate">
                                        {formatPrice(summary.total_online_commission)}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0 ml-2">
                                    <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Search Bar */}
                    {boutiques.length > 0 && (
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                    id="boutique-search"
                                    name="search"
                                    type="text"
                                    placeholder="Search boutiques by name or owner..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-12 text-base bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                                />
                            </div>
                            {searchQuery && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                    Showing {filteredBoutiques.length} of {boutiques.length} boutiques
                                </p>
                            )}
                        </div>
                    )}

                    {filteredBoutiques.length === 0 ? (
                        <Card className="p-8 sm:p-12 text-center">
                            <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600 dark:text-slate-400 text-lg">
                                {searchQuery ? 'No boutiques found matching your search' : 'No boutiques with sales yet'}
                            </p>
                        </Card>
                    ) : (
                        <>
                            {/* Mobile: Horizontal Scrollable Cards */}
                            <div className="lg:hidden">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 px-1">
                                    {filteredBoutiques.length > 1 ? 'Swipe left/right to see all boutiques →' : ''}
                                </p>
                                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                                    {filteredBoutiques.map((boutique: any) => (
                                        <Card key={boutique.id} className="flex-shrink-0 w-[85vw] max-w-sm snap-center shadow-lg">
                                            <div className="p-5">
                                                {/* Boutique Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
                                                            <Store className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate">
                                                                {boutique.name}
                                                            </h3>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5 truncate">
                                                                <User className="w-3.5 h-3.5 flex-shrink-0" />
                                                                {boutique.owner}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ml-2 ${
                                                        boutique.is_active
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                                                    }`}>
                                                        {boutique.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>

                                                {/* Key Metrics */}
                                                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                                                        <p className="text-xs text-blue-700 dark:text-blue-400">Total Sales</p>
                                                        <p className="text-lg font-bold text-blue-900 dark:text-blue-300 mt-1">
                                                            {formatPrice(boutique.total_sales)}
                                                        </p>
                                                    </div>
                                                    <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                                                        <p className="text-xs text-green-700 dark:text-green-400">Commission</p>
                                                        <p className="text-lg font-bold text-green-900 dark:text-green-300 mt-1">
                                                            {formatPrice(boutique.total_commission)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Payment Breakdown */}
                                                <div className="space-y-3 mb-4">
                                                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <Banknote className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                                            <span className="text-sm font-medium text-orange-900 dark:text-orange-300">COD</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-orange-900 dark:text-orange-300">{boutique.cod_orders} orders</p>
                                                            <p className="text-xs text-orange-700 dark:text-orange-400">{formatPrice(boutique.cod_commission)} comm.</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Online</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-purple-900 dark:text-purple-300">{boutique.online_orders} orders</p>
                                                            <p className="text-xs text-purple-700 dark:text-purple-400">{formatPrice(boutique.online_commission)} comm.</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                                                    <span>Boutique Earnings (90%)</span>
                                                    <span className="font-bold text-slate-900 dark:text-white">{formatPrice(boutique.boutique_earnings)}</span>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop: Enhanced Table */}
                            <Card className="overflow-hidden hidden lg:block">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                                    Boutique
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                                    Total Sales
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                                    Commission (10%)
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                                    Earnings (90%)
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                                    Orders
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                                    Payment Breakdown
                                                </th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredBoutiques.map((boutique: any) => (
                                                <tr key={boutique.id} className="border-t dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Store className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                            <div>
                                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                                    {boutique.name}
                                                                </p>
                                                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                                                    {boutique.owner}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-slate-900 dark:text-white">
                                                            {formatPrice(boutique.total_sales)}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-green-600 dark:text-green-400">
                                                            {formatPrice(boutique.total_commission)}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-medium text-blue-600 dark:text-blue-400">
                                                            {formatPrice(boutique.boutique_earnings)}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <ShoppingCart className="w-3 h-3 text-slate-500" />
                                                            <span className="font-medium text-slate-900 dark:text-white">
                                                                {boutique.total_orders}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between gap-4">
                                                                <div className="flex items-center gap-2">
                                                                    <Banknote className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                                                    <span className="text-sm text-slate-700 dark:text-slate-300">COD</span>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                                        {boutique.cod_orders} orders
                                                                    </p>
                                                                    <p className="text-xs text-orange-600 dark:text-orange-400">
                                                                        {formatPrice(boutique.cod_commission)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between gap-4 pt-2 border-t dark:border-slate-700">
                                                                <div className="flex items-center gap-2">
                                                                    <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                                    <span className="text-sm text-slate-700 dark:text-slate-300">Online</span>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                                        {boutique.online_orders} orders
                                                                    </p>
                                                                    <p className="text-xs text-purple-600 dark:text-purple-400">
                                                                        {formatPrice(boutique.online_commission)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            boutique.is_active
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                                                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                                                        }`}>
                                                            {boutique.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </>
                    )}

                    {/* Legend */}
                    <div className="mt-6 p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm sm:text-base">How Commission Works</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white mb-1">Total Sales</p>
                                <p>The total value of all products sold by the boutique</p>
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white mb-1">Commission Owed (10%)</p>
                                <p>Platform commission automatically calculated at checkout</p>
                            </div>
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white mb-1">Boutique Earnings (90%)</p>
                                <p>Amount the boutique receives after platform commission</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
