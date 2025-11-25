<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\BoutiqueController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;

// Public routes
Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Storefront routes
Route::get('/products', [ProductController::class, 'index'])->name('products.index');

Route::get('/boutiques', [BoutiqueController::class, 'index'])->name('boutiques.index');
Route::get('/boutiques/create', [BoutiqueController::class, 'create'])->name('boutiques.create');
Route::get('/boutiques/{boutique}', [BoutiqueController::class, 'show'])->name('boutiques.show');

// Cart routes
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
Route::patch('/cart/{product}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{product}', [CartController::class, 'remove'])->name('cart.remove');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard routing
    Route::get('dashboard', [DashboardController::class, 'redirect'])->name('dashboard');
    Route::get('seller/dashboard', [DashboardController::class, 'seller'])->name('seller.dashboard');

    // Product management
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::patch('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Product show route (specific route after /products/create)
    Route::get('/products/{product}', [ProductController::class, 'show'])->where('product', '[0-9]+')->name('products.show');

    // Boutique management - Admin only
    Route::middleware('admin')->group(function () {
        Route::post('/boutiques', [BoutiqueController::class, 'store'])->name('boutiques.store');
        Route::get('/boutiques/{boutique}/edit', [BoutiqueController::class, 'edit'])->name('boutiques.edit');
        Route::patch('/boutiques/{boutique}', [BoutiqueController::class, 'update'])->name('boutiques.update');
        Route::delete('/boutiques/{boutique}', [BoutiqueController::class, 'destroy'])->name('boutiques.destroy');
    });

    // Seller dashboard - Sellers only
    Route::middleware('seller')->group(function () {
        Route::get('/my-boutiques', [BoutiqueController::class, 'dashboard'])->name('boutiques.dashboard');
        Route::get('/seller/products', [ProductController::class, 'sellerProducts'])->name('seller.products');
        Route::get('/boutiques/{boutique}/orders', [BoutiqueController::class, 'orders'])->name('boutiques.orders');
        Route::patch('/boutiques/{boutique}/orders/{order}/status', [BoutiqueController::class, 'updateOrderStatus'])->name('boutiques.orders.status');
    });

    // Checkout & Orders
    Route::get('/checkout', [OrderController::class, 'create'])->name('checkout.create');
    Route::post('/checkout', [OrderController::class, 'checkout'])->name('checkout');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

    // Ratings
    Route::get('/products/{product}/rate', [RatingController::class, 'create'])->name('ratings.create');
    Route::post('/products/{product}/rate', [RatingController::class, 'store'])->name('ratings.store');
    Route::delete('/ratings/{rating}', [RatingController::class, 'destroy'])->name('ratings.destroy');

    // Admin routes
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/users', [AdminController::class, 'users'])->name('users');
        Route::patch('/users/{user}/toggle-admin', [AdminController::class, 'toggleAdmin'])->name('users.toggle');
        Route::get('/boutiques', [AdminController::class, 'boutiques'])->name('boutiques');
        Route::get('/boutiques/create', [AdminController::class, 'createBoutique'])->name('boutiques.create');
        Route::post('/boutiques', [AdminController::class, 'storeBoutique'])->name('boutiques.store');
        Route::patch('/boutiques/{boutique}/toggle', [AdminController::class, 'toggleBoutique'])->name('boutiques.toggle');
        Route::get('/products', [AdminController::class, 'products'])->name('products');
        Route::get('/products/create', [AdminController::class, 'createProduct'])->name('products.create');
        Route::post('/products', [AdminController::class, 'storeProduct'])->name('products.store');
        Route::get('/orders', [AdminController::class, 'orders'])->name('orders');
        Route::get('/orders/{order}', [AdminController::class, 'showOrder'])->name('orders.show');
        Route::patch('/orders/{order}/status', [AdminController::class, 'updateOrderStatus'])->name('orders.status');
        Route::get('/reviews', [AdminController::class, 'reviews'])->name('reviews');
        Route::delete('/reviews/{rating}', [AdminController::class, 'deleteReview'])->name('reviews.delete');
        Route::get('/commissions', [AdminController::class, 'commissions'])->name('commissions');
    });
});

require __DIR__.'/settings.php';
