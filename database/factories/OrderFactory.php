<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 3000, 30000); // MKD (3,000 to 30,000 den)
        $shipping = $this->faker->randomFloat(2, 0, 300); // MKD (0 to 300 den)
        $tax = ($subtotal + $shipping) * 0.18;
        $total = $subtotal + $shipping + $tax;

        return [
            'user_id' => User::factory(),
            'order_number' => 'ORD-' . date('YmdHis') . '-' . random_int(1000, 9999),
            'status' => $this->faker->randomElement(['pending', 'paid', 'processing', 'shipped', 'completed']),
            'payment_method' => $this->faker->randomElement(['stripe', 'paypal', 'cod']),
            'subtotal' => $subtotal,
            'shipping_cost' => $shipping,
            'tax' => $tax,
            'total' => $total,
            'customer_email' => $this->faker->email(),
            'customer_phone' => $this->faker->phoneNumber(),
            'shipping_address' => $this->faker->address(),
            'shipping_city' => $this->faker->city(),
            'shipping_country' => $this->faker->country(),
            'shipping_postal_code' => $this->faker->postcode(),
        ];
    }
}
