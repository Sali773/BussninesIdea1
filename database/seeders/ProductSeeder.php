<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductSize;
use App\Models\Boutique;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $boutiques = Boutique::all();
        $categories = Category::all();

        if ($boutiques->isEmpty() || $categories->isEmpty()) {
            return;
        }

        $products = [
            [
                'title' => 'Designer Blazer',
                'description' => 'Classic wool blazer perfect for formal occasions',
                'price' => 5999, // MKD
                'sizes' => [
                    'S' => 8,
                    'M' => 12,
                    'L' => 15,
                    'XL' => 10,
                ]
            ],
            [
                'title' => 'Premium Jeans',
                'description' => 'High-quality denim with modern fit',
                'price' => 2699, // MKD
                'sizes' => [
                    'S' => 15,
                    'M' => 20,
                    'L' => 18,
                    'XL' => 12,
                    'XXL' => 8,
                ]
            ],
            [
                'title' => 'Silk Blouse',
                'description' => 'Elegant silk top for professional wear',
                'price' => 4499, // MKD
                'sizes' => [
                    'XS' => 5,
                    'S' => 10,
                    'M' => 12,
                    'L' => 8,
                ]
            ],
            [
                'title' => 'Leather Jacket',
                'description' => 'Genuine leather jacket with premium finish',
                'price' => 8999, // MKD
                'sizes' => [
                    'M' => 6,
                    'L' => 10,
                    'XL' => 8,
                    'XXL' => 4,
                ]
            ],
            [
                'title' => 'Summer Dress',
                'description' => 'Light and breezy summer dress',
                'price' => 2399, // MKD
                'sizes' => [
                    'XS' => 8,
                    'S' => 15,
                    'M' => 18,
                    'L' => 12,
                    'XL' => 7,
                ]
            ],
            [
                'title' => 'Wool Coat',
                'description' => 'Warm winter coat with elegant design',
                'price' => 7499, // MKD
                'sizes' => [
                    'M' => 5,
                    'L' => 8,
                    'XL' => 10,
                    'XXL' => 6,
                ]
            ],
            [
                'title' => 'Cotton T-Shirt',
                'description' => 'Comfortable everyday cotton t-shirt',
                'price' => 899, // MKD
                'sizes' => [
                    'S' => 25,
                    'M' => 30,
                    'L' => 28,
                    'XL' => 20,
                    'XXL' => 15,
                ]
            ],
            [
                'title' => 'Cashmere Sweater',
                'description' => 'Luxurious cashmere sweater',
                'price' => 6299, // MKD
                'sizes' => [
                    'S' => 6,
                    'M' => 10,
                    'L' => 8,
                    'XL' => 5,
                ]
            ],
            [
                'title' => 'Denim Skirt',
                'description' => 'Classic denim skirt with modern cut',
                'price' => 1799, // MKD
                'sizes' => [
                    'XS' => 7,
                    'S' => 12,
                    'M' => 15,
                    'L' => 10,
                ]
            ],
            [
                'title' => 'Sports Hoodie',
                'description' => 'Comfortable sports hoodie for active lifestyle',
                'price' => 2199, // MKD
                'sizes' => [
                    'S' => 18,
                    'M' => 22,
                    'L' => 20,
                    'XL' => 16,
                    'XXL' => 12,
                ]
            ],
        ];

        foreach ($boutiques as $boutique) {
            foreach ($products as $productData) {
                // Create unique slug by adding boutique ID
                $baseSlug = Str::slug($productData['title']);
                $uniqueSlug = $baseSlug . '-' . $boutique->id;

                // Create the product
                $product = Product::create([
                    'boutique_id' => $boutique->id,
                    'category_id' => $categories->random()->id,
                    'title' => $productData['title'] . ' - ' . $boutique->name,
                    'slug' => $uniqueSlug,
                    'description' => $productData['description'],
                    'price' => $productData['price'],
                    'stock' => 0, // Stock is managed per size
                    'is_active' => true,
                ]);

                // Create product sizes with individual stock
                foreach ($productData['sizes'] as $size => $stock) {
                    ProductSize::create([
                        'product_id' => $product->id,
                        'size' => $size,
                        'stock' => $stock,
                    ]);
                }
            }
        }
    }
}
