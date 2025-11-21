import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormEvent } from 'react';

export default function ProductEdit({ product, categories, boutiques }: any) {
    // Initialize sizes from product_sizes or with empty values
    const initialSizes = {
        S: '',
        M: '',
        L: '',
        XL: '',
        XXL: '',
    };

    // Populate with existing size stock if available
    if (product.product_sizes && product.product_sizes.length > 0) {
        product.product_sizes.forEach((ps: any) => {
            if (ps.size in initialSizes) {
                initialSizes[ps.size as keyof typeof initialSizes] = ps.stock.toString();
            }
        });
    }

    const { data, setData, patch, processing, errors } = useForm({
        category_id: product.category_id,
        title: product.title,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        image: null as File | null,
        sizes: initialSizes,
    });

    const calculateTotalStock = () => {
        return Object.values(data.sizes).reduce((sum, value) => {
            const num = parseInt(value as string) || 0;
            return sum + num;
        }, 0);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Create a proper data object for submission
        const submitData: any = {
            category_id: data.category_id,
            title: data.title,
            description: data.description || '',
            price: data.price,
            stock: calculateTotalStock(),
        };

        // Add sizes data (only non-zero values)
        const sizesData: any = {};
        Object.entries(data.sizes).forEach(([size, stock]) => {
            const stockValue = parseInt(stock as string) || 0;
            if (stockValue > 0) {
                sizesData[size] = stockValue;
            }
        });

        if (Object.keys(sizesData).length > 0) {
            submitData.sizes = sizesData;
        }

        // Add image if present
        if (data.image) {
            submitData.image = data.image;
        }

        patch(`/products/${product.id}`, submitData, {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <Head title={`Edit ${product.title}`} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-2xl mx-auto px-4 py-12">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                            Dashboard
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link href={`/products/${product.id}`} className="text-blue-600 hover:text-blue-800">
                            {product.title}
                        </Link>
                        <span className="text-gray-400">/</span>
                        <h1 className="text-3xl font-bold">Edit Product</h1>
                    </div>

                    <Card className="p-8">
                        {/* Current Image */}
                        {product.image_path && (
                            <div className="mb-6">
                                <p className="text-sm font-medium mb-2">Current Image</p>
                                <img
                                    src={`/storage/${product.image_path}`}
                                    alt={product.title}
                                    className="h-40 w-40 object-cover rounded-lg border"
                                />
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Category Selection */}
                            <div>
                                <label htmlFor="category_id" className="block text-sm font-medium mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category: any) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
                                )}
                            </div>

                            {/* Product Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium mb-2">
                                    Product Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter product title"
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter product description"
                                    rows={4}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Price */}
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium mb-2">
                                    Price <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                    required
                                />
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                                )}
                            </div>

                            {/* Size Stock */}
                            <div>
                                <label className="block text-sm font-medium mb-3">
                                    Stock by Size
                                </label>
                                <div className="grid grid-cols-5 gap-4">
                                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                        <div key={size}>
                                            <label htmlFor={`size-${size}`} className="block text-xs font-medium mb-1 text-slate-600 dark:text-slate-400">
                                                {size}
                                            </label>
                                            <input
                                                id={`size-${size}`}
                                                name={`size-${size}`}
                                                type="number"
                                                min="0"
                                                value={data.sizes[size as keyof typeof data.sizes]}
                                                onChange={(e) => setData('sizes', { ...data.sizes, [size]: e.target.value })}
                                                placeholder="0"
                                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-center"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Total Stock: <span className="text-lg font-bold">{calculateTotalStock()}</span> units
                                    </p>
                                </div>
                            </div>

                            {/* Product Image */}
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium mb-2">
                                    Update Product Image
                                </label>
                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Leave empty to keep current image. Supported formats: JPEG, PNG, JPG, GIF, WebP, BMP, SVG (Max 2MB)
                                </p>
                                {errors.image && (
                                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-6">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={`/products/${product.id}`}>Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
