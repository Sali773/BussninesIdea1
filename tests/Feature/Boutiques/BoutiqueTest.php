<?php

use App\Models\User;
use App\Models\Boutique;

it('can view all active boutiques', function () {
    Boutique::factory(3)->create(['is_active' => true]);

    $response = $this->get(route('boutiques.index'));

    $response->assertStatus(200);
});

it('can view a boutique', function () {
    $boutique = Boutique::factory()->create();

    $response = $this->get(route('boutiques.show', $boutique));

    $response->assertStatus(200);
    $response->assertSee($boutique->name);
});

it('can create a boutique if authenticated as admin', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $businessOwner = User::factory()->create();

    $response = $this->actingAs($admin)->post(route('boutiques.store'), [
        'user_id' => $businessOwner->id,
        'name' => 'My Boutique',
        'description' => 'A great boutique',
        'email' => 'boutique@example.com',
        'phone' => '123-456-7890',
        'address' => '123 Main St',
        'city' => 'New York',
        'country' => 'USA',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('boutiques', ['name' => 'My Boutique', 'user_id' => $businessOwner->id]);
});

it('can update own boutique as admin', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $boutique = Boutique::factory()->create(['user_id' => $admin->id]);

    $response = $this->actingAs($admin)->patch(route('boutiques.update', $boutique), [
        'name' => 'Updated Name',
        'description' => 'Updated Description',
        'email' => 'updated@example.com',
        'phone' => '987-654-3210',
        'address' => '456 Oak Ave',
        'city' => 'Los Angeles',
        'country' => 'USA',
    ]);

    $response->assertRedirect();
    $boutique->refresh();
    $this->assertEquals('Updated Name', $boutique->name);
});

it('non-admin cannot update any boutique', function () {
    $user = User::factory()->create();
    $admin = User::factory()->create(['is_admin' => true]);
    $boutique = Boutique::factory()->create(['user_id' => $admin->id]);

    $response = $this->actingAs($user)->patch(route('boutiques.update', $boutique), [
        'name' => 'Hacked Name',
    ]);

    // Non-admin users are redirected by admin middleware
    $response->assertRedirect();
});

it('can delete own boutique as admin', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $boutique = Boutique::factory()->create(['user_id' => $admin->id]);

    $response = $this->actingAs($admin)->delete(route('boutiques.destroy', $boutique));

    $response->assertRedirect();
    $this->assertModelMissing($boutique);
});
