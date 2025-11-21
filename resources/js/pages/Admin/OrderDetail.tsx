import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, MapPin, CreditCard, Store, DollarSign } from 'lucide-react';

import { formatPrice } from '@/lib/currency';
export default function OrderDetail({ order }: any) {
    const getStatusColor = (status: string) => {
        const colors: any = {
            pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200',
            paid: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
            processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
            shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200',
            completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
            cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
        };
        return colors[status] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200';
    };

    // Calculate boutique earnings (total - commission)
    const boutiqueBreakdown = order.items.reduce((acc: any, item: any) => {
        const boutiqueId = item.boutique.id;
        const boutiqueName = item.boutique.name;
        const itemTotal = parseFloat(item.total);
        const commission = parseFloat(item.commission_amount);
        const boutiqueEarns = itemTotal - commission;

        if (!acc[boutiqueId]) {
            acc[boutiqueId] = {
                name: boutiqueName,
                totalSales: 0,
                totalCommission: 0,
                earnings: 0,
            };
        }

        acc[boutiqueId].totalSales += itemTotal;
        acc[boutiqueId].totalCommission += commission;
        acc[boutiqueId].earnings += boutiqueEarns;

        return acc;
    }, {});

    return (
        <AppLayout>
            <Head title={`Order #${order.order_number}`} />

            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/admin/orders">
                                <Button variant="outline" size="sm" className="mb-4">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Orders
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                Order #{order.order_number}
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">
                                Placed on {new Date(order.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                {order.status.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Package className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Items</h2>
                            </div>

                            <div className="space-y-4">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <img
                                            src={item.product.image_path || '/placeholder.png'}
                                            alt={item.product.title}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {item.product.title}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                <Store className="w-3 h-3 inline mr-1" />
                                                {item.boutique.name}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-sm">
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    Qty: {item.quantity}
                                                </span>
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    Unit Price: {formatPrice(parseFloat(item.unit_price))}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900 dark:text-white">
                                                {formatPrice(parseFloat(item.total))}
                                            </p>
                                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                                Commission: {formatPrice(parseFloat(item.commission_amount))}
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-400">
                                                Boutique earns: {formatPrice(parseFloat(item.total) - parseFloat(item.commission_amount))}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Boutique Breakdown */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <DollarSign className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Boutique Earnings Breakdown</h2>
                            </div>

                            <div className="space-y-4">
                                {Object.values(boutiqueBreakdown).map((boutique: any, index: number) => (
                                    <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                                            <Store className="w-4 h-4 inline mr-2" />
                                            {boutique.name}
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-600 dark:text-slate-400">Total Sales</p>
                                                <p className="font-bold text-slate-900 dark:text-white">
                                                    {formatPrice(boutique.totalSales)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-600 dark:text-slate-400">Commission (10%)</p>
                                                <p className="font-bold text-red-600 dark:text-red-400">
                                                    -{formatPrice(boutique.totalCommission)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-600 dark:text-slate-400">Net Earnings</p>
                                                <p className="font-bold text-green-600 dark:text-green-400">
                                                    {formatPrice(boutique.earnings)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Platform Commission Summary */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Platform Commission</h3>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {formatPrice(parseFloat(order.total_commission || 0))}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                    Total platform revenue from this order (10% of product sales)
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Customer & Payment Info */}
                    <div className="space-y-6">
                        {/* Customer Information */}
                        <Card className="p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Customer</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Name</p>
                                    <p className="font-medium text-slate-900 dark:text-white">{order.user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                                    <p className="font-medium text-slate-900 dark:text-white">{order.customer_email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Phone</p>
                                    <p className="font-medium text-slate-900 dark:text-white">{order.customer_phone}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Shipping Address */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Shipping Address</h2>
                            </div>
                            <div className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                                <p>{order.shipping_address}</p>
                                <p>{order.shipping_city}</p>
                                <p>{order.shipping_country} {order.shipping_postal_code}</p>
                            </div>
                        </Card>

                        {/* Payment Information */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Payment</h2>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Method</p>
                                    <p className="font-medium text-slate-900 dark:text-white uppercase">
                                        {order.payment_method}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Order Summary */}
                        <Card className="p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Order Summary</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        {formatPrice(parseFloat(order.subtotal))}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Shipping</span>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        {formatPrice(parseFloat(order.shipping_cost))}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Tax (18%)</span>
                                    <span className="font-medium text-slate-900 dark:text-white">
                                        {formatPrice(parseFloat(order.tax))}
                                    </span>
                                </div>
                                <div className="border-t dark:border-slate-700 pt-2 mt-2">
                                    <div className="flex justify-between text-base">
                                        <span className="font-bold text-slate-900 dark:text-white">Total</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">
                                            {formatPrice(parseFloat(order.total))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
