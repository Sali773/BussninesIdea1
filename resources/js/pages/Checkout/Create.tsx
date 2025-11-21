import { Head, useForm, Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { Lock, Truck, Shield, ArrowLeft } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function CheckoutCreate({ cartItems, subtotal, shipping, tax, total }: any) {
    const { data, setData, post, errors, processing } = useForm({
        payment_method: 'cod',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
        shipping_city: '',
        shipping_country: '',
        shipping_postal_code: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout');
    };

    return (
        <StorefrontLayout>
            <Head title="Checkout" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Link href="/cart" className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-4 transition">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Cart
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-bold">Secure Checkout</h1>
                        <p className="text-blue-100 mt-2">Complete your purchase</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Checkout Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Shipping Information */}
                                <Card className="p-6">
                                    <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={data.customer_email}
                                                onChange={(e) => setData('customer_email', e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                                            />
                                            {errors.customer_email && (
                                                <p className="text-red-600 text-sm mt-1">{errors.customer_email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                required
                                                value={data.customer_phone}
                                                onChange={(e) => setData('customer_phone', e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                                            />
                                            {errors.customer_phone && (
                                                <p className="text-red-600 text-sm mt-1">{errors.customer_phone}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2">Address</label>
                                            <input
                                                type="text"
                                                required
                                                value={data.shipping_address}
                                                onChange={(e) => setData('shipping_address', e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                                            />
                                            {errors.shipping_address && (
                                                <p className="text-red-600 text-sm mt-1">{errors.shipping_address}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold mb-2">City</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={data.shipping_city}
                                                    onChange={(e) => setData('shipping_city', e.target.value)}
                                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                                                />
                                                {errors.shipping_city && (
                                                    <p className="text-red-600 text-sm mt-1">{errors.shipping_city}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold mb-2">Country</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={data.shipping_country}
                                                    onChange={(e) => setData('shipping_country', e.target.value)}
                                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                                                />
                                                {errors.shipping_country && (
                                                    <p className="text-red-600 text-sm mt-1">{errors.shipping_country}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold mb-2">Postal Code</label>
                                            <input
                                                type="text"
                                                required
                                                value={data.shipping_postal_code}
                                                onChange={(e) => setData('shipping_postal_code', e.target.value)}
                                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800"
                                            />
                                            {errors.shipping_postal_code && (
                                                <p className="text-red-600 text-sm mt-1">{errors.shipping_postal_code}</p>
                                            )}
                                        </div>
                                    </div>
                                </Card>

                                {/* Payment Method */}
                                <Card className="p-6">
                                    <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                                    <div className="space-y-3">
                                        {['cod', 'stripe', 'paypal'].map((method) => (
                                            <label key={method} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value={method}
                                                    checked={data.payment_method === method}
                                                    onChange={(e) => setData('payment_method', e.target.value)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="font-semibold">
                                                    {method === 'cod' ? 'Cash on Delivery' : method.charAt(0).toUpperCase() + method.slice(1)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <Card className="p-6 sticky top-20">
                                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                                    {/* Cart Items */}
                                    <div className="mb-6 pb-4 border-b">
                                        <h3 className="font-semibold mb-3 text-sm">Items ({cartItems.length})</h3>
                                        <div className="space-y-3">
                                            {cartItems.map((item: any) => (
                                                <Link key={item.cart_key} href={`/products/${item.id}`} className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-2 -m-2 rounded-lg transition cursor-pointer">
                                                    {item.image_path && (
                                                        <img
                                                            src={`/storage/${item.image_path}`}
                                                            alt={item.title}
                                                            className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                                                        />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate hover:text-blue-600 transition">{item.title}</p>
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-0.5">
                                                            {item.size && (
                                                                <>
                                                                    <span>Size: {item.size}</span>
                                                                    <span>•</span>
                                                                </>
                                                            )}
                                                            <span>{item.quantity}x {formatPrice(item.price)}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-semibold whitespace-nowrap">
                                                        {formatPrice(item.total)}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Totals */}
                                    <div className="space-y-2 mb-4 pb-4 border-b">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal:</span>
                                            <span>{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Shipping:</span>
                                            <span>{formatPrice(shipping)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Tax (18%):</span>
                                            <span>{formatPrice(tax)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold mb-6">
                                        <span>Total:</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                    <Button type="submit" size="lg" className="w-full" disabled={processing}>
                                        {processing ? 'Processing...' : 'Place Order'}
                                    </Button>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </StorefrontLayout>
    );
}
