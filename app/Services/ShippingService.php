<?php

namespace App\Services;

class ShippingService
{
    /**
     * Calculate shipping cost based on item count
     * - 1-2 products: 300 den
     * - 3+ products: FREE
     */
    public function calculateShipping(int $itemCount): float
    {
        if ($itemCount >= 3) {
            return 0;
        }

        return 300;
    }

    /**
     * Calculate tax (assuming 18% VAT)
     */
    public function calculateTax(float $subtotal): float
    {
        return $subtotal * 0.18;
    }

    /**
     * Calculate total order amount
     * Tax is calculated on subtotal + shipping
     */
    public function calculateTotal(float $subtotal, int $itemCount): array
    {
        $shipping = $this->calculateShipping($itemCount);
        $taxBase = $subtotal + $shipping;
        $tax = ($taxBase) * 0.18;
        $total = $subtotal + $shipping + $tax;

        return [
            'subtotal' => $subtotal,
            'shipping_cost' => $shipping,
            'tax' => $tax,
            'total' => $total,
        ];
    }
}
