<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Order $order): bool
    {
        // Customer can view their own orders
        if ($user->id === $order->user_id) {
            return true;
        }

        // Boutique owner can view orders containing their products
        if ($user->boutiques()->count() > 0) {
            $hasItems = $order->items()->whereIn('boutique_id', $user->boutiques()->pluck('id'))->exists();
            return (bool) $hasItems;
        }

        // Admin can view all orders
        return (bool) $user->is_admin;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Order $order): bool
    {
        return $user->is_admin;
    }

    public function delete(User $user, Order $order): bool
    {
        return $user->is_admin;
    }
}
