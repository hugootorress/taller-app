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
        Schema::create('parts', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->decimal('price', 8, 2); 
            $table->decimal('profit_margin', 5, 2)->default(0); 
            $table->integer('stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parts');
    }
};
