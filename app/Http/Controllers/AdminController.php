<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Boutique;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductSize;
use App\Models\Rating;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function __construct()
    {
        // Admin middleware is handled at the route level in routes/web.php
        // This constructor doesn't need to define middleware
    }

    public function dashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'total_boutiques' => Boutique::count(),
            'total_products' => Product::count(),
            'total_orders' => Order::count(),
            'total_revenue' => (float) Order::sum('total'),
            'pending_orders' => Order::where('status', 'pending')->count(),
        ];

        $recentOrders = Order::with('user')->latest()->limit(5)->get();
        $recentBoutiques = Boutique::with('user')->latest()->limit(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'recentBoutiques' => $recentBoutiques,
        ]);
    }

    public function users()
    {
        $users = User::paginate(15);

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function toggleAdmin(User $user)
    {
        $user->update(['is_admin' => !$user->is_admin]);

        return back()->with('success', 'User admin status updated');
    }

    public function boutiques()
    {
        $boutiques = Boutique::with('user')->paginate(15);

        return Inertia::render('Admin/Boutiques', [
            'boutiques' => $boutiques,
        ]);
    }

    public function createBoutique()
    {
        $users = User::orderBy('name')->get();

        return Inertia::render('Admin/BoutiqueCreate', [
            'users' => $users,
        ]);
    }

    public function storeBoutique(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Boutique::create($validated);

        return redirect()->route('admin.boutiques')->with('success', 'Boutique created successfully');
    }

    public function toggleBoutique(Boutique $boutique)
    {
        $boutique->update(['is_active' => !$boutique->is_active]);

        return back()->with('success', 'Boutique status updated');
    }

    public function products(Request $request)
    {
        $query = Product::with(['boutique', 'category', 'productSizes']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        $products = $query->latest()->paginate(15)->withQueryString();

        // Append total_stock to each product
        $products->getCollection()->transform(function ($product) {
            $product->total_stock = $product->productSizes->sum('stock');
            return $product;
        });

        return Inertia::render('Admin/Products', [
            'products' => $products,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }

    public function createProduct()
    {
        $boutiques = Boutique::with('user')->where('is_active', true)->get();
        $categories = Category::all();

        return Inertia::render('Admin/ProductCreate', [
            'boutiques' => $boutiques,
            'categories' => $categories,
        ]);
    }

    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'boutique_id' => 'required|exists:boutiques,id',
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'sizeStocks' => 'required|array|min:1',
            'sizeStocks.*.size' => 'required|string',
            'sizeStocks.*.stock' => 'required|integer|min:0',
            'image' => 'nullable|image|max:2048',
        ]);

        // Generate unique slug
        $baseSlug = Str::slug($validated['title']);
        $slug = $baseSlug;
        $counter = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $validated['slug'] = $slug;
        $validated['is_active'] = true;

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('products', 'public');
        }

        // Create the product (stock set to 0, actual stock is in product_sizes table)
        $product = Product::create([
            'boutique_id' => $validated['boutique_id'],
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'slug' => $validated['slug'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'stock' => 0, // Stock is managed per size in product_sizes table
            'image_path' => $validated['image_path'] ?? null,
            'is_active' => $validated['is_active'],
        ]);

        // Create product sizes (now required - at least one size must be provided)
        foreach ($validated['sizeStocks'] as $sizeStock) {
            ProductSize::create([
                'product_id' => $product->id,
                'size' => $sizeStock['size'],
                'stock' => $sizeStock['stock'],
            ]);
        }

        return redirect()->route('admin.products')->with('success', 'Product added successfully');
    }

    public function orders()
    {
        $orders = Order::with('user', 'items')->latest()->paginate(15);

        return Inertia::render('Admin/Orders', [
            'orders' => $orders,
        ]);
    }

    public function showOrder(Order $order)
    {
        $order->load(['user', 'items.product', 'items.boutique']);

        return Inertia::render('Admin/OrderDetail', [
            'order' => $order,
        ]);
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,paid,processing,shipped,completed,cancelled',
        ]);

        $order->update($validated);

        return back()->with('success', 'Order status updated');
    }

    public function reviews()
    {
        $reviews = Rating::with(['user', 'product', 'order'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Reviews', [
            'reviews' => $reviews,
        ]);
    }

    public function deleteReview(Rating $rating)
    {
        $rating->delete();

        return back()->with('success', 'Review deleted successfully');
    }

    public function commissions()
    {
        $boutiques = Boutique::with(['user', 'orderItems.order'])
            ->withCount('orderItems')
            ->get()
            ->map(function ($boutique) {
                $orderItems = $boutique->orderItems;

                $totalSales = $orderItems->sum('total');
                $totalCommission = $orderItems->sum('commission_amount');
                $totalOrders = $orderItems->pluck('order_id')->unique()->count();

                // Count payment methods
                $codOrders = $orderItems->filter(function ($item) {
                    return $item->order->payment_method === 'cod';
                })->pluck('order_id')->unique()->count();

                $onlineOrders = $orderItems->filter(function ($item) {
                    return in_array($item->order->payment_method, ['stripe', 'paypal']);
                })->pluck('order_id')->unique()->count();

                // Calculate COD and Online sales
                $codSales = $orderItems->filter(function ($item) {
                    return $item->order->payment_method === 'cod';
                })->sum('total');

                $onlineSales = $orderItems->filter(function ($item) {
                    return in_array($item->order->payment_method, ['stripe', 'paypal']);
                })->sum('total');

                $codCommission = $orderItems->filter(function ($item) {
                    return $item->order->payment_method === 'cod';
                })->sum('commission_amount');

                $onlineCommission = $orderItems->filter(function ($item) {
                    return in_array($item->order->payment_method, ['stripe', 'paypal']);
                })->sum('commission_amount');

                return [
                    'id' => $boutique->id,
                    'name' => $boutique->name,
                    'owner' => $boutique->user->name,
                    'is_active' => $boutique->is_active,
                    'total_sales' => $totalSales,
                    'total_commission' => $totalCommission,
                    'boutique_earnings' => $totalSales - $totalCommission,
                    'total_orders' => $totalOrders,
                    'cod_orders' => $codOrders,
                    'online_orders' => $onlineOrders,
                    'cod_sales' => $codSales,
                    'online_sales' => $onlineSales,
                    'cod_commission' => $codCommission,
                    'online_commission' => $onlineCommission,
                ];
            })
            ->sortByDesc('total_sales')
            ->values();

        return Inertia::render('Admin/Commissions', [
            'boutiques' => $boutiques,
            'summary' => [
                'total_platform_commission' => $boutiques->sum('total_commission'),
                'total_sales' => $boutiques->sum('total_sales'),
                'total_cod_commission' => $boutiques->sum('cod_commission'),
                'total_online_commission' => $boutiques->sum('online_commission'),
            ],
        ]);
    }
}
