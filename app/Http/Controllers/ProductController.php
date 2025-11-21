<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['boutique', 'category', 'ratings', 'productSizes'])
            ->where('is_active', true);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $selectedCategory = Category::find($request->category);

            if ($selectedCategory) {
                // If the selected category has children (is a parent category)
                // Include products from both parent and all child categories
                if ($selectedCategory->children()->exists()) {
                    $categoryIds = $selectedCategory->children()->pluck('id')->push($selectedCategory->id);
                    $query->whereIn('category_id', $categoryIds);
                } else {
                    // Otherwise, just filter by this specific category
                    $query->where('category_id', $request->category);
                }
            }
        }

        // Price sorting and other sort options
        if ($request->filled('sort')) {
            if ($request->sort === 'price_low') {
                $query->orderBy('price', 'asc');
            } elseif ($request->sort === 'price_high') {
                $query->orderBy('price', 'desc');
            } elseif ($request->sort === 'rating_high') {
                // Sort by average rating
                $query->withAvg('ratings', 'rating')->orderByDesc('ratings_avg_rating');
            } elseif ($request->sort === 'newest') {
                $query->latest();
            }
        } else {
            $query->latest();
        }

        $products = $query->paginate(12)->withQueryString();

        // Get all categories with their children
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'sort' => $request->sort,
            ],
        ]);
    }

    public function sellerProducts(Request $request)
    {
        // Get all boutiques owned by the authenticated user
        $boutiqueIds = $request->user()->boutiques()->pluck('id');

        // Get products from those boutiques
        $products = Product::with(['boutique', 'category'])
            ->whereIn('boutique_id', $boutiqueIds)
            ->latest()
            ->paginate(12);

        $categories = Category::all();

        return Inertia::render('Seller/Products', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['boutique', 'category', 'ratings.user', 'productSizes']);
        $product->increment('views');

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        // Check if user has already rated this product
        $hasRated = auth()->check()
            ? $product->ratings()->where('user_id', auth()->id())->exists()
            : false;

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'averageRating' => $product->averageRating(),
            'ratingCount' => $product->ratingCount(),
            'hasRated' => $hasRated,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Product::class);

        $categories = Category::all();
        $boutiques = auth()->user()->boutiques;

        return Inertia::render('Products/Create', [
            'categories' => $categories,
            'boutiques' => $boutiques,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Product::class);

        $validated = $request->validate([
            'boutique_id' => 'required|exists:boutiques,id',
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0.01',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,bmp,svg|max:2048',
            'sizes' => 'nullable|array',
            'sizes.*' => 'integer|min:0',
        ]);

        // Verify boutique belongs to user
        $boutique = auth()->user()->boutiques()->findOrFail($validated['boutique_id']);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        // Generate unique slug
        $baseSlug = Str::slug($validated['title']);
        $slug = $baseSlug;
        $counter = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $product = Product::create([
            'boutique_id' => $validated['boutique_id'],
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'slug' => $slug,
            'description' => $validated['description'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'image_path' => $imagePath,
        ]);

        // Create product sizes if provided
        if ($request->has('sizes')) {
            foreach ($request->sizes as $size => $stock) {
                if ($stock > 0) {
                    $product->productSizes()->create([
                        'size' => $size,
                        'stock' => $stock,
                    ]);
                }
            }
        }

        return redirect()->route('products.show', $product)->with('success', 'Product created successfully');
    }

    public function edit(Product $product)
    {
        $this->authorize('update', $product);

        $product->load('productSizes');

        $categories = Category::all();
        $boutiques = auth()->user()->boutiques;

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'boutiques' => $boutiques,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $this->authorize('update', $product);

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0.01',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp,bmp,svg|max:2048',
            'sizes' => 'nullable|array',
            'sizes.*' => 'integer|min:0',
        ]);

        // Generate unique slug (only if title changed)
        $baseSlug = Str::slug($validated['title']);
        $slug = $baseSlug;
        $counter = 1;

        while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        // Prepare update data
        $updateData = [
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'slug' => $slug,
        ];

        // Only update image if a new one was uploaded
        if ($request->hasFile('image')) {
            $updateData['image_path'] = $request->file('image')->store('products', 'public');
        }

        $product->update($updateData);

        // Update product sizes
        if ($request->has('sizes')) {
            // Delete existing sizes
            $product->productSizes()->delete();

            // Create new sizes
            foreach ($request->sizes as $size => $stock) {
                if ($stock > 0) {
                    $product->productSizes()->create([
                        'size' => $size,
                        'stock' => $stock,
                    ]);
                }
            }
        }

        return redirect()->route('products.show', $product)->with('success', 'Product updated successfully');
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully');
    }
}
