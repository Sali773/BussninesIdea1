import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Trash2, Edit2, Package, Eye, Store, Search, X } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function AdminProducts({ products, filters }: any) {
    const [processing, setProcessing] = useState(false);
    const [search, setSearch] = useState(filters?.search || '');

    const deleteProduct = (productId: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setProcessing(true);
            router.delete(`/products/${productId}`, {
                onFinish: () => setProcessing(false)
            });
        }
    };

    // Sync search state with filters when filters change (e.g., from pagination)
    useEffect(() => {
        setSearch(filters?.search || '');
    }, [filters?.search]);

    // Debounced search - only triggers when user types
    useEffect(() => {
        // Don't trigger if search matches current filter (prevents loop)
        if (search === (filters?.search || '')) {
            return;
        }

        const timeout = setTimeout(() => {
            router.get('/admin/products', { search: search || undefined }, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const clearSearch = () => {
        setSearch('');
        router.get('/admin/products');
    };

    return (
        <AppLayout>
            <Head title="Manage Products" />

            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                {/* Header */}
                <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">Manage Products</h1>
                                <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">Total: {products.total} product{products.total !== 1 ? 's' : ''}</p>
                            </div>
                            <div className="flex gap-3">
                                <Button asChild>
                                    <Link href="/admin/products/create">+ Add Product</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/admin/dashboard">Back to Dashboard</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                id="product-search"
                                name="search"
                                type="text"
                                placeholder="Search products by title or description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {search && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                            Showing {products.data?.length || 0} of {products.total || 0} products
                        </p>
                    </div>

                    {products.data.length === 0 ? (
                        <Card className="p-8 text-center">
                            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600 dark:text-slate-400 text-lg">
                                {search ? 'No products found matching your search' : 'No products found'}
                            </p>
                            {search && (
                                <Button onClick={clearSearch} variant="outline" className="mt-4">
                                    Clear Search
                                </Button>
                            )}
                        </Card>
                    ) : (
                        <>
                            {/* Product Grid - 4 columns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.data.map((product: any) => (
                                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                                        {/* Product Image */}
                                        <div className="relative bg-slate-200 dark:bg-slate-700 h-48 overflow-hidden group">
                                            {product.image_path ? (
                                                <img
                                                    src={`/storage/${product.image_path}`}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-12 h-12 text-slate-400" />
                                                </div>
                                            )}

                                            {/* Quick Actions Overlay */}
                                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button asChild size="sm" className="h-8 w-8 p-0">
                                                    <Link href={`/products/${product.id}/edit`}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => deleteProduct(product.id)}
                                                    disabled={processing}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Stock Badge */}
                                            <div className="absolute top-2 left-2">
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                                    product.total_stock > 0
                                                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                                                        : 'bg-red-500 text-white'
                                                }`}>
                                                    {product.total_stock > 0 ? `${product.total_stock} in stock` : 'Out of stock'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Product Info */}
                                        <div className="p-4 flex-1 flex flex-col">
                                            {/* Boutique */}
                                            <div className="flex items-center gap-1.5 mb-2">
                                                <Store className="w-3 h-3 text-slate-500" />
                                                <span className="text-xs text-slate-500 dark:text-slate-400">{product.boutique.name}</span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                                                {product.title}
                                            </h3>

                                            {/* Category */}
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                                                {product.category?.name || 'N/A'}
                                            </p>

                                            {/* Price and Views */}
                                            <div className="mt-auto">
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {formatPrice(parseFloat(product.price))}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                                        <Eye className="w-3 h-3" />
                                                        <span>{product.views || 0}</span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    <Button asChild size="sm" variant="outline" className="flex-1">
                                                        <Link href={`/products/${product.id}/edit`}>
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => deleteProduct(product.id)}
                                                        disabled={processing}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {products.links && (
                                <div className="mt-8 flex justify-center gap-2 flex-wrap">
                                    {products.links.map((link: any, i: number) => (
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 ${
                                                    link.active
                                                        ? 'bg-slate-900 text-white hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900'
                                                        : 'border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={i}
                                                className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 opacity-50 pointer-events-none h-9 px-4 py-2"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
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
