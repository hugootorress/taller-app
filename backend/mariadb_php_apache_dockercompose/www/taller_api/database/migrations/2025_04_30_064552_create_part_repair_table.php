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
    Schema::create('part_repair', function (Blueprint $table) {
        $table->id();
        $table->foreignId('repair_id')->constrained()->onDelete('cascade');
        $table->foreignId('part_id')->constrained()->onDelete('cascade');
        $table->timestamps();
    });
}

public function down(): void
{
    Schema::dropIfExists('part_repair');
}

};
