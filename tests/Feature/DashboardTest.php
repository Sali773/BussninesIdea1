<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users are redirected to products page', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertRedirect(route('products.index'));
});

test('admin users are redirected to admin dashboard', function () {
    $this->actingAs($user = User::factory()->create(['is_admin' => true]));

    $this->get(route('dashboard'))->assertRedirect(route('admin.dashboard'));
});

test('seller users are redirected to seller dashboard', function () {
    $this->actingAs($user = User::factory()->create(['is_seller' => true]));

    $this->get(route('dashboard'))->assertRedirect(route('seller.dashboard'));
});