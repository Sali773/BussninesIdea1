import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { ShoppingCart, CheckCircle, Clock, Truck, XCircle, Eye, User, Mail, Package, ChevronRight, Search, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function AdminOrders({ orders }: any) {
    const [selectedStatus, setSelectedStatus] = useState<{ [key: number]: string }>({});
    const [processing, setProcessing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const updateStatus = (orderId: number, status: string) => {
        setProcessing(true);
        router.patch(`/admin/orders/${orderId}/status`, { status }, {
            onFinish: () => setProcessing(false)
        });
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
            paid: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800',
            processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800',
            shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800',
            completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800',
            cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800',
        };
        return colors[status] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'shipped':
                return <Truck className="w-4 h-4" />;
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            default:
                return <ShoppingCart className="w-4 h-4" />;
        }
    };

    const statuses = ['pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'];

    // Filter and search logic
    const filteredOrders = useMemo(() => {
        let filtered = orders.data;

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter((order: any) => order.status === statusFilter);
        }

        // Search by order number, customer name, or email
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((order: any) =>
                order.order_number.toLowerCase().includes(query) ||
                order.user.name.toLowerCase().includes(query) ||
                order.user.email.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [orders.data, statusFilter, searchQuery]);

    // Count orders by status
    const statusCounts = useMemo(() => {
        return {
            all: orders.data.length,
            pending: orders.data.filter((o: any) => o.status === 'pending').length,
            processing: orders.data.filter((o: any) => o.status === 'processing').length,
            shipped: orders.data.filter((o: any) => o.status === 'shipped').length,
            completed: orders.data.filter((o: any) => o.status === 'completed').length,
            cancelled: orders.data.filter((o: any) => o.status === 'cancelled').length,
        };
    }, [orders.data]);

    return (
        <AppLayout>
            <Head title="Manage Orders" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Manage Orders</h1>
                                <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">
                                    Total: {orders.total} order{orders.total !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <Button asChild className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                                <Link href="/admin/dashboard">Back to Dashboard</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {/* Search and Filters */}
                    <div className="mb-6 space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search by order #, customer name, or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 text-base bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                            />
                        </div>

                        {/* Status Filter Chips */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    statusFilter === 'all'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-blue-400'
                                }`}
                            >
                                All Orders ({statusCounts.all})
                            </button>
                            <button
                                onClick={() => setStatusFilter('pending')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                                    statusFilter === 'pending'
                                        ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-yellow-400'
                                }`}
                            >
                                <Clock className="w-3.5 h-3.5" />
                                Pending ({statusCounts.pending})
                            </button>
                            <button
                                onClick={() => setStatusFilter('processing')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                                    statusFilter === 'processing'
                                        ? 'bg-purple-100 text-purple-700 border-2 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-purple-400'
                                }`}
                            >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Processing ({statusCounts.processing})
                            </button>
                            <button
                                onClick={() => setStatusFilter('shipped')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                                    statusFilter === 'shipped'
                                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-200 dark:border-indigo-700'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-indigo-400'
                                }`}
                            >
                                <Truck className="w-3.5 h-3.5" />
                                Shipped ({statusCounts.shipped})
                            </button>
                            <button
                                onClick={() => setStatusFilter('completed')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                                    statusFilter === 'completed'
                                        ? 'bg-green-100 text-green-700 border-2 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-green-400'
                                }`}
                            >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Completed ({statusCounts.completed})
                            </button>
                            <button
                                onClick={() => setStatusFilter('cancelled')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                                    statusFilter === 'cancelled'
                                        ? 'bg-red-100 text-red-700 border-2 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-red-400'
                                }`}
                            >
                                <XCircle className="w-3.5 h-3.5" />
                                Cancelled ({statusCounts.cancelled})
                            </button>
                        </div>

                        {/* Results count */}
                        {(searchQuery || statusFilter !== 'all') && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Showing {filteredOrders.length} of {orders.data.length} orders
                                </p>
                                {(searchQuery || statusFilter !== 'all') && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setStatusFilter('all');
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {filteredOrders.length === 0 ? (
                        <Card className="p-8 sm:p-12 text-center">
                            <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600 dark:text-slate-400 text-lg">No orders found</p>
                        </Card>
                    ) : (
                        <>
                            {/* Mobile: Horizontal Scrollable Cards */}
                            <div className="lg:hidden">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 px-1">
                                    {filteredOrders.length > 1 ? 'Swipe left/right to see all orders →' : ''}
                                </p>
                                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                                    {filteredOrders.map((order: any) => (
                                        <Card key={order.id} className="flex-shrink-0 w-[85vw] max-w-sm snap-center shadow-lg">
                                            <div className="p-5">
                                                {/* Order Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
                                                            #{order.order_number}
                                                        </span>
                                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                            {formatPrice(parseFloat(order.total))}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border ${getStatusColor(order.status)}`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status}
                                                    </span>
                                                </div>

                                                {/* Customer Info */}
                                                <div className="space-y-2 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                        <span className="font-medium text-slate-900 dark:text-white">{order.user.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Mail className="w-4 h-4 text-slate-400" />
                                                        <span className="text-slate-600 dark:text-slate-400 text-xs">{order.user.email}</span>
                                                    </div>
                                                    <div className="flex items-start gap-2 text-sm">
                                                        <Package className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-slate-600 dark:text-slate-400 block mb-1">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}:</span>
                                                            <div className="space-y-1">
                                                                {order.items?.slice(0, 2).map((item: any, idx: number) => (
                                                                    <p key={idx} className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">
                                                                        • {item.product?.title || 'Product'} {item.size ? `(${item.size})` : ''} x{item.quantity}
                                                                    </p>
                                                                ))}
                                                                {order.items?.length > 2 && (
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                                                        +{order.items.length - 2} more...
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="space-y-2">
                                                    <select
                                                        value={selectedStatus[order.id] || order.status}
                                                        onChange={(e) => {
                                                            const newStatus = e.target.value;
                                                            setSelectedStatus({...selectedStatus, [order.id]: newStatus});
                                                            updateStatus(order.id, newStatus);
                                                        }}
                                                        disabled={processing}
                                                        className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition"
                                                    >
                                                        {statuses.map((status) => (
                                                            <option key={status} value={status}>
                                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <Link href={`/admin/orders/${order.id}`} className="block">
                                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View Details
                                                            <ChevronRight className="w-4 h-4 ml-auto" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop: Card Grid */}
                            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredOrders.map((order: any) => (
                                    <Card key={order.id} className="hover:shadow-xl transition-shadow">
                                        <div className="p-6">
                                            {/* Order Header */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
                                                        #{order.order_number}
                                                    </span>
                                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                        {formatPrice(parseFloat(order.total))}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </span>
                                            </div>

                                            {/* Customer Info */}
                                            <div className="space-y-2 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                    <span className="font-medium text-slate-900 dark:text-white">{order.user.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-600 dark:text-slate-400 text-xs truncate">{order.user.email}</span>
                                                </div>
                                                <div className="flex items-start gap-2 text-sm">
                                                    <Package className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-slate-600 dark:text-slate-400 block mb-1">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}:</span>
                                                        <div className="space-y-1">
                                                            {order.items?.slice(0, 2).map((item: any, idx: number) => (
                                                                <p key={idx} className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">
                                                                    • {item.product?.title || 'Product'} {item.size ? `(${item.size})` : ''} x{item.quantity}
                                                                </p>
                                                            ))}
                                                            {order.items?.length > 2 && (
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                                                    +{order.items.length - 2} more...
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="space-y-2">
                                                <select
                                                    value={selectedStatus[order.id] || order.status}
                                                    onChange={(e) => {
                                                        const newStatus = e.target.value;
                                                        setSelectedStatus({...selectedStatus, [order.id]: newStatus});
                                                        updateStatus(order.id, newStatus);
                                                    }}
                                                    disabled={processing}
                                                    className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition"
                                                >
                                                    {statuses.map((status) => (
                                                        <option key={status} value={status}>
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                                <Link href={`/admin/orders/${order.id}`} className="block">
                                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Details
                                                        <ChevronRight className="w-4 h-4 ml-auto" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {orders.links && (
                                <div className="mt-8 flex justify-center gap-2 flex-wrap">
                                    {orders.links.map((link: any, i: number) => (
                                        <div key={i}>
                                            {link.url ? (
                                                <Link href={link.url}>
                                                    <Button
                                                        variant={link.active ? 'default' : 'outline'}
                                                        size="sm"
                                                        className={link.active ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : ''}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                </Link>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
