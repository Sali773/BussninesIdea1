<?php

namespace App\Http\Controllers;

use App\Models\Boutique;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BoutiqueController extends Controller
{
    public function index()
    {
        $boutiques = Boutique::where('is_active', true)
            ->with('user')
            ->paginate(12);

        return Inertia::render('Boutiques/Index', [
            'boutiques' => $boutiques,
        ]);
    }

    public function show(Boutique $boutique)
    {
        $boutique->load('products.category');
        $products = $boutique->products()->where('is_active', true)->paginate(12);

        return Inertia::render('Boutiques/Show', [
            'boutique' => $boutique,
            'products' => $products,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Boutique::class);

        $users = User::where('is_admin', false)->get(['id', 'name', 'email']);

        return Inertia::render('Boutiques/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Boutique::class);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('boutiques/logos', 'public');
        }

        $bannerPath = null;
        if ($request->hasFile('banner')) {
            $bannerPath = $request->file('banner')->store('boutiques/banners', 'public');
        }

        $boutique = Boutique::create([
            'user_id' => $validated['user_id'],
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'city' => $validated['city'],
            'country' => $validated['country'],
            'logo_path' => $logoPath,
            'banner_path' => $bannerPath,
        ]);

        // Mark the selected user as seller
        $user = User::find($validated['user_id']);
        if ($user && !$user->is_seller) {
            $user->update(['is_seller' => true]);
        }

        return redirect()->route('boutiques.show', $boutique)->with('success', 'Boutique created successfully');
    }

    public function edit(Boutique $boutique)
    {
        $this->authorize('update', $boutique);

        return Inertia::render('Boutiques/Edit', [
            'boutique' => $boutique,
        ]);
    }

    public function update(Request $request, Boutique $boutique)
    {
        $this->authorize('update', $boutique);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo_path'] = $request->file('logo')->store('boutiques/logos', 'public');
        }

        if ($request->hasFile('banner')) {
            $validated['banner_path'] = $request->file('banner')->store('boutiques/banners', 'public');
        }

        $validated['slug'] = Str::slug($validated['name']);

        $boutique->update($validated);

        return redirect()->route('boutiques.show', $boutique)->with('success', 'Boutique updated successfully');
    }

    public function destroy(Boutique $boutique)
    {
        $this->authorize('delete', $boutique);

        $boutique->delete();

        if (request()->wantsJson()) {
            return response()->json(['success' => true, 'message' => 'Boutique deleted successfully']);
        }

        return redirect()->route('boutiques.index')->with('success', 'Boutique deleted successfully');
    }

    public function dashboard()
    {
        $user = auth()->user();
        $boutiques = $user->boutiques()->with('products', 'orders.user', 'orders.items')->get();

        if ($boutiques->isEmpty()) {
            return redirect()->route('boutiques.create');
        }

        return Inertia::render('Boutiques/Dashboard', [
            'boutiques' => $boutiques,
        ]);
    }

    public function orders(Boutique $boutique)
    {
        $this->authorize('view', $boutique);

        // Get orders that have items from this boutique
        $orders = Order::whereHas('items', function ($query) use ($boutique) {
            $query->where('boutique_id', $boutique->id);
        })
            ->with('user', 'items.product')
            ->latest()
            ->get();

        return Inertia::render('Boutiques/Orders', [
            'boutique' => $boutique,
            'orders' => $orders,
        ]);
    }

    public function updateOrderStatus(Request $request, Boutique $boutique, Order $order)
    {
        $this->authorize('view', $boutique);

        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,completed,cancelled',
        ]);

        // Verify the order belongs to this boutique
        $belongsToBoutique = $order->items()->where('boutique_id', $boutique->id)->exists();
        if (!$belongsToBoutique) {
            abort(403);
        }

        $order->update($validated);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => 'Order status updated']);
        }

        return back()->with('success', 'Order status updated');
    }
}
