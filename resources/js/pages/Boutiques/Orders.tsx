import { Head, Link, router } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CheckCircle, Truck, Clock, XCircle, Package, MapPin, Phone, Mail, User, ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function BoutiqueOrders({ boutique, orders }: any) {
    const [expandedOrders, setExpandedOrders] = useState<number[]>([]);
    const [processing, setProcessing] = useState(false);

    const toggleOrder = (orderId: number) => {
        setExpandedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const updateOrderStatus = (orderId: number, newStatus: string) => {
        if (confirm(`Are you sure you want to ${newStatus === 'cancelled' ? 'decline' : newStatus === 'processing' ? 'accept' : newStatus} this order?`)) {
            setProcessing(true);
            router.patch(`/boutiques/${boutique.id}/orders/${orderId}/status`, { status: newStatus }, {
                onFinish: () => setProcessing(false)
            });
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-700 dark:text-yellow-200', label: 'Pending' },
            processing: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-700 dark:text-blue-200', label: 'Accepted' },
            shipped: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-700 dark:text-purple-200', label: 'Shipped' },
            completed: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-200', label: 'Completed' },
            cancelled: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-700 dark:text-red-200', label: 'Declined' },
        };
        const badge = badges[status as keyof typeof badges] || badges.pending;
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>{badge.label}</span>;
    };

    // Calculate stats
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);
    const completedOrders = orders.filter((o: any) => o.status === 'completed').length;
    const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;

    return (
        <StorefrontLayout>
            <Head title={`${boutique.name} - Orders`} />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                {/* Header */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">Orders</h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-1">{boutique.name}</p>
                            </div>
                            <Button asChild variant="outline">
                                <Link href="/my-boutiques">Back to Dashboard</Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Orders</p>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{orders.length}</p>
                                </div>
                                <Package className="w-10 h-10 text-slate-400" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{pendingOrders}</p>
                                </div>
                                <Clock className="w-10 h-10 text-yellow-400" />
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{completedOrders}</p>
                                </div>
                                <CheckCircle className="w-10 h-10 text-green-400" />
                            </div>
                        </Card>
                    </div>

                    {/* Orders List */}
                    {orders.length === 0 ? (
                        <Card className="p-12 text-center">
                            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600 dark:text-slate-400 text-lg">No orders yet</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order: any) => {
                                const isExpanded = expandedOrders.includes(order.id);
                                // Filter items that belong to this boutique
                                const boutiqueItems = order.items?.filter((item: any) => item.boutique_id === boutique.id) || [];

                                return (
                                    <Card key={order.id} className="overflow-hidden">
                                        {/* Order Header */}
                                        <div
                                            className="p-4 sm:p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                            onClick={() => toggleOrder(order.id)}
                                        >
                                            <div className="flex items-start sm:items-center justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                                                        <span className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                                                            Order #{order.order_number}
                                                        </span>
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                    <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400">
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-4 h-4" />
                                                            <span className="truncate">{order.user?.name || 'Guest'}</span>
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <Package className="w-4 h-4 flex-shrink-0" />
                                                            <span>{boutiqueItems.length} item{boutiqueItems.length !== 1 ? 's' : ''}:</span>
                                                        </div>
                                                        <div className="ml-5 space-y-0.5">
                                                            {boutiqueItems.slice(0, 2).map((item: any, idx: number) => (
                                                                <p key={idx} className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">
                                                                    • {item.product?.title || 'Product'} {item.size ? `(${item.size})` : ''} x{item.quantity}
                                                                </p>
                                                            ))}
                                                            {boutiqueItems.length > 2 && (
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                                                    +{boutiqueItems.length - 2} more...
                                                                </p>
                                                            )}
                                                        </div>
                                                        <span className="text-xs">{new Date(order.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <div className="text-right">
                                                        <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                            {formatPrice(order.total)}
                                                        </p>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Order Details */}
                                        {isExpanded && (
                                            <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                                                <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                                                    {/* Order Items */}
                                                    <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                                            <Package className="w-5 h-5" />
                                                            Order Items
                                                        </h3>
                                                        <div className="space-y-3">
                                                            {boutiqueItems.map((item: any) => (
                                                                <div key={item.id} className="bg-white dark:bg-slate-800 rounded-lg p-3 sm:p-4 flex items-start sm:items-center gap-3 sm:gap-4">
                                                                    {item.product?.image_path ? (
                                                                        <img
                                                                            src={`/storage/${item.product.image_path}`}
                                                                            alt={item.product?.title}
                                                                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700 flex-shrink-0"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base mb-1">
                                                                            {item.product?.title || 'Product'}
                                                                        </p>
                                                                        {item.product?.id && (
                                                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                                                                Product #{item.product.id}
                                                                            </p>
                                                                        )}
                                                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                                                                            {item.size && (
                                                                                <>
                                                                                    <span className="font-medium">Size: {item.size}</span>
                                                                                    <span>•</span>
                                                                                </>
                                                                            )}
                                                                            <span className="font-medium">Qty: {item.quantity}</span>
                                                                            <span>•</span>
                                                                            <span>{formatPrice(item.unit_price || 0)} each</span>
                                                                        </div>
                                                                        <p className="font-semibold text-slate-900 dark:text-white mt-2 sm:hidden text-sm">
                                                                            {formatPrice(item.total)}
                                                                        </p>
                                                                    </div>
                                                                    <p className="font-semibold text-slate-900 dark:text-white hidden sm:block flex-shrink-0">
                                                                        {formatPrice(item.total)}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Customer & Shipping Info */}
                                                    <div className="space-y-4">
                                                        {/* Shipping Address */}
                                                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                                                            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                                                <MapPin className="w-4 h-4" />
                                                                Shipping Address
                                                            </h4>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                                {order.shipping_address}<br />
                                                                {order.shipping_city}<br />
                                                                {order.shipping_country} {order.shipping_postal_code}
                                                            </p>
                                                        </div>

                                                        {/* Contact Info */}
                                                        <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                                                            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                                                <Phone className="w-4 h-4" />
                                                                Contact
                                                            </h4>
                                                            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                                                <p className="flex items-center gap-2">
                                                                    <Mail className="w-4 h-4" />
                                                                    {order.customer_email}
                                                                </p>
                                                                <p className="flex items-center gap-2">
                                                                    <Phone className="w-4 h-4" />
                                                                    {order.customer_phone}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="space-y-2">
                                                            {order.status === 'pending' && (
                                                                <>
                                                                    <Button
                                                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            updateOrderStatus(order.id, 'processing');
                                                                        }}
                                                                        disabled={processing}
                                                                    >
                                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                                        Accept Order
                                                                    </Button>
                                                                    <Button
                                                                        variant="destructive"
                                                                        className="w-full"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            updateOrderStatus(order.id, 'cancelled');
                                                                        }}
                                                                        disabled={processing}
                                                                    >
                                                                        <XCircle className="w-4 h-4 mr-2" />
                                                                        Decline Order
                                                                    </Button>
                                                                </>
                                                            )}

                                                            {order.status === 'processing' && (
                                                                <Button
                                                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateOrderStatus(order.id, 'shipped');
                                                                    }}
                                                                    disabled={processing}
                                                                >
                                                                    <Truck className="w-4 h-4 mr-2" />
                                                                    Mark as Shipped
                                                                </Button>
                                                            )}

                                                            {order.status === 'shipped' && (
                                                                <Button
                                                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateOrderStatus(order.id, 'completed');
                                                                    }}
                                                                    disabled={processing}
                                                                >
                                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                                    Mark as Completed
                                                                </Button>
                                                            )}

                                                            {(order.status === 'completed' || order.status === 'cancelled') && (
                                                                <div className="text-center text-sm text-slate-600 dark:text-slate-400 py-2">
                                                                    Order {order.status === 'completed' ? 'completed' : 'declined'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    );
}
