<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Convert all existing USD prices to MKD (multiply by 60)
     */
    public function up(): void
    {
        // Convert product prices from USD to MKD (1 USD = 60 MKD)
        DB::table('products')->update([
            'price' => DB::raw('price * 60')
        ]);

        // Convert order amounts from USD to MKD
        DB::table('orders')->update([
            'subtotal' => DB::raw('subtotal * 60'),
            'shipping_cost' => DB::raw('shipping_cost * 60'),
            'tax' => DB::raw('tax * 60'),
            'total' => DB::raw('total * 60'),
        ]);

        // Convert order item amounts from USD to MKD
        DB::table('order_items')->update([
            'unit_price' => DB::raw('unit_price * 60'),
            'total' => DB::raw('total * 60'),
            'commission_amount' => DB::raw('commission_amount * 60'),
        ]);
    }

    /**
     * Reverse the migrations.
     * Convert MKD prices back to USD (divide by 60)
     */
    public function down(): void
    {
        // Convert product prices from MKD to USD (1 USD = 60 MKD)
        DB::table('products')->update([
            'price' => DB::raw('price / 60')
        ]);

        // Convert order amounts from MKD to USD
        DB::table('orders')->update([
            'subtotal' => DB::raw('subtotal / 60'),
            'shipping_cost' => DB::raw('shipping_cost / 60'),
            'tax' => DB::raw('tax / 60'),
            'total' => DB::raw('total / 60'),
        ]);

        // Convert order item amounts from MKD to USD
        DB::table('order_items')->update([
            'unit_price' => DB::raw('unit_price / 60'),
            'total' => DB::raw('total / 60'),
            'commission_amount' => DB::raw('commission_amount / 60'),
        ]);
    }
};
