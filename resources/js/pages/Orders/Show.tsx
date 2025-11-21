import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/currency';
import { ArrowLeft, Package, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

export default function OrderShow({ order }: any) {
    const getStatusColor = (status: string) => {
        const colors: any = {
            pending: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
            paid: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900',
            processing: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
            shipped: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900',
            completed: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900',
            cancelled: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
        };
        return colors[status] || 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
    };

    return (
        <AppLayout>
            <Head title={`Order ${order.order_number}`} />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                {/* Header */}
                <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <Link href="/orders" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-4 transition">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Orders
                        </Link>
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">Order #{order.order_number}</h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                                    Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                            <Badge className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Order Items and Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Items */}
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Package className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Order Items</h2>
                                </div>
                                <div className="space-y-4">
                                    {order.items?.map((item: any) => (
                                        <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0">
                                            {item.product?.image_path && (
                                                <img
                                                    src={`/storage/${item.product.image_path}`}
                                                    alt={item.product?.title}
                                                    className="w-16 h-16 object-cover rounded-lg bg-slate-200 dark:bg-slate-700"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900 dark:text-white">{item.product?.title}</p>
                                                <div className="flex items-center gap-2 mt-1 text-sm text-slate-600 dark:text-slate-400">
                                                    <span>{item.boutique?.name}</span>
                                                    {item.size && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Size: {item.size}</span>
                                                        </>
                                                    )}
                                                    <span>•</span>
                                                    <span>Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-slate-900 dark:text-white">{formatPrice(item.total)}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Shipping Address */}
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Shipping Address</h3>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {order.shipping_address}<br />
                                    {order.shipping_city}<br />
                                    {order.shipping_country} {order.shipping_postal_code}
                                </p>
                            </Card>

                            {/* Contact Information */}
                            <Card className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Phone className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Contact Information</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Mail className="w-4 h-4" />
                                        <span>{order.customer_email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Phone className="w-4 h-4" />
                                        <span>{order.customer_phone}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div>
                            <Card className="p-6 sticky top-20">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Order Summary</h2>
                                <div className="space-y-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                        <span>Subtotal:</span>
                                        <span>{formatPrice(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                        <span>Shipping:</span>
                                        <span>{formatPrice(order.shipping_cost)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                        <span>Tax (18%):</span>
                                        <span>{formatPrice(order.tax)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xl font-semibold text-slate-900 dark:text-white mb-6">
                                    <span>Total:</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>

                                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">Payment Method</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method?.toUpperCase()}
                                    </p>
                                    {order.payment_transaction_id && (
                                        <p className="text-xs text-slate-500 dark:text-slate-500">
                                            Transaction ID: {order.payment_transaction_id}
                                        </p>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
