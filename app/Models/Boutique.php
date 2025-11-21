<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Boutique extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'logo_path',
        'banner_path',
        'email',
        'phone',
        'address',
        'city',
        'country',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function orderItems(): HasMany
    {
        // Get all order items for this boutique directly
        return $this->hasMany(OrderItem::class);
    }

    public function orders(): HasManyThrough
    {
        // Get orders through order_items
        // This creates a relationship: Boutique -> OrderItem -> Order
        return $this->hasManyThrough(
            Order::class,        // The final model we want to access
            OrderItem::class,    // The intermediate model
            'boutique_id',       // Foreign key on the order_items table
            'id',                // Foreign key on the orders table
            'id',                // Local key on the boutiques table
            'order_id'           // Local key on the order_items table
        )->distinct();
    }
}
