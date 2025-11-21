import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Store, Package, ShoppingCart, TrendingUp, AlertCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function AdminDashboard({ stats, recentOrders, recentBoutiques }: any) {
    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Admin Dashboard</h1>
                                <p className="text-blue-100 mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg">
                                    Complete platform overview and management
                                </p>
                            </div>
                            <Link href="/products" className="w-full sm:w-auto">
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 w-full">
                                    <Package className="w-4 h-4 mr-2" />
                                    Browse Products
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                        <Card className="p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Total Users</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2">
                                        {stats.total_users}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0 ml-2">
                                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Boutiques</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2">
                                        {stats.total_boutiques}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900 rounded-lg flex-shrink-0 ml-2">
                                    <Store className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Products</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2">
                                        {stats.total_products}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900 rounded-lg flex-shrink-0 ml-2">
                                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Total Orders</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 sm:mt-2">
                                        {stats.total_orders}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900 rounded-lg flex-shrink-0 ml-2">
                                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-400 font-medium">Pending</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-1 sm:mt-2">
                                        {stats.pending_orders}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-yellow-200 dark:bg-yellow-800 rounded-lg flex-shrink-0 ml-2">
                                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 font-medium">Revenue</p>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400 mt-1 sm:mt-2 break-words">
                                        {formatPrice(stats.total_revenue)}
                                    </p>
                                </div>
                                <div className="p-2 sm:p-3 bg-green-200 dark:bg-green-800 rounded-lg flex-shrink-0">
                                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Management Links */}
                    <div className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <Link href="/admin/users" className="block group">
                                <Card className="p-5 sm:p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-500">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:scale-110 transition-transform">
                                            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">Manage Users</h3>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 sm:mt-2">Add, edit or remove users</p>
                                </Card>
                            </Link>

                            <Link href="/admin/boutiques" className="block group">
                                <Card className="p-5 sm:p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer border-2 border-transparent hover:border-purple-500">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:scale-110 transition-transform">
                                            <Store className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">Manage Boutiques</h3>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 sm:mt-2">Control boutique status</p>
                                </Card>
                            </Link>

                            <Link href="/admin/products" className="block group">
                                <Card className="p-5 sm:p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer border-2 border-transparent hover:border-green-500">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg group-hover:scale-110 transition-transform">
                                            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">Manage Products</h3>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 sm:mt-2">View and manage all products</p>
                                </Card>
                            </Link>

                            <Link href="/admin/orders" className="block group">
                                <Card className="p-5 sm:p-6 hover:shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer border-2 border-transparent hover:border-orange-500">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg group-hover:scale-110 transition-transform">
                                            <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">Manage Orders</h3>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 sm:mt-2">Update order status</p>
                                </Card>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Recent Orders</h2>
                                <Link href="/admin/orders" className="w-full sm:w-auto">
                                    <Button variant="outline" size="sm" className="w-full sm:w-auto group">
                                        View All
                                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order: any) => (
                                        <Card key={order.id} className="p-4 sm:p-5 hover:shadow-lg transition-shadow">
                                            <Link href={`/admin/orders/${order.id}`} className="block">
                                                <div className="flex items-center justify-between gap-3 mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                                                        </div>
                                                        <div>
                                                            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                                                                #{order.order_number}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                                                        order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' :
                                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' :
                                                        'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="ml-11 sm:ml-14 space-y-1">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{order.user.name}</p>
                                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{formatPrice(order.total)}</p>
                                                </div>
                                            </Link>
                                        </Card>
                                    ))
                                ) : (
                                    <Card className="p-8 sm:p-12 text-center">
                                        <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">No orders yet</p>
                                    </Card>
                                )}
                            </div>
                        </div>

                        {/* Recent Boutiques */}
                        <div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Recent Boutiques</h2>
                                <Link href="/admin/boutiques" className="w-full sm:w-auto">
                                    <Button variant="outline" size="sm" className="w-full sm:w-auto group">
                                        View All
                                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                {recentBoutiques.length > 0 ? (
                                    recentBoutiques.map((boutique: any) => (
                                        <Card key={boutique.id} className="p-4 sm:p-5 hover:shadow-lg transition-shadow">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                                    <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
                                                        <Store className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">{boutique.name}</h4>
                                                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 truncate">{boutique.user.name}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                                                    boutique.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                                                }`}>
                                                    {boutique.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <Card className="p-8 sm:p-12 text-center">
                                        <Store className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">No boutiques yet</p>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
