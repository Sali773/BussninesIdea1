<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $cart = session('cart', []);

        // Calculate a safe cart count. The session `cart` may contain numeric quantities,
        // or item arrays/objects with a `quantity`/`qty`/`count`/`amount` field. Fall back
        // to counting items when no quantity is provided.
        $cartCount = 0;
        foreach ($cart as $item) {
            if (is_numeric($item)) {
                $cartCount += (int) $item;
                continue;
            }

            if (is_array($item)) {
                if (isset($item['quantity'])) {
                    $cartCount += (int) $item['quantity'];
                    continue;
                }
                if (isset($item['qty'])) {
                    $cartCount += (int) $item['qty'];
                    continue;
                }
                if (isset($item['count'])) {
                    $cartCount += (int) $item['count'];
                    continue;
                }
                if (isset($item['amount'])) {
                    $cartCount += (int) $item['amount'];
                    continue;
                }

                // No numeric field found, count the item as one.
                $cartCount += 1;
                continue;
            }

            if (is_object($item)) {
                if (isset($item->quantity)) {
                    $cartCount += (int) $item->quantity;
                    continue;
                }
                if (isset($item->qty)) {
                    $cartCount += (int) $item->qty;
                    continue;
                }
                if (isset($item->count)) {
                    $cartCount += (int) $item->count;
                    continue;
                }
                if (isset($item->amount)) {
                    $cartCount += (int) $item->amount;
                    continue;
                }

                $cartCount += 1;
                continue;
            }

            // Default: count as single item
            $cartCount += 1;
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'cart' => [
                'count' => $cartCount,
                'items' => $cart,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
