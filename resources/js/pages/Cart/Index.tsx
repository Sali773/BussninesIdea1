import { Head, Link, useForm, router } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function CartIndex({ cartItems, subtotal }: any) {
    const shipping = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0) >= 3 ? 0 : 300; // 300 MKD shipping fee
    const tax = (subtotal + shipping) * 0.18;
    const total = subtotal + shipping + tax;

    const updateQuantity = (cartKey: string, quantity: number) => {
        router.patch('/cart/update', { cart_key: cartKey, quantity }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const removeItem = (cartKey: string) => {
        router.post('/cart/remove', { cart_key: cartKey }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    if (cartItems.length === 0) {
        return (
            <StorefrontLayout>
                <Head title="Shopping Cart" />
                <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
                    <div className="text-center max-w-md">
                        <div className="text-6xl mb-4">🛒</div>
                        <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Cart is Empty</h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">Your shopping cart is empty. Start shopping now!</p>
                        <Link href={'/products'}>
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </StorefrontLayout>
        );
    }

    return (
        <StorefrontLayout>
            <Head title="Shopping Cart" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <h1 className="text-3xl sm:text-4xl font-bold">Shopping Cart</h1>
                        <p className="text-blue-100 mt-2">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items */}
                        <div className="lg:col-span-2">
                            <div className="space-y-4">
                                {cartItems.map((item: any) => (
                                    <Card key={item.cart_key} className="p-5 hover:shadow-md transition">
                                        <div className="flex items-center gap-4">
                                            {/* Product Image - Clickable */}
                                            <Link href={`/products/${item.id}`} className="flex-shrink-0">
                                                {item.image_path ? (
                                                    <img
                                                        src={`/storage/${item.image_path}`}
                                                        alt={item.title}
                                                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-slate-200 dark:bg-slate-700 hover:opacity-80 transition cursor-pointer"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center hover:opacity-80 transition cursor-pointer">
                                                        <ShoppingCart className="w-8 h-8 text-slate-400" />
                                                    </div>
                                                )}
                                            </Link>

                                            {/* Product Info - Clickable */}
                                            <Link href={`/products/${item.id}`} className="flex-1 min-w-0 cursor-pointer">
                                                <h3 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white truncate hover:text-blue-600 transition">{item.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {item.size && (
                                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                                            Size: <span className="font-medium">{item.size}</span>
                                                        </span>
                                                    )}
                                                    {item.size && <span className="text-sm text-slate-400">•</span>}
                                                    <span className="text-sm font-semibold text-blue-600">{formatPrice(item.price)}</span>
                                                </div>
                                            </Link>

                                            {/* Quantity Selector */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item.cart_key, Math.max(1, item.quantity - 1))}
                                                    className="p-2 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                                >
                                                    <Minus className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.cart_key, Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="w-14 text-center px-2 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item.cart_key, item.quantity + 1)}
                                                    className="p-2 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                                >
                                                    <Plus className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                </button>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="text-right min-w-[90px]">
                                                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{formatPrice(item.total)}</p>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => removeItem(item.cart_key)}
                                                className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition text-slate-400 hover:text-red-600 flex-shrink-0"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div>
                            <Card className="p-6 sticky top-20">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Subtotal:</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span className="text-sm">Shipping:</span>
                                        <span className="text-sm">
                                            {shipping === 0 ? (
                                                <span className="text-green-600 font-semibold">Free</span>
                                            ) : (
                                                formatPrice(shipping)
                                            )}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-500">
                                        {cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0) >= 3
                                            ? '✓ Free shipping on 3+ items'
                                            : `${3 - cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)} more items for free shipping`}
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Tax (18%):</span>
                                        <span>{formatPrice(tax)}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between text-2xl font-bold text-slate-900 dark:text-white mb-8">
                                    <span>Total:</span>
                                    <span className="text-blue-600">{formatPrice(total)}</span>
                                </div>

                                <Link href="/checkout" className="block">
                                    <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mb-3">
                                        Proceed to Checkout
                                    </Button>
                                </Link>
                                <Link href={'/products'}>
                                    <Button variant="outline" className="w-full">
                                        Continue Shopping
                                    </Button>
                                </Link>

                                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                                    <div className="flex items-start gap-2">
                                        <span>✓</span>
                                        <span>Secure checkout with SSL encryption</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span>✓</span>
                                        <span>Free returns within 30 days</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
