<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('certificates', function (Blueprint $table) {
            // Adds the amount column to track payment totals
            $table->decimal('amount', 8, 2)->default(0)->after('purpose'); 
            // Adds the session ID column to track Stripe transactions
            $table->string('stripe_session_id')->nullable()->after('status'); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('certificates', function (Blueprint $table) {
            // Drops the columns if the migration is rolled back
            $table->dropColumn(['amount', 'stripe_session_id']); 
        });
    }
};