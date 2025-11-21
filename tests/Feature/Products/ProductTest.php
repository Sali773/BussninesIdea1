<?php

use App\Models\User;
use App\Models\Product;
use App\Models\Boutique;
use App\Models\Category;

it('can view all products', function () {
    Product::factory(5)->create();

    $response = $this->get(route('products.index'));

    $response->assertStatus(200);
});

it('can view a single product', function () {
    $product = Product::factory()->create();

    $response = $this->get(route('products.show', $product));

    $response->assertStatus(200);
    $response->assertSee($product->title);
});

it('can create a product if authorized', function () {
    $user = User::factory()->create();
    $boutique = Boutique::factory()->create(['user_id' => $user->id]);
    $category = Category::factory()->create();

    $response = $this->actingAs($user)->post(route('products.store'), [
        'boutique_id' => $boutique->id,
        'category_id' => $category->id,
        'title' => 'Test Product',
        'description' => 'Test Description',
        'price' => 99.99,
        'stock' => 10,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('products', ['title' => 'Test Product']);
});

it('cannot create product without boutique', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();

    $response = $this->actingAs($user)->post(route('products.store'), [
        'boutique_id' => 999,
        'category_id' => $category->id,
        'title' => 'Test Product',
        'price' => 99.99,
        'stock' => 10,
    ]);

    $response->assertStatus(403); // Unauthorized
});

it('can delete own product', function () {
    $user = User::factory()->create();
    $product = Product::factory()
        ->for(Boutique::factory(['user_id' => $user->id]))
        ->create();

    $response = $this->actingAs($user)->delete(route('products.destroy', $product));

    $response->assertRedirect();
    $this->assertModelMissing($product);
});

it('increments product views', function () {
    $product = Product::factory()->create(['views' => 0]);

    $this->get(route('products.show', $product));

    $product->refresh();
    $this->assertEquals(1, $product->views);
});
