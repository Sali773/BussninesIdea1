<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'boutique_id',
        'category_id',
        'title',
        'slug',
        'description',
        'price',
        'stock',
        'sizes',
        'size_guide',
        'image_path',
        'is_active',
        'views',
    ];

    protected $appends = ['total_stock'];

    protected function casts(): array
    {
        return [
            'price' => 'float',
            'is_active' => 'boolean',
            'sizes' => 'array',
        ];
    }

    public function boutique(): BelongsTo
    {
        return $this->belongsTo(Boutique::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function productSizes(): HasMany
    {
        return $this->hasMany(ProductSize::class);
    }

    public function averageRating(): float
    {
        return $this->ratings()->avg('rating') ?? 0;
    }

    public function ratingCount(): int
    {
        return $this->ratings()->count();
    }

    /**
     * Get total stock across all sizes
     */
    public function getTotalStockAttribute(): int
    {
        return $this->productSizes()->sum('stock');
    }
}
