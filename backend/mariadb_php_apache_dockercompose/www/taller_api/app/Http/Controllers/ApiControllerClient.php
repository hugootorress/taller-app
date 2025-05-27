<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use App\Models\Vehicle;
use App\Models\Repair;

class ApiControllerClient extends Controller
{
    public function index()
    {
        try {
            $clients = Client::all();
            return response()->json($clients);
        } catch (\Throwable $e) {
            \Log::error('Error en ApiControllerClient@index: ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Error interno del servidor'], 500);
        }
    }

    public function show($id)
    {
        $client = Client::find($id);

        if ($client) {
            return response()->json($client);
        }

        return response()->json(['error' => 'Cliente no encontrado'], 404);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:clients',
            'phone' => 'required|string|max:15',
            'address' => 'nullable|string|max:255',
        ]);

        $client = Client::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
        ]);

        return response()->json($client, 201);
    }

    public function update(Request $request, $id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['error' => 'Cliente no encontrado'], 404);
        }

        $client->update($request->all());

        return response()->json($client);
    }

    public function destroy($id)
    {
        $client = Client::with('vehicles.repairs')->find($id);

        if (!$client) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }

        foreach ($client->vehicles as $vehicle) {
            foreach ($vehicle->repairs as $repair) {
                $repair->delete();
            }
            $vehicle->delete();
        }

        $client->delete();

        return response()->json(['message' => 'Cliente, vehículos y reparaciones eliminados correctamente']);
    }



    public function getVehiclesForClient($id)
    {
        $vehicles = Vehicle::where('client_id', $id)->get();
        return response()->json($vehicles);
    }

    public function getRepairsByVehicle($vehicleId)
    {
        $repairs = Repair::where('vehicle_id', $vehicleId)->get();

        return response()->json($repairs);
    }


}
