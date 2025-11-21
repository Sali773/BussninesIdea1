<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'boutique_id',
        'size',
        'quantity',
        'unit_price',
        'total',
        'commission_amount',
        'commission_rate',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'float',
            'total' => 'float',
            'commission_amount' => 'float',
            'commission_rate' => 'float',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function boutique(): BelongsTo
    {
        return $this->belongsTo(Boutique::class);
    }
}
