import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/currency';

export default function BoutiquesShow({ boutique, products, auth }: any) {
    const isOwner = auth.user?.id === boutique.user_id;

    return (
        <StorefrontLayout>
            <Head title={boutique.name} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Boutique Header */}
                {boutique.banner_path && (
                    <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                        <img
                            src={`/storage/${boutique.banner_path}`}
                            alt={boutique.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Boutique Info */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">{boutique.name}</h1>
                            {boutique.description && (
                                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                                    {boutique.description}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-6 text-sm">
                                {boutique.city && <p>📍 {boutique.city}, {boutique.country}</p>}
                                {boutique.email && <p>📧 {boutique.email}</p>}
                                {boutique.phone && <p>📱 {boutique.phone}</p>}
                            </div>
                        </div>

                        {isOwner && (
                            <div className="space-y-2">
                                <Button asChild variant="outline">
                                    <Link href={`/boutiques/${boutique.id}/edit`}>Edit Boutique</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={`/products/create?boutique_id=${boutique.id}`}>
                                        Add Product
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Products Section */}
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold mb-8">Products</h2>

                        {products.data.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.data.map((product: any) => (
                                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition cursor-pointer">
                                        <Link href={`/products/${product.id}`}>
                                            {product.image_path && (
                                                <img
                                                    src={`/storage/${product.image_path}`}
                                                    alt={product.title}
                                                    className="w-full h-48 object-cover"
                                                />
                                            )}
                                            <div className="p-4">
                                                <h3 className="font-bold text-lg mb-2">{product.title}</h3>
                                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                    {formatPrice(parseFloat(product.price))}
                                                </p>
                                            </div>
                                        </Link>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="p-8 text-center">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    No products available yet
                                </p>
                                {isOwner && (
                                    <Button asChild>
                                        <Link href={`/products/create?boutique_id=${boutique.id}`}>
                                            Add First Product
                                        </Link>
                                    </Button>
                                )}
                            </Card>
                        )}

                        {/* Pagination */}
                        {products.links && (
                            <div className="mt-8 flex justify-between items-center">
                                {products.links.prev && (
                                    <Link
                                        href={products.links.prev}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                                    >
                                        Previous
                                    </Link>
                                )}
                                <div className="flex gap-2">
                                    {Array.from({ length: products.last_page }).map((_, i) => (
                                        <Link
                                            key={i + 1}
                                            href={`/boutiques/${boutique.id}?page=${i + 1}`}
                                            className={`px-3 py-2 rounded-lg ${
                                                products.current_page === i + 1
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 dark:bg-gray-700'
                                            }`}
                                        >
                                            {i + 1}
                                        </Link>
                                    ))}
                                </div>
                                {products.links.next && (
                                    <Link
                                        href={products.links.next}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
