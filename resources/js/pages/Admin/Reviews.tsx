import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Trash2, AlertCircle, CheckCircle, Search, User, Package, Calendar, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function AdminReviews({ reviews }: any) {
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [ratingFilter, setRatingFilter] = useState<string>('all');

    const handleDelete = (ratingId: number) => {
        if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
            setDeletingId(ratingId);
            router.delete(`/admin/reviews/${ratingId}`, {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                    />
                ))}
            </div>
        );
    };

    // Filter and search logic
    const filteredReviews = useMemo(() => {
        let filtered = reviews.data || [];

        // Filter by rating
        if (ratingFilter !== 'all') {
            const targetRating = parseInt(ratingFilter);
            filtered = filtered.filter((review: any) => review.rating === targetRating);
        }

        // Search by user name, product title, or review text
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((review: any) =>
                review.user?.name.toLowerCase().includes(query) ||
                review.product?.title.toLowerCase().includes(query) ||
                review.review?.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [reviews.data, ratingFilter, searchQuery]);

    // Count reviews by rating
    const ratingCounts = useMemo(() => {
        const data = reviews.data || [];
        return {
            all: data.length,
            5: data.filter((r: any) => r.rating === 5).length,
            4: data.filter((r: any) => r.rating === 4).length,
            3: data.filter((r: any) => r.rating === 3).length,
            2: data.filter((r: any) => r.rating === 2).length,
            1: data.filter((r: any) => r.rating === 1).length,
        };
    }, [reviews.data]);

    return (
        <AppLayout>
            <Head title="Reviews Management" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Reviews Management</h1>
                                <p className="text-blue-100 mt-1 sm:mt-2 text-sm sm:text-base">
                                    Total: {reviews.total || 0} review{reviews.total !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
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
                                id="review-search"
                                name="search"
                                type="text"
                                placeholder="Search by user, product, or review content..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 text-base bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600"
                            />
                        </div>

                        {/* Rating Filter Chips */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                            <button
                                onClick={() => setRatingFilter('all')}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    ratingFilter === 'all'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-blue-400'
                                }`}
                            >
                                All Reviews ({ratingCounts.all})
                            </button>
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => setRatingFilter(rating.toString())}
                                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                                        ratingFilter === rating.toString()
                                            ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700'
                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:border-yellow-400'
                                    }`}
                                >
                                    <Star className={`w-3.5 h-3.5 ${ratingFilter === rating.toString() ? 'fill-current' : ''}`} />
                                    {rating} ({ratingCounts[rating as keyof typeof ratingCounts]})
                                </button>
                            ))}
                        </div>

                        {/* Results count */}
                        {(searchQuery || ratingFilter !== 'all') && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Showing {filteredReviews.length} of {reviews.data?.length || 0} reviews
                                </p>
                                {(searchQuery || ratingFilter !== 'all') && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setRatingFilter('all');
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {filteredReviews.length === 0 ? (
                        <Card className="p-8 sm:p-12 text-center">
                            <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-600 dark:text-slate-400 text-lg">No reviews found</p>
                        </Card>
                    ) : (
                        <>
                            {/* Mobile: Horizontal Scrollable Cards */}
                            <div className="lg:hidden">
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 px-1">
                                    {filteredReviews.length > 1 ? 'Swipe left/right to see all reviews →' : ''}
                                </p>
                                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
                                    {filteredReviews.map((review: any) => (
                                        <Card key={review.id} className="flex-shrink-0 w-[85vw] max-w-sm snap-center shadow-lg">
                                            <div className="p-5">
                                                {/* User Header */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        <User className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                                        <h3 className="font-bold text-slate-900 dark:text-white truncate">
                                                            {review.user?.name}
                                                        </h3>
                                                    </div>
                                                    {review.is_verified_purchase && (
                                                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full flex-shrink-0">
                                                            <CheckCircle className="w-3 h-3" />
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Rating Stars */}
                                                <div className="mb-3">
                                                    {renderStars(review.rating)}
                                                </div>

                                                {/* Review Text */}
                                                {review.review && (
                                                    <p className="text-slate-700 dark:text-slate-300 mb-4 text-sm line-clamp-3">
                                                        {review.review}
                                                    </p>
                                                )}

                                                {/* Product Info */}
                                                <div className="space-y-2 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Package className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                                        <Link
                                                            href={`/products/${review.product?.id}`}
                                                            className="text-blue-600 hover:underline truncate"
                                                        >
                                                            {review.product?.title}
                                                        </Link>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        <span className="text-slate-600 dark:text-slate-400">
                                                            {new Date(review.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <Button
                                                    onClick={() => handleDelete(review.id)}
                                                    variant="outline"
                                                    className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                                                    disabled={deletingId === review.id}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    {deletingId === review.id ? 'Deleting...' : 'Delete Review'}
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop: Card Grid */}
                            <div className="hidden lg:grid lg:grid-cols-1 gap-4">
                                {filteredReviews.map((review: any) => (
                                    <Card key={review.id} className="hover:shadow-xl transition-shadow">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between gap-4">
                                                {/* Review Content */}
                                                <div className="flex-1 min-w-0">
                                                    {/* User Header */}
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <User className="w-4 h-4 text-slate-500" />
                                                        <h3 className="font-bold text-slate-900 dark:text-white">
                                                            {review.user?.name}
                                                        </h3>
                                                        {review.is_verified_purchase && (
                                                            <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                                                                <CheckCircle className="w-3 h-3" />
                                                                Verified Purchase
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Rating Stars */}
                                                    <div className="mb-3">
                                                        {renderStars(review.rating)}
                                                    </div>

                                                    {/* Review Text */}
                                                    {review.review && (
                                                        <p className="text-slate-700 dark:text-slate-300 mb-4">
                                                            {review.review}
                                                        </p>
                                                    )}

                                                    {/* Product Info */}
                                                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                                                        <div className="flex items-center gap-2">
                                                            <Package className="w-4 h-4" />
                                                            <Link
                                                                href={`/products/${review.product?.id}`}
                                                                className="text-blue-600 hover:underline"
                                                            >
                                                                {review.product?.title}
                                                            </Link>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex-shrink-0">
                                                    <Button
                                                        onClick={() => handleDelete(review.id)}
                                                        variant="outline"
                                                        className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                                                        disabled={deletingId === review.id}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        {deletingId === review.id ? 'Deleting...' : 'Delete'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {reviews.links && reviews.links.length > 3 && (
                                <div className="mt-8 flex justify-center gap-2 flex-wrap">
                                    {reviews.links.map((link: any, i: number) => (
                                        <div key={i}>
                                            {link.url ? (
                                                <Link href={link.url} preserveScroll preserveState>
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
