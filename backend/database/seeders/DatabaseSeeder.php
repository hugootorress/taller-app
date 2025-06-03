<?php

namespace Database\Seeders;

use App\Models\Mechanic;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Mechanic::updateOrCreate([
            'email' => 'admin@example.com',
        ], [
            'name' => 'Administrador',
            'password' => Hash::make('password'),
            'hourly_rate' => 15.00,
            'role' => 'admin',
        ]);

        // Mecánicos de prueba
        Mechanic::updateOrCreate([
            'email' => 'mecanico1@example.com',
        ], [
            'name' => 'Juan Pérez',
            'password' => Hash::make('mecanico123'),
            'hourly_rate' => 12.50,
            'role' => 'mechanic',
            'image' => null,
        ]);
        Mechanic::updateOrCreate([
            'email' => 'mecanico2@example.com',
        ], [
            'name' => 'Ana López',
            'password' => Hash::make('mecanico456'),
            'hourly_rate' => 13.75,
            'role' => 'mechanic',
            'image' => null,
        ]);

        // Clientes de prueba
        \App\Models\Client::updateOrCreate([
            'email' => 'cliente1@example.com',
        ], [
            'name' => 'Carlos García',
            'phone' => '600123456',
            'address' => 'Calle Mayor 1',
        ]);
        \App\Models\Client::updateOrCreate([
            'email' => 'cliente2@example.com',
        ], [
            'name' => 'Lucía Fernández',
            'phone' => '600654321',
            'address' => 'Avenida Sol 22',
        ]);

        // Vehículos de prueba
        \App\Models\Vehicle::updateOrCreate([
            'license_plate' => '1234ABC',
        ], [
            'model' => 'Seat Ibiza',
            'year' => 2018,
            'client_id' => 1,
            'image' => null,
        ]);
        \App\Models\Vehicle::updateOrCreate([
            'license_plate' => '5678XYZ',
        ], [
            'model' => 'Renault Clio',
            'year' => 2020,
            'client_id' => 2,
            'image' => null,
        ]);

        // Piezas de prueba
        \App\Models\Part::updateOrCreate([
            'name' => 'Filtro de aceite',
        ], [
            'price' => 10.50,
            'stock' => 20,
            'profit_margin' => 25,
        ]);
        \App\Models\Part::updateOrCreate([
            'name' => 'Pastillas de freno',
        ], [
            'price' => 35.00,
            'stock' => 15,
            'profit_margin' => 30,
        ]);

        // Reparaciones de prueba
        \App\Models\Repair::updateOrCreate([
            'mechanic_id' => 2,
            'vehicle_id' => 1,
            'description' => 'Cambio de aceite y filtro',
        ], [
            'hours_spent' => 1.5,
            'total_cost' => 30.00,
        ]);
        \App\Models\Repair::updateOrCreate([
            'mechanic_id' => 3,
            'vehicle_id' => 2,
            'description' => 'Sustitución de pastillas de freno',
        ], [
            'hours_spent' => 2.0,
            'total_cost' => 70.00,
        ]);

        // Relacionar piezas con reparaciones (tabla part_repair)
        $repair1 = \App\Models\Repair::where('description', 'Cambio de aceite y filtro')->first();
        $repair2 = \App\Models\Repair::where('description', 'Sustitución de pastillas de freno')->first();
        $filtro = \App\Models\Part::where('name', 'Filtro de aceite')->first();
        $pastillas = \App\Models\Part::where('name', 'Pastillas de freno')->first();
        if ($repair1 && $filtro) {
            $repair1->parts()->syncWithoutDetaching([$filtro->id]);
        }
        if ($repair2 && $pastillas) {
            $repair2->parts()->syncWithoutDetaching([$pastillas->id]);
        }
    }
}
