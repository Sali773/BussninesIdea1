<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\Boutique;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition(): array
    {
        $product = Product::factory()->create();
        $unitPrice = $product->price;
        $quantity = $this->faker->numberBetween(1, 5);

        return [
            'order_id' => Order::factory(),
            'product_id' => $product->id,
            'boutique_id' => $product->boutique_id,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'total' => $unitPrice * $quantity,
        ];
    }
}
