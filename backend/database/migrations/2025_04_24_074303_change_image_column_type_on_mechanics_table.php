<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('mechanics', function (Blueprint $table) {
            $table->text('image')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('mechanics', function (Blueprint $table) {
            $table->string('image', 255)->nullable()->change();
        });
    }
};
