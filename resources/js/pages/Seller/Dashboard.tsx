import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, ShoppingCart, Package, Eye, TrendingUp, Plus, Download, Settings, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function SellerDashboard({ stats, boutiques, recentOrders, topProducts }: any) {

    const exportOrders = () => {
        // Get all orders from boutiques
        const allOrders: any[] = [];
        boutiques.forEach((boutique: any) => {
            boutique.orders?.forEach((order: any) => {
                allOrders.push({
                    boutique_name: boutique.name,
                    order_number: order.order_number,
                    customer_name: order.user?.name || 'Guest',
                    customer_email: order.user?.email || 'N/A',
                    status: order.status,
                    total: order.total,
                    items_count: order.items?.length || 0,
                    created_at: new Date(order.created_at).toLocaleDateString(),
                });
            });
        });

        // Check if there are any orders to export
        if (allOrders.length === 0) {
            alert('No orders to export');
            return;
        }

        // Create CSV content with proper escaping for names that might contain commas
        const headers = ['Boutique', 'Order #', 'Customer', 'Email', 'Status', 'Total', 'Items', 'Date'];
        const csvContent = [
            headers.join(','),
            ...allOrders.map(order => [
                `"${order.boutique_name}"`,
                order.order_number,
                `"${order.customer_name}"`,
                order.customer_email,
                order.status,
                order.total,
                order.items_count,
                order.created_at
            ].join(','))
        ].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <StorefrontLayout>
            <Head title="Seller Dashboard" />

            <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Seller Dashboard</h1>
                                <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">Manage your boutiques and track sales</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    className="text-white border-white hover:bg-blue-500 w-full sm:w-auto"
                                    onClick={exportOrders}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Orders
                                </Button>
                                <Link href="/products/create" className="w-full sm:w-auto">
                                    <Button className="bg-white text-blue-600 hover:bg-blue-50 w-full">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Add Product
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Sales</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                        {formatPrice(stats.total_sales)}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Orders</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                        {stats.total_orders}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Products</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                                        {stats.total_products}
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
                                        {stats.total_views}
                                    </p>
                                </div>
                                <div className="p-3 bg-amber-100 dark:bg-amber-900 rounded-lg">
                                    <Eye className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Navigation Menu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        <Link href={boutiques.length > 0 ? `/boutiques/${boutiques[0]?.id}/orders` : '#'}>
                            <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">My Orders</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">View and manage all orders</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </Card>
                        </Link>

                        <Link href="/products/create">
                            <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Add Product</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">Create new products</p>
                                    </div>
                                    <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                            </Card>
                        </Link>

                        <Link href="/seller/products">
                            <Card className="p-6 hover:shadow-lg transition cursor-pointer h-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:to-amber-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">My Products</h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">View all products</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                            </Card>
                        </Link>
                    </div>

                    {/* Top Products */}
                    {topProducts.length > 0 && (
                        <Card className="p-6 mb-8">
                            <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Top Products by Views</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {topProducts.slice(0, 5).map((product: any) => (
                                    <div key={product.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate mb-2">
                                            {product.title}
                                        </h4>
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {product.views}
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">views</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Recent Orders Summary */}
                    {recentOrders.length > 0 && (
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Orders</h3>
                                {boutiques.length > 0 && (
                                    <Link href={`/boutiques/${boutiques[0]?.id}/orders`}>
                                        <Button size="sm" className="gap-2">
                                            View All Orders
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {recentOrders.slice(0, 6).map((order: any) => (
                                    <Link key={order.id} href={`/orders/${order.id}`}>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-xs font-semibold">
                                                    #{order.order_number}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded font-semibold ${
                                                    order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' :
                                                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                                                {order.user?.name}
                                            </p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 truncate">
                                                {order.user?.email}
                                            </p>
                                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                {formatPrice(order.total)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    );
}
