import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Package, TrendingUp, ShoppingCart, Eye, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function BoutiquesDashboard({ boutiques }: any) {
    const page = usePage<SharedData>();
    const { auth } = page.props;

    if (!auth.user?.is_seller) {
        return null;
    }

    // If user has only one boutique, show its dashboard directly
    if (boutiques.length === 1) {
        return <BoutiqueDashboardDetail boutique={boutiques[0]} />;
    }

    // Show list of boutiques
    return (
        <AppLayout>
            <Head title="My Boutiques" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold">My Boutiques</h1>
                                <p className="text-blue-100 mt-2">Select a boutique to manage orders and view analytics</p>
                            </div>
                            <Link href="/products/create">
                                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                                    Add Product
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {boutiques.map((boutique: any) => (
                            <Link key={boutique.id} href={`/boutiques/${boutique.id}/dashboard`}>
                                <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                                                {boutique.name}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                {boutique.products?.length || 0} products
                                            </p>
                                        </div>
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>

                                    {boutique.description && (
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                                            {boutique.description}
                                        </p>
                                    )}

                                    <div className="space-y-2 text-sm">
                                        {boutique.city && (
                                            <p className="text-slate-600 dark:text-slate-400">📍 {boutique.city}, {boutique.country}</p>
                                        )}
                                        {boutique.phone && (
                                            <p className="text-slate-600 dark:text-slate-400">📱 {boutique.phone}</p>
                                        )}
                                    </div>

                                    <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                        Manage Orders
                                    </Button>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function BoutiqueDashboardDetail({ boutique }: any) {
    const updateOrderStatus = (orderId: number, status: string) => {
        router.patch(`/admin/orders/${orderId}/status`, { status });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'shipped':
                return <Truck className="w-5 h-5 text-blue-600" />;
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            default:
                return <XCircle className="w-5 h-5 text-red-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
            case 'shipped':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
        }
    };

    const orders = boutique.orders || [];

    return (
        <AppLayout>
            <Head title={`${boutique.name} - Dashboard`} />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold truncate">{boutique.name}</h1>
                                <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">Manage orders and view analytics</p>
                            </div>
                            <Link href="/my-boutiques" className="w-full sm:w-auto">
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 w-full">
                                    Back to Boutiques
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Orders</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                        {orders.length}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Products</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                        {boutique.products?.length || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Views</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                        {boutique.products?.reduce((sum: number, p: any) => sum + (p.views || 0), 0) || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                                    <Eye className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Orders */}
                    <Card className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Recent Orders</h2>
                            <Link href={`/boutiques/${boutique.id}/orders`} className="w-full sm:w-auto">
                                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto text-sm">
                                    View All Orders
                                </Button>
                            </Link>
                        </div>

                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-600 dark:text-slate-400">No orders yet</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                                <table className="w-full min-w-max">
                                    <thead className="bg-slate-100 dark:bg-slate-800">
                                        <tr>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Order #</th>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Customer</th>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Items</th>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Total</th>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Status</th>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 5).map((order: any) => (
                                            <tr key={order.id} className="border-t dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium">
                                                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                                                        #{order.order_number}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white whitespace-nowrap">{order.user?.name}</p>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400 hidden sm:block">{order.user?.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap">{order.items?.length || 0} items</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold whitespace-nowrap">{formatPrice(order.total)}</td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                                                    <div className="flex items-center gap-1 sm:gap-2">
                                                        {getStatusIcon(order.status)}
                                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        className="px-2 sm:px-3 py-1 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-xs sm:text-sm"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
