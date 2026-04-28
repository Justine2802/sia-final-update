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
        Schema::create('residents', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 50);
            $table->string('middle_name', 50)->nullable();
            $table->string('last_name', 50);
            $table->date('birth_date');
            $table->enum('gender', ['Male', 'Female'])->default('Male');
            $table->enum('civil_status', ['Single', 'Married', 'Widowed', 'Separated'])->default('Single');
            $table->string('phone', 20)->nullable();
            $table->string('email', 100)->nullable()->unique();
            $table->string('address', 255);
            $table->string('purok', 50)->nullable();
            $table->string('occupation', 100)->nullable();
            $table->boolean('is_voter')->default(false);
            $table->boolean('is_verified')->default(false);
            $table->string('password')->nullable(); // Needed if they log into the portal
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
