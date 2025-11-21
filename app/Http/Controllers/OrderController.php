<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\ShippingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(private ShippingService $shippingService) {}

    public function index()
    {
        $user = auth()->user();

        if ($user->is_admin) {
            $orders = Order::with('items.product', 'user')->latest()->paginate(10);
        } else {
            $orders = $user->orders()->with('items.product')->latest()->paginate(10);
        }

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        $order->load('items.product', 'items.boutique', 'user');

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    public function create()
    {
        $cart = session('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }

        // Get product details for cart items
        $productIds = array_unique(array_column($cart, 'product_id'));
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        $cartItems = [];
        $subtotal = 0;
        $totalQuantity = 0;

        foreach ($cart as $cartKey => $item) {
            $productId = $item['product_id'];
            $size = $item['size'] ?? null;
            $quantity = $item['quantity'];

            if (isset($products[$productId])) {
                $product = $products[$productId];
                $itemTotal = $product->price * $quantity;
                $subtotal += $itemTotal;
                $totalQuantity += $quantity;

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

        // Calculate shipping and tax
        $shipping = $totalQuantity >= 3 ? 0 : 300;
        $tax = ($subtotal + $shipping) * 0.18;
        $total = $subtotal + $shipping + $tax;

        return Inertia::render('Checkout/Create', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'tax' => $tax,
            'total' => $total,
        ]);
    }

    public function checkout(Request $request)
    {
        $cart = session('cart', []);

        if (empty($cart)) {
            return back()->with('error', 'Your cart is empty');
        }

        $validated = $request->validate([
            'payment_method' => 'required|in:stripe,paypal,cod',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string',
            'shipping_country' => 'required|string',
            'shipping_postal_code' => 'required|string',
        ]);

        // Get product details
        $productIds = array_unique(array_column($cart, 'product_id'));
        $products = Product::with('productSizes')->whereIn('id', $productIds)->get()->keyBy('id');

        $subtotal = 0;
        $itemCount = 0;
        $orderItems = [];

        foreach ($cart as $cartKey => $item) {
            $productId = $item['product_id'];
            $size = $item['size'] ?? null;
            $quantity = $item['quantity'];

            if (!isset($products[$productId])) {
                return back()->with('error', 'Invalid product in cart');
            }

            $product = $products[$productId];

            // Check stock availability
            if ($size) {
                $productSize = $product->productSizes()->where('size', $size)->first();
                if (!$productSize || $productSize->stock < $quantity) {
                    return back()->with('error', "Insufficient stock for {$product->title} (Size: {$size})");
                }
            } else if ($product->stock < $quantity) {
                return back()->with('error', "Insufficient stock for {$product->title}");
            }

            $itemTotal = $product->price * $quantity;
            $subtotal += $itemTotal;
            $itemCount += $quantity;

            $orderItems[] = [
                'product' => $product,
                'size' => $size,
                'quantity' => $quantity,
                'unit_price' => $product->price,
                'total' => $itemTotal,
            ];
        }

        // Calculate totals
        $totals = $this->shippingService->calculateTotal($subtotal, $itemCount);

        // Create order
        $order = Order::create([
            'user_id' => auth()->id(),
            'order_number' => (new Order())->generateOrderNumber(),
            'payment_method' => $validated['payment_method'],
            'subtotal' => $totals['subtotal'],
            'shipping_cost' => $totals['shipping_cost'],
            'tax' => $totals['tax'],
            'total' => $totals['total'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'shipping_address' => $validated['shipping_address'],
            'shipping_city' => $validated['shipping_city'],
            'shipping_country' => $validated['shipping_country'],
            'shipping_postal_code' => $validated['shipping_postal_code'],
            'status' => $validated['payment_method'] === 'cod' ? 'pending' : 'pending',
        ]);

        // Create order items and update stock
        $totalCommission = 0;

        foreach ($orderItems as $item) {
            $commissionRate = 10.00; // 10% commission
            $commissionAmount = $item['total'] * ($commissionRate / 100);
            $totalCommission += $commissionAmount;

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product']->id,
                'boutique_id' => $item['product']->boutique_id,
                'size' => $item['size'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total' => $item['total'],
                'commission_rate' => $commissionRate,
                'commission_amount' => $commissionAmount,
            ]);

            // Update product stock
            if ($item['size']) {
                // Update size-specific stock
                $item['product']->productSizes()
                    ->where('size', $item['size'])
                    ->decrement('stock', $item['quantity']);
            } else {
                // Update main product stock
                $item['product']->decrement('stock', $item['quantity']);
            }
        }

        // Update order with total commission
        $order->update(['total_commission' => $totalCommission]);

        // Clear cart
        session(['cart' => []]);

        // TODO: Handle payment processing based on payment_method

        return redirect()->route('orders.show', $order)->with('success', 'Order created successfully');
    }
}
