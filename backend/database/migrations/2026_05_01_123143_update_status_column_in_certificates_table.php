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
        // Option A: Change to a regular string so it accepts anything
        $table->string('status')->change(); 
        
        // OR Option B: Keep ENUM but add the new status
        // $table->enum('status', ['Requested', 'Pending Payment', 'Paid', 'Issued', 'Cancelled'])->change();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('certificates', function (Blueprint $table) {
            //
        });
    }
};
