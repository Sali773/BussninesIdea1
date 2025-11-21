<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Boutique;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $title = $this->faker->words(3, true);

        return [
            'boutique_id' => Boutique::factory(),
            'category_id' => Category::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 600, 30000), // MKD prices (600 den to 30,000 den)
            'stock' => $this->faker->numberBetween(0, 100),
            'is_active' => true,
        ];
    }
}
