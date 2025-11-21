import { Head, Link, router } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, Search, SlidersHorizontal, X, ChevronDown, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function ProductsIndex({ products, categories, filters }: any) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
    const [sortBy, setSortBy] = useState(filters?.sort || '');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    // Handle search/filter changes
    const applyFilters = () => {
        router.get('/products', {
            search: search || undefined,
            category: selectedCategory || undefined,
            sort: sortBy || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setSortBy('');
        router.get('/products');
    };

    // Auto-apply filters on change (debounced search)
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== filters?.search) {
                applyFilters();
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        if (selectedCategory !== filters?.category || sortBy !== filters?.sort) {
            applyFilters();
        }
    }, [selectedCategory, sortBy]);

    const renderStars = (product: any) => {
        const avgRating = product.ratings?.length > 0
            ? product.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / product.ratings.length
            : 0;
        const roundedRating = Math.round(avgRating);
        const reviewCount = product.ratings?.length || 0;

        return (
            <div className="flex items-center gap-1 mb-3">
                <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-3 h-3 ${i < roundedRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                        />
                    ))}
                </div>
                <span className="text-xs text-slate-500">({reviewCount})</span>
            </div>
        );
    };

    return (
        <StorefrontLayout>
            <Head title="Shop - BussnessIdea" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Discover Products</h1>
                        <p className="text-blue-100 text-lg">Browse our curated collection from top boutiques</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex gap-8">
                        {/* Left Sidebar - Desktop */}
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <div className="sticky top-4 space-y-6">
                                {/* Search */}
                                <Card className="p-4">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                        <Search className="w-4 h-4" />
                                        Search
                                    </h3>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </Card>

                                {/* Categories */}
                                <Card className="p-4">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Categories</h3>
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => setSelectedCategory('')}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                                                selectedCategory === ''
                                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-medium'
                                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            All Categories
                                        </button>
                                        {categories
                                            .filter((cat: any) => cat.children && cat.children.length > 0)
                                            .map((cat: any) => (
                                            <div key={cat.id}>
                                                {cat.children && cat.children.length > 0 ? (
                                                    // Parent category with children - collapsible
                                                    <>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => toggleCategory(cat.id.toString())}
                                                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
                                                            >
                                                                {expandedCategories[cat.id] ? (
                                                                    <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                                ) : (
                                                                    <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => setSelectedCategory(cat.id.toString())}
                                                                className={`flex-1 text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                                    selectedCategory === cat.id.toString()
                                                                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                                }`}
                                                            >
                                                                {cat.name}
                                                            </button>
                                                        </div>
                                                        {expandedCategories[cat.id] && (
                                                            <div className="ml-8 mt-1 space-y-1">
                                                                {cat.children.map((subcat: any) => (
                                                                    <button
                                                                        key={subcat.id}
                                                                        onClick={() => setSelectedCategory(subcat.id.toString())}
                                                                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition ${
                                                                            selectedCategory === subcat.id.toString()
                                                                                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium'
                                                                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                                                                        }`}
                                                                    >
                                                                        {subcat.name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => setSelectedCategory(cat.id.toString())}
                                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                            selectedCategory === cat.id.toString()
                                                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                                        }`}
                                                    >
                                                        {cat.name}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Sort */}
                                <Card className="p-4">
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Sort By</h3>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Newest First</option>
                                        <option value="price_low">Price: Low to High</option>
                                        <option value="price_high">Price: High to Low</option>
                                        <option value="rating_high">Best Reviews</option>
                                        <option value="newest">Newest</option>
                                    </select>
                                </Card>

                                {/* Clear Filters */}
                                {(search || selectedCategory || sortBy) && (
                                    <Button
                                        onClick={clearFilters}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <div className="flex-1">
                            {/* Mobile Filter Button */}
                            <div className="lg:hidden mb-6">
                                <Button
                                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                                </Button>
                            </div>

                            {/* Mobile Filters */}
                            {showMobileFilters && (
                                <div className="lg:hidden mb-6 space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Categories</option>
                                        {categories
                                            .filter((cat: any) => cat.children && cat.children.length > 0)
                                            .map((cat: any) => (
                                                <optgroup key={cat.id} label={cat.name}>
                                                    {cat.children.map((subcat: any) => (
                                                        <option key={subcat.id} value={subcat.id}>
                                                            {subcat.name}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                    </select>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Newest First</option>
                                        <option value="price_low">Price: Low to High</option>
                                        <option value="price_high">Price: High to Low</option>
                                        <option value="rating_high">Best Reviews</option>
                                        <option value="newest">Newest</option>
                                    </select>
                                    {(search || selectedCategory || sortBy) && (
                                        <Button onClick={clearFilters} variant="outline" className="w-full">
                                            Clear All Filters
                                        </Button>
                                    )}
                                </div>
                            )}

                            {/* Results Count */}
                            <div className="mb-6 text-sm text-slate-600 dark:text-slate-400">
                                Showing {products.data?.length || 0} of {products.total || 0} products
                            </div>

                            {/* Product Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                                {products.data?.map((product: any) => (
                                    <Link key={product.id} href={`/products/${product.id}`}>
                                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer group">
                                            {/* Image Container */}
                                            <div className="relative overflow-hidden bg-slate-200 dark:bg-slate-700 h-48">
                                                {product.image_path ? (
                                                    <img
                                                        src={`/storage/${product.image_path}`}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                                                )}
                                                <button className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900 transition">
                                                    <Heart className="w-5 h-5 text-slate-400 hover:text-red-500" />
                                                </button>
                                                {(() => {
                                                    // Calculate total stock from all sizes
                                                    const totalStock = product.product_sizes?.reduce((sum: number, ps: any) => sum + ps.stock, 0) || product.stock || 0;
                                                    return totalStock <= 5 && (
                                                        <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                            {totalStock === 0 ? 'Out of Stock' : `Only ${totalStock} left`}
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 flex-1 flex flex-col">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{product.category?.name || 'Uncategorized'}</p>
                                                <h3 className="font-bold text-sm line-clamp-2 mb-2 text-slate-900 dark:text-white">{product.title}</h3>

                                                {/* Rating */}
                                                {renderStars(product)}

                                                {/* Price and CTA */}
                                                <div className="mt-auto">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-2xl font-bold text-blue-600">{formatPrice(product.price)}</span>
                                                        <span className="text-xs text-slate-500">{product.views} views</span>
                                                    </div>
                                                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm">
                                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>

                            {/* Empty State */}
                            {products.data?.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="text-6xl mb-4">📦</div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-6">Try adjusting your search or filters</p>
                                    <Button onClick={clearFilters} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Clear Filters</Button>
                                </div>
                            )}

                            {/* Pagination */}
                            {products.links && products.links.length > 3 && (
                                <div className="mt-12 flex justify-center gap-2 flex-wrap">
                                    {products.links.map((link: any, i: number) => {
                                        const isActive = link.active;
                                        const label = link.label.replace(/&laquo;/, '«').replace(/&raquo;/, '»');

                                        return (
                                            <div key={i}>
                                                {link.url ? (
                                                    <Link href={link.url} preserveScroll preserveState>
                                                        <Button
                                                            variant={isActive ? 'default' : 'outline'}
                                                            className={isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' : ''}
                                                        >
                                                            {label}
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        disabled
                                                        className="text-slate-400"
                                                    >
                                                        {label}
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
