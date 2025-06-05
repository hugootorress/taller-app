<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use App\Models\Repair;

class ApiControllerVehicle extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::all();
        return response()->json($vehicles);
    }

    public function show($id)
    {

        $vehicle = Vehicle::with('client')->find($id);

        if (!$vehicle) {
            return response()->json(['message' => 'Vehículo no encontrado'], 404);
        }

        return response()->json($vehicle);
    }


    public function store(Request $request)
    {
        $request->validate([
            'license_plate' => 'required|string',
            'model' => 'required|string',
            'year' => 'required|integer',
            'client_id' => 'required|exists:clients,id',
            'image' => 'nullable|string',
        ]);

        if ($request->image) {
            $imageData = $request->image;
            $imageSize = strlen($imageData);
            if ($imageSize > 45 * 1024) {
                return response()->json(['error' => 'La imagen no puede superar los 45KB'], 422);
            }
        } elseif ($request->hasFile('image')) {
            $file = $request->file('image');
            if ($file->getSize() > 45 * 1024) {
                return response()->json(['error' => 'La imagen no puede superar los 45KB'], 422);
            }
        }


        $vehicle = Vehicle::create([
            'license_plate' => $request->license_plate,
            'model' => $request->model,
            'year' => $request->year,
            'client_id' => $request->client_id,
            'image' => $request->image
        ]);


        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('vehicles', 'public');
            $vehicle->image = $imagePath;
        }

        $vehicle->save();

        return response()->json($vehicle, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'license_plate' => 'required|string',
            'model' => 'required|string',
            'year' => 'required|integer',
            'client_id' => 'required|exists:clients,id',
            'image' => 'nullable|string',
        ]);

        // Validar tamaño de imagen (base64 o archivo)
        if ($request->image) {
            $imageData = $request->image;
            $imageSize = strlen($imageData);
            if ($imageSize > 45 * 1024) {
                return response()->json(['error' => 'La imagen no puede superar los 45KB'], 422);
            }
        } elseif ($request->hasFile('image')) {
            $file = $request->file('image');
            if ($file->getSize() > 45 * 1024) {
                return response()->json(['error' => 'La imagen no puede superar los 45KB'], 422);
            }
        }

        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json(['error' => 'Vehículo no encontrado'], 404);
        }

        $vehicle->license_plate = $request->license_plate;
        $vehicle->model = $request->model;
        $vehicle->year = $request->year;
        $vehicle->client_id = $request->client_id;

        if ($request->image) {
            $vehicle->image = $request->image;
        }

        $vehicle->save();

        return response()->json($vehicle);
    }


    public function destroy($id)
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json(['error' => 'Vehículo no encontrado'], 404);
        }

        $repairs = Repair::where('vehicle_id', $id)->get();
        foreach ($repairs as $repair) {
            $repair->delete();
        }

        $vehicle->delete();

        return response()->json(['message' => 'Vehículo y sus reparaciones eliminadas correctamente']);
    }
    public function deleteVehicleWithRepairs($id)
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json(['error' => 'Vehicle not found'], 404);
        }

        $repairs = Repair::where('vehicle_id', $id)->get();

        if ($repairs->isNotEmpty()) {
            return response()->json([
                'message' => 'Este vehículo está asociado a ' . $repairs->count() . ' reparaciones. ¿Desea eliminar también las reparaciones?',
                'repairs' => $repairs
            ], 200);
        }

        $vehicle->delete();

        return response()->json(['message' => 'Vehicle deleted successfully'], 200);
    }

    public function deleteVehicleAndRepairs(Request $request, $id)
    {
        $vehicle = Vehicle::find($id);

        if (!$vehicle) {
            return response()->json(['error' => 'Vehicle not found'], 404);
        }

        Repair::where('vehicle_id', $id)->delete();

        $vehicle->delete();

        return response()->json(['message' => 'Vehicle and its repairs deleted successfully'], 200);
    }

}
