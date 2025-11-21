<?php

namespace App\Http\Controllers;

use App\Models\Boutique;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Redirect to appropriate dashboard based on user role
     */
    public function redirect()
    {
        $user = auth()->user();

        // Admin redirects to admin dashboard
        if ($user->is_admin) {
            return redirect()->route('admin.dashboard');
        }

        // Sellers/Business owners redirect to seller dashboard
        if ($user->is_seller) {
            return redirect()->route('seller.dashboard');
        }

        // Regular customers go to products page
        return redirect()->route('products.index');
    }

    /**
     * Seller/Boutique owner dashboard with analytics
     */
    public function seller()
    {
        $user = auth()->user();

        // Get seller's boutiques with orders
        $boutiques = $user->boutiques()->with([
            'products',
            'orders.user',
            'orders.items'
        ])->get();
        $boutique_ids = $boutiques->pluck('id')->toArray();

        // Sales analytics
        $totalSales = (float) Order::whereHas('items', function ($query) use ($boutique_ids) {
            $query->whereIn('boutique_id', $boutique_ids);
        })->sum('total');

        $totalOrders = Order::whereHas('items', function ($query) use ($boutique_ids) {
            $query->whereIn('boutique_id', $boutique_ids);
        })->count();

        $totalProducts = Product::whereIn('boutique_id', $boutique_ids)->count();

        $totalViews = Product::whereIn('boutique_id', $boutique_ids)->sum('views');

        // Recent orders
        $recentOrders = Order::whereHas('items', function ($query) use ($boutique_ids) {
            $query->whereIn('boutique_id', $boutique_ids);
        })->with('user', 'items.product')->latest()->limit(5)->get();

        // Top products
        $topProducts = Product::whereIn('boutique_id', $boutique_ids)
            ->with('category')
            ->orderBy('views', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Seller/Dashboard', [
            'stats' => [
                'total_sales' => $totalSales,
                'total_orders' => $totalOrders,
                'total_products' => $totalProducts,
                'total_views' => $totalViews,
            ],
            'boutiques' => $boutiques,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
        ]);
    }
}
