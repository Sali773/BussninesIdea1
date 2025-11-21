<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\Rating;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RatingController extends Controller
{
    public function create(Product $product)
    {
        // Check if user has purchased this product
        $hasPurchased = Order::whereHas('items', function ($query) use ($product) {
            $query->where('product_id', $product->id);
        })->where('user_id', auth()->id())->exists();

        return Inertia::render('Ratings/Create', [
            'product' => $product,
            'hasPurchased' => $hasPurchased,
        ]);
    }

    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
        ]);

        // Check if already rated
        $existingRating = Rating::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->first();

        if ($existingRating) {
            return back()->with('error', 'You have already rated this product');
        }

        // Find order that contains this product (for verified purchase badge)
        $order = Order::where('user_id', auth()->id())
            ->whereHas('items', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })
            ->first();

        Rating::create([
            'user_id' => auth()->id(),
            'product_id' => $product->id,
            'order_id' => $order?->id,
            'rating' => $validated['rating'],
            'review' => $validated['review'],
            'is_verified_purchase' => $order !== null,
        ]);

        return back()->with('success', 'Rating added successfully');
    }

    public function destroy(Rating $rating)
    {
        $this->authorize('delete', $rating);

        $rating->delete();

        return back()->with('success', 'Rating deleted successfully');
    }
}
