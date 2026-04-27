<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('resident_activities', function (Blueprint $table) {
        $table->id();
        $table->foreignId('resident_id')->constrained()->onDelete('cascade');
        $table->string('activity_type'); // e.g., 'Program Enrollment', 'Certificate Request'
        $table->string('description');   // e.g., 'Applied for Senior Citizen Pension'
        $table->string('status');        // e.g., 'Pending', 'Approved'
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resident_activities');
    }
};
