<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductSize extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'size',
        'stock',
    ];

    protected $casts = [
        'stock' => 'integer',
    ];

    /**
     * Get the product that owns this size.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
