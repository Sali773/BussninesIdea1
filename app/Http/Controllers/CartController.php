<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductSize;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = session('cart', []);

        if (empty($cart)) {
            return Inertia::render('Cart/Index', [
                'cartItems' => [],
                'subtotal' => 0,
            ]);
        }

        $productIds = array_unique(array_column($cart, 'product_id'));
        $products = Product::with('productSizes')->whereIn('id', $productIds)->get()->keyBy('id');

        $cartItems = [];
        $subtotal = 0;

        foreach ($cart as $cartKey => $item) {
            $productId = $item['product_id'];
            $size = $item['size'] ?? null;
            $quantity = $item['quantity'];

            if (isset($products[$productId])) {
                $product = $products[$productId];
                $itemTotal = $product->price * $quantity;
                $subtotal += $itemTotal;

                $cartItems[] = [
                    'cart_key' => $cartKey,
                    'id' => $product->id,
                    'title' => $product->title,
                    'price' => $product->price,
                    'quantity' => $quantity,
                    'size' => $size,
                    'total' => $itemTotal,
                    'image_path' => $product->image_path,
                ];
            }
        }

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
        ]);
    }

    public function add(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'size' => 'nullable|string',
        ]);

        $product = Product::with('productSizes')->findOrFail($validated['product_id']);
        $size = $validated['size'] ?? null;

        // Check stock availability
        if ($size) {
            $productSize = $product->productSizes()->where('size', $size)->first();
            if (!$productSize || $productSize->stock < $validated['quantity']) {
                return back()->withErrors(['quantity' => 'Not enough stock available for this size']);
            }
        } else if ($product->stock < $validated['quantity']) {
            return back()->withErrors(['quantity' => 'Not enough stock available']);
        }

        $cart = session('cart', []);

        // Create unique cart key: product_id + size (or just product_id if no size)
        $cartKey = $size ? "{$product->id}_{$size}" : (string)$product->id;

        // If item exists, increase quantity, otherwise add new item
        if (isset($cart[$cartKey])) {
            $cart[$cartKey]['quantity'] += $validated['quantity'];
        } else {
            $cart[$cartKey] = [
                'product_id' => $product->id,
                'size' => $size,
                'quantity' => $validated['quantity'],
            ];
        }

        session(['cart' => $cart]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Product added to cart',
                'cartItems' => count($cart),
            ]);
        }

        return back()->with('success', 'Product added to cart');
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'cart_key' => 'required|string',
            'quantity' => 'required|integer|min:0',
        ]);

        $cart = session('cart', []);
        $cartKey = $validated['cart_key'];

        if (!isset($cart[$cartKey])) {
            return back()->withErrors(['cart' => 'Item not found in cart']);
        }

        if ($validated['quantity'] <= 0) {
            unset($cart[$cartKey]);
        } else {
            $cart[$cartKey]['quantity'] = $validated['quantity'];
        }

        session(['cart' => $cart]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Cart updated',
            ]);
        }

        return back()->with('success', 'Cart updated');
    }

    public function remove(Request $request)
    {
        $validated = $request->validate([
            'cart_key' => 'required|string',
        ]);

        $cart = session('cart', []);
        unset($cart[$validated['cart_key']]);
        session(['cart' => $cart]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Product removed from cart',
            ]);
        }

        return back()->with('success', 'Product removed from cart');
    }

    public function clear()
    {
        session(['cart' => []]);

        return back()->with('success', 'Cart cleared');
    }
}
