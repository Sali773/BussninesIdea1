import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type SizeStock = {
    size: string;
    stock: number;
};

export default function ProductCreate({ boutiques, categories }: any) {
    const { data, setData, post, errors, processing } = useForm({
        boutique_id: '',
        category_id: '',
        title: '',
        description: '',
        price: '',
        sizeStocks: [] as SizeStock[],
        image: null as File | null,
    });

    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const handleSizeToggle = (size: string) => {
        const existingIndex = data.sizeStocks.findIndex(s => s.size === size);
        if (existingIndex >= 0) {
            // Remove size
            setData('sizeStocks', data.sizeStocks.filter(s => s.size !== size));
        } else {
            // Add size with 0 stock
            setData('sizeStocks', [...data.sizeStocks, { size, stock: 0 }]);
        }
    };

    const handleSizeStockChange = (size: string, stock: number) => {
        setData('sizeStocks', data.sizeStocks.map(s =>
            s.size === size ? { ...s, stock } : s
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/products', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Add New Product - Admin" />

            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/products">
                        <Button variant="outline" size="sm" className="mb-4">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Products
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Add New Product</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Add a product to any boutique on the platform
                    </p>
                </div>

                <div className="max-w-3xl">
                    <Card className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Boutique Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Select Boutique *
                                </label>
                                <select
                                    value={data.boutique_id}
                                    onChange={(e) => setData('boutique_id', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Choose a boutique...</option>
                                    {boutiques.map((boutique: any) => (
                                        <option key={boutique.id} value={boutique.id}>
                                            {boutique.name} - {boutique.user.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.boutique_id && (
                                    <p className="text-red-600 text-sm mt-1">{errors.boutique_id}</p>
                                )}
                            </div>

                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Choose a category...</option>
                                    {categories.map((category: any) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="text-red-600 text-sm mt-1">{errors.category_id}</p>
                                )}
                            </div>

                            {/* Product Title */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Product Title *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Cotton T-Shirt"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe the product..."
                                    required
                                />
                                {errors.description && (
                                    <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Price (MKD) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 1200"
                                    required
                                />
                                {errors.price && (
                                    <p className="text-red-600 text-sm mt-1">{errors.price}</p>
                                )}
                            </div>

                            {/* Sizes */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Available Sizes (Click to add, set stock for each)
                                </label>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => handleSizeToggle(size)}
                                            className={`px-4 py-2 rounded-lg border-2 transition ${
                                                data.sizeStocks.some(s => s.size === size)
                                                    ? 'bg-blue-600 border-blue-600 text-white'
                                                    : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-500'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>

                                {/* Stock inputs for selected sizes */}
                                {data.sizeStocks.length > 0 && (
                                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                            Stock Quantity per Size
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {data.sizeStocks.map((sizeStock) => (
                                                <div key={sizeStock.size}>
                                                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                                                        {sizeStock.size}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={sizeStock.stock}
                                                        onChange={(e) => handleSizeStockChange(sizeStock.size, parseInt(e.target.value) || 0)}
                                                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Qty"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {errors.sizeStocks && (
                                    <p className="text-red-600 text-sm mt-1">{errors.sizeStocks}</p>
                                )}
                            </div>

                            {/* Product Image */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Product Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files?.[0] || null)}
                                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.image && (
                                    <p className="text-red-600 text-sm mt-1">{errors.image}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                >
                                    {processing ? 'Adding Product...' : 'Add Product'}
                                </Button>
                                <Link href="/admin/products">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
