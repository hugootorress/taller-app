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
        Schema::create('repairs', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('mechanic_id')->constrained('mechanics');
            $table->foreignId('vehicle_id')->constrained('vehicles');
            $table->text('description');
            $table->decimal('hours_spent', 5, 2)->default(0); 
            $table->decimal('total_cost', 8, 2)->nullable(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repairs');
    }
};
