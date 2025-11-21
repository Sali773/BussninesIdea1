import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/storefront-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState, FormEvent } from 'react';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Ruler, Info } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

const SIZE_GUIDES = {
    EU: { S: '36-38', M: '40-42', L: '44-46', XL: '48-50', XXL: '52-54' },
    US: { S: '4-6', M: '8-10', L: '12-14', XL: '16-18', XXL: '20-22' },
    UK: { S: '8-10', M: '12-14', L: '16-18', XL: '20-22', XXL: '24-26' },
};

export default function ProductShow({ product, relatedProducts, averageRating, ratingCount, hasRated }: any) {
    const { auth } = usePage().props as any;
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    // Get available sizes from productSizes relationship
    const productSizes = product.product_sizes || [];
    const hasProductSizes = productSizes.length > 0;

    // Get selected size stock
    const selectedSizeStock = selectedSize
        ? productSizes.find((ps: any) => ps.size === selectedSize)?.stock || 0
        : product.stock;

    const { data: reviewData, setData: setReviewData, post: postReview, processing: reviewProcessing, reset } = useForm({
        rating: 0,
        review: '',
    });

    const handleAddToCart = () => {
        if (hasProductSizes && !selectedSize) {
            alert('Please select a size');
            return;
        }

        if (hasProductSizes && selectedSizeStock === 0) {
            alert('This size is out of stock');
            return;
        }

        if (hasProductSizes && quantity > selectedSizeStock) {
            alert(`Only ${selectedSizeStock} items available for size ${selectedSize}`);
            return;
        }

        router.post('/cart/add', {
            product_id: product.id,
            quantity,
            size: selectedSize,
        }, {
            onSuccess: () => {
                setQuantity(1);
                setSelectedSize('');
            },
        });
    };

    const handleSubmitReview = (e: FormEvent) => {
        e.preventDefault();
        if (reviewData.rating === 0) {
            alert('Please select a rating');
            return;
        }

        postReview(`/products/${product.id}/rate`, {
            onSuccess: () => {
                reset();
            },
        });
    };

    const sizeGuideType = product.size_guide || 'EU';

    return (
        <StorefrontLayout>
            <Head title={product.title} />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Breadcrumb */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-slate-600 dark:text-slate-400">
                    <Link href="/" className="hover:text-blue-600">Home</Link> / <Link href="/products" className="hover:text-blue-600">Shop</Link> / {product.title}
                </div>

                {/* Product Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
                        {/* Image Gallery */}
                        <div className="flex items-start">
                            <Card className="w-full overflow-hidden">
                                {product.image_path ? (
                                    <img
                                        src={`/storage/${product.image_path}`}
                                        alt={product.title}
                                        className="w-full h-auto object-cover bg-slate-100 dark:bg-slate-800"
                                    />
                                ) : (
                                    <div className="w-full h-96 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                        <span className="text-slate-400">No image available</span>
                                    </div>
                                )}
                            </Card>
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-col">
                            {/* Header */}
                            <div className="mb-6">
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{product.category?.name || 'Uncategorized'}</p>
                                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">{product.title}</h1>

                                {/* Rating */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={18}
                                                    className={i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})</span>
                                    </div>
                                    <span className="text-sm text-slate-500">({product.views} views)</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-baseline gap-3 mb-2">
                                    <span className="text-4xl font-bold text-blue-600">{formatPrice(product.price)}</span>
                                </div>
                                {hasProductSizes ? (
                                    selectedSize ? (
                                        <p className={`text-sm ${selectedSizeStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedSizeStock > 0 ? `${selectedSizeStock} in stock (Size ${selectedSize})` : `Size ${selectedSize} is out of stock`}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-slate-600">Select a size to check availability</p>
                                    )
                                ) : (
                                    <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Description</h3>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{product.description}</p>
                            </div>

                            {/* Size Selection */}
                            {hasProductSizes && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Ruler className="w-5 h-5" />
                                            Select Size
                                        </h3>
                                        <Dialog open={showSizeGuide} onOpenChange={setShowSizeGuide}>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                                    <Info className="w-4 h-4 mr-1" />
                                                    Size Guide
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Size Guide ({sizeGuideType})</DialogTitle>
                                                </DialogHeader>
                                                <div className="py-4">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="border-b">
                                                                <th className="text-left py-2">Size</th>
                                                                <th className="text-left py-2">{sizeGuideType} Size</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Object.entries(SIZE_GUIDES[sizeGuideType as keyof typeof SIZE_GUIDES] || SIZE_GUIDES.EU).map(([size, measurement]) => (
                                                                <tr key={size} className="border-b">
                                                                    <td className="py-2 font-medium">{size}</td>
                                                                    <td className="py-2">{measurement}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {productSizes.map((ps: any) => {
                                            const isOutOfStock = ps.stock === 0;
                                            const isSelected = selectedSize === ps.size;

                                            return (
                                                <button
                                                    key={ps.size}
                                                    onClick={() => !isOutOfStock && setSelectedSize(ps.size)}
                                                    disabled={isOutOfStock}
                                                    className={`px-4 py-2 border rounded-lg transition relative ${
                                                        isSelected
                                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                                            : isOutOfStock
                                                            ? 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                                            : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
                                                    }`}
                                                >
                                                    {ps.size}
                                                    {!isOutOfStock && (
                                                        <span className="ml-2 text-xs text-slate-500">({ps.stock})</span>
                                                    )}
                                                    {isOutOfStock && (
                                                        <span className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-xs text-red-500">Out</span>
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Add to Cart */}
                            <div className="mb-8 flex gap-3">
                                <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={selectedSizeStock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(selectedSizeStock, parseInt(e.target.value) || 1)))}
                                        className="w-16 text-center bg-transparent text-slate-900 dark:text-white focus:outline-none"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(selectedSizeStock, quantity + 1))}
                                        disabled={quantity >= selectedSizeStock}
                                        className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
                                    >
                                        +
                                    </button>
                                </div>
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={(hasProductSizes && !selectedSize) || selectedSizeStock === 0}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                    size="lg"
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Add to Cart
                                </Button>
                                <Button variant="outline" size="lg" className="p-2">
                                    <Heart className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <Truck className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                    <p className="text-xs font-medium text-slate-900 dark:text-white">Free Shipping</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                    <p className="text-xs font-medium text-slate-900 dark:text-white">Secure Payment</p>
                                </div>
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <RotateCcw className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                    <p className="text-xs font-medium text-slate-900 dark:text-white">Easy Returns</p>
                                </div>
                            </div>

                            {/* Seller Info */}
                            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Sold by</h4>
                                <p className="text-slate-700 dark:text-slate-300 font-medium">{product.boutique?.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{product.boutique?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Customer Reviews</h2>

                        {/* Add Review Form */}
                        {auth?.user && !hasRated ? (
                            <Card className="p-6 mb-6">
                                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Your Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewData('rating', star)}
                                                    className="focus:outline-none"
                                                >
                                                    <Star
                                                        size={32}
                                                        className={star <= reviewData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Your Review (Optional)</label>
                                        <textarea
                                            value={reviewData.review}
                                            onChange={(e) => setReviewData('review', e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                            placeholder="Share your experience with this product..."
                                        />
                                    </div>
                                    <Button type="submit" disabled={reviewProcessing}>
                                        {reviewProcessing ? 'Submitting...' : 'Submit Review'}
                                    </Button>
                                </form>
                            </Card>
                        ) : auth?.user && hasRated ? (
                            <Card className="p-6 mb-6 bg-slate-50 dark:bg-slate-800">
                                <p className="text-slate-600 dark:text-slate-400">You have already reviewed this product. Thank you for your feedback!</p>
                            </Card>
                        ) : null}

                        {/* Reviews List */}
                        {product.ratings?.length > 0 ? (
                            <div className="grid gap-4">
                                {product.ratings.map((rating: any) => (
                                    <Card key={rating.id} className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <strong className="text-slate-900 dark:text-white">{rating.user?.name}</strong>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={i < rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {rating.review && <p className="text-slate-600 dark:text-slate-400">{rating.review}</p>}
                                        {rating.is_verified_purchase && (
                                            <span className="inline-block mt-2 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                                                Verified Purchase
                                            </span>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 dark:text-slate-400">No reviews yet. Be the first to review this product!</p>
                        )}
                    </div>

                    {/* Related Products */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Related Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {relatedProducts.map((p: any) => (
                                <Link key={p.id} href={`/products/${p.id}`}>
                                    <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer">
                                        {p.image_path && (
                                            <img src={`/storage/${p.image_path}`} alt={p.title} className="w-full h-40 object-cover" />
                                        )}
                                        <div className="p-2">
                                            <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{p.title}</h4>
                                            <p className="text-lg font-bold text-blue-600">{formatPrice(p.price)}</p>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
