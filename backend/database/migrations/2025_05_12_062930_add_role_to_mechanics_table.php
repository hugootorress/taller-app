<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Esta migración queda vacía porque la columna 'role' ya existe en la tabla mechanics.
    }

    public function down(): void
    {
        Schema::table('mechanics', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};

