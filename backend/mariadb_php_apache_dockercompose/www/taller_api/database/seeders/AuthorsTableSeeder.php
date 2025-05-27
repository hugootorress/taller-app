<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use DB;

class AuthorsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('authors')->insert([
            'name' => 'Francis Scott',
            'country' => 'USA',
        ]);
        DB::table('authors')->insert([
            'name' => 'Gabriel García Márquez',
            'country' => 'Colombia',
        ]);
    }
}
