<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'payment_method',
        'subtotal',
        'shipping_cost',
        'tax',
        'total',
        'total_commission',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'shipping_city',
        'shipping_country',
        'shipping_postal_code',
        'payment_transaction_id',
        'paid_at',
        'shipped_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'float',
            'shipping_cost' => 'float',
            'tax' => 'float',
            'total' => 'float',
            'total_commission' => 'float',
            'paid_at' => 'datetime',
            'shipped_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function generateOrderNumber(): string
    {
        return 'ORD-' . date('YmdHis') . '-' . random_int(1000, 9999);
    }
}
