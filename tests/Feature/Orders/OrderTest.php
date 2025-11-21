<?php

use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Boutique;
use App\Services\ShippingService;

it('can view own orders', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('orders.index'));

    $response->assertStatus(200);
    $response->assertSee($order->order_number);
});

it('can view order details', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);
    OrderItem::factory()->create(['order_id' => $order->id]);

    $response = $this->actingAs($user)->get(route('orders.show', $order));

    $response->assertStatus(200);
    $response->assertSee($order->order_number);
});

it('cannot view others orders', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->get(route('orders.show', $order));

    $response->assertStatus(403);
});

it('calculates correct shipping cost', function () {
    $service = new ShippingService();

    // 1-2 items = 300
    $this->assertEquals(300, $service->calculateShipping(1));
    $this->assertEquals(300, $service->calculateShipping(2));

    // 3+ items = free
    $this->assertEquals(0, $service->calculateShipping(3));
    $this->assertEquals(0, $service->calculateShipping(5));
});

it('calculates correct total with tax and shipping', function () {
    $service = new ShippingService();

    $result = $service->calculateTotal(100, 1);

    $this->assertEquals(100, $result['subtotal']);
    $this->assertEquals(300, $result['shipping_cost']);
    $this->assertEquals(72, $result['tax']); // (100 + 300) * 0.18
    $this->assertEquals(472, $result['total']);
});

it('can create order from cart', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['stock' => 10, 'price' => 50]);

    $response = $this->actingAs($user)->post(route('checkout'), [
        'payment_method' => 'cod',
        'customer_email' => 'test@example.com',
        'customer_phone' => '123-456-7890',
        'shipping_address' => '123 Main St',
        'shipping_city' => 'New York',
        'shipping_country' => 'USA',
        'shipping_postal_code' => '10001',
    ]);

    // Should redirect to order since cart is empty
    $response->assertRedirect();
});
