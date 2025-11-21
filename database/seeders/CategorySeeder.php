<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Men's Clothing Category
        $menClothing = Category::create([
            'name' => "Men's Clothing",
            'slug' => Str::slug("Men's Clothing"),
            'description' => 'Clothing for men',
        ]);

        $menSubcategories = [
            "Men's T-Shirts",
            "Men's Shirts",
            "Men's Hoodies & Sweatshirts",
            "Men's Jackets & Coats",
            "Men's Sweaters",
            "Men's Jeans",
            "Men's Pants / Trousers",
            "Men's Shorts",
            "Men's Tracksuits",
            "Men's Suits & Blazers",
        ];

        foreach ($menSubcategories as $subcategory) {
            Category::create([
                'name' => $subcategory,
                'slug' => Str::slug($subcategory),
                'description' => $subcategory,
                'parent_id' => $menClothing->id,
            ]);
        }

        // Women's Clothing Category
        $womenClothing = Category::create([
            'name' => "Women's Clothing",
            'slug' => Str::slug("Women's Clothing"),
            'description' => 'Clothing for women',
        ]);

        $womenSubcategories = [
            "Women's T-Shirts & Tops",
            "Women's Shirts & Blouses",
            "Women's Dresses",
            "Women's Hoodies & Sweatshirts",
            "Women's Jackets & Coats",
            "Women's Sweaters & Knits",
            "Women's Jeans",
            "Women's Pants / Trousers",
            "Women's Skirts",
            "Women's Shorts",
            "Women's Activewear",
            "Women's Loungewear",
        ];

        foreach ($womenSubcategories as $subcategory) {
            Category::create([
                'name' => $subcategory,
                'slug' => Str::slug($subcategory),
                'description' => $subcategory,
                'parent_id' => $womenClothing->id,
            ]);
        }

        // Other Top-Level Categories
        $otherCategories = [
            ["Men's Shoes", 'Footwear for men'],
            ["Men's Accessories", 'Accessories for men including belts, ties, and watches'],
            ["Women's Shoes", 'Footwear for women'],
            ["Women's Accessories", 'Accessories for women including bags, jewelry, and scarves'],
            ['Bags & Luggage', 'Backpacks, handbags, and travel bags'],
            ['Jewelry', 'Rings, necklaces, bracelets, and earrings'],
        ];

        foreach ($otherCategories as $category) {
            Category::create([
                'name' => $category[0],
                'slug' => Str::slug($category[0]),
                'description' => $category[1],
            ]);
        }
    }
}
