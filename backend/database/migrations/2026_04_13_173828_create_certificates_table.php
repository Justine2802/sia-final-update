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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained('residents')->onDelete('cascade');
            $table->enum('certificate_type', ['Barangay Clearance', 'Indigency', 'Residency']);
            $table->enum('purpose', ['Employment', 'Education', 'Legal', 'General']);
            $table->enum('status', ['Requested', 'Processing', 'Issued', 'Denied'])->default('Requested');
            $table->dateTime('issued_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
