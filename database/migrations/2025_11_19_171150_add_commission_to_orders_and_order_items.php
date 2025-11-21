<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->decimal('commission_amount', 10, 2)->default(0)->after('total');
            $table->decimal('commission_rate', 5, 2)->default(10.00)->after('commission_amount')->comment('Commission percentage (default 10%)');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('total_commission', 10, 2)->default(0)->after('total');
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn(['commission_amount', 'commission_rate']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('total_commission');
        });
    }
};
