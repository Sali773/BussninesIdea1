import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, CheckCircle, TrendingUp, AlertCircle, Calendar, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function OrdersIndex({ orders }: any) {
    const getStatusColor = (status: string) => {
        const colors: any = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            processing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case 'shipped':
            case 'processing':
                return <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
            case 'pending':
                return <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
            case 'cancelled':
                return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
            default:
                return <ShoppingBag className="w-5 h-5" />;
        }
    };

    // Calculate analytics
    const totalSpent = orders.data?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;
    const completedCount = orders.data?.filter((o: any) => o.status === 'completed').length || 0;
    const pendingCount = orders.data?.filter((o: any) => o.status === 'pending').length || 0;
    const totalOrders = orders.data?.length || 0;

    return (
        <StorefrontLayout>
            <Head title="My Orders" />

            <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold">My Orders</h1>
                                <p className="text-blue-100 mt-2">Track your purchases and order status</p>
                            </div>
                            <Link href="/products">
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 gap-2">
                                    <ShoppingBag className="w-5 h-5" />
                                    Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Analytics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Orders</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                        {totalOrders}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Spent</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                        {formatPrice(totalSpent)}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                        {completedCount}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                        {pendingCount}
                                    </p>
                                </div>
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                    <Package className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Orders Section */}
                    <Card className="p-6">
                        {orders.data.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">No orders yet</p>
                                <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">Start shopping to see your orders here</p>
                                <Link href="/products">
                                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                        Start Shopping
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Your Orders</h2>
                                <div className="space-y-4">
                                    {orders.data.map((order: any) => (
                                        <div key={order.id} className="border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition">
                                            <div className="p-6">
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Order #{order.order_number}</h3>
                                                        <div className="flex flex-col sm:flex-row gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="w-4 h-4" />
                                                                {order.shipping_city}, {order.shipping_country}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                                {formatPrice(order.total)}
                                                            </p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">{order.items?.length || 0} items</p>
                                                        </div>
                                                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getStatusColor(order.status)}`}>
                                                            {getStatusIcon(order.status)}
                                                            <span className="font-semibold text-sm">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-slate-200 dark:border-slate-700">
                                                    <div>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400">Subtotal</p>
                                                        <p className="font-semibold text-slate-900 dark:text-white">{formatPrice(order.subtotal)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400">Shipping</p>
                                                        <p className="font-semibold text-slate-900 dark:text-white">{formatPrice(order.shipping_cost)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400">Tax</p>
                                                        <p className="font-semibold text-slate-900 dark:text-white">{formatPrice(order.tax)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400">Total</p>
                                                        <p className="font-bold text-lg text-slate-900 dark:text-white">{formatPrice(order.total)}</p>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <Link href={`/orders/${order.id}`}>
                                                        <Button variant="outline" className="w-full sm:w-auto">
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {orders.links && orders.data.length > 0 && (
                            <div className="mt-8 flex flex-wrap justify-center gap-2">
                                {orders.links.map((link: any, i: number) => (
                                    <div key={i}>
                                        {link.url ? (
                                            <Link href={link.url}>
                                                <Button variant={link.active ? 'default' : 'outline'} size="sm">
                                                    {link.label.replace(/&laquo;|\&raquo;/g, (m: string) => m === '&laquo;' ? '←' : '→')}
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Button variant={link.active ? 'default' : 'outline'} size="sm" disabled>
                                                {link.label.replace(/&laquo;|\&raquo;/g, (m: string) => m === '&laquo;' ? '←' : '→')}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </StorefrontLayout>
    );
}
