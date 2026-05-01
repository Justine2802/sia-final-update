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
        // Change enum/restricted column to string to accept "Pending Payment"
        $table->string('status')->default('Pending')->change();
        
        if (!Schema::hasColumn('certificates', 'amount')) {
            $table->decimal('amount', 10, 2)->default(0)->after('purpose');
        }
        if (!Schema::hasColumn('certificates', 'stripe_session_id')) {
            $table->string('stripe_session_id')->nullable()->after('status');
        }
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
