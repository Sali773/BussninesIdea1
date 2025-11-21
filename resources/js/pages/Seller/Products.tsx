import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function SellerProducts({ products, categories }: any) {
    return (
        <StorefrontLayout>
            <Head title="My Products" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold">My Products</h1>
                                <p className="text-blue-100 mt-2">Manage your boutique products</p>
                            </div>
                            <Link href="/products/create">
                                <Button className="bg-white text-blue-600 hover:bg-blue-50">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Add Product
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {products.data.length === 0 ? (
                        <Card className="p-12 text-center">
                            <Package className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                No products yet
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Start by creating your first product
                            </p>
                            <Link href="/products/create">
                                <Button>
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create Product
                                </Button>
                            </Link>
                        </Card>
                    ) : (
                        <>
                            {/* Products Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {products.data.map((product: any) => (
                                    <Card key={product.id} className="overflow-hidden group hover:shadow-xl transition-shadow">
                                        <Link href={`/products/${product.id}`}>
                                            <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                                {product.image_path ? (
                                                    <img
                                                        src={`/storage/${product.image_path}`}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-16 h-16 text-slate-400" />
                                                    </div>
                                                )}
                                                {product.stock === 0 && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                        <span className="text-white font-bold text-lg">Out of Stock</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>

                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <Link href={`/products/${product.id}`}>
                                                        <h3 className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2">
                                                            {product.title}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                        {product.boutique.name}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                    {formatPrice(product.price)}
                                                </span>
                                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                                    Stock: {product.stock}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 mt-4">
                                                <Link href={`/products/${product.id}/edit`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        <Edit className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Link href={`/products/${product.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-3">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="w-3 h-3" />
                                                    {product.views} views
                                                </span>
                                                <span>•</span>
                                                <span>{product.category.name}</span>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {products.links && products.links.length > 3 && (
                                <div className="flex justify-center gap-2">
                                    {products.links.map((link: any, index: number) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 rounded-lg border transition ${
                                                link.active
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : link.url
                                                    ? 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700'
                                                    : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </StorefrontLayout>
    );
}
