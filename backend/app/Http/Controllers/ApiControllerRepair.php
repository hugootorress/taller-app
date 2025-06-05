<?php
namespace App\Http\Controllers;

use App\Models\Repair;
use App\Models\Part;
use App\Models\Mechanic;
use Illuminate\Http\Request;

class ApiControllerRepair extends Controller
{
    public function index()
    {
        $repairs = Repair::with(['parts', 'vehicle', 'mechanic'])->get();
        $repairs = $repairs->map(function ($repair) {
            $parts = $repair->parts->map(function ($part) {
                return [
                    'id' => $part->id,
                    'name' => $part->name,
                    'price' => $part->price,
                    'sale_price' => $part->sale_price,
                    'stock' => $part->stock,
                    'profit_margin' => $part->profit_margin
                ];
            });
            return [
                'id' => $repair->id,
                'mechanic_id' => $repair->mechanic_id,
                'vehicle_id' => $repair->vehicle_id,
                'description' => $repair->description,
                'repair_date' => $repair->repair_date,
                'total_cost' => $repair->total_cost,
                'hours_spent' => $repair->hours_spent,
                'parts' => $parts,
                'vehicle' => $repair->vehicle,
                'mechanic' => $repair->mechanic
            ];
        });
        return response()->json($repairs);
    }

    public function show($id)
    {
        $repair = Repair::with(['parts', 'vehicle', 'mechanic'])->find($id);

        if (!$repair) {
            return response()->json(['error' => 'Reparación no encontrada'], 404);
        }

        $parts = $repair->parts->map(function ($part) {
            return [
                'id' => $part->id,
                'name' => $part->name,
                'price' => $part->price,
                'sale_price' => $part->sale_price,
                'stock' => $part->stock,
                'profit_margin' => $part->profit_margin
            ];
        });

        $repairData = [
            'id' => $repair->id,
            'mechanic_id' => $repair->mechanic_id,
            'vehicle_id' => $repair->vehicle_id,
            'description' => $repair->description,
            'repair_date' => $repair->repair_date,
            'total_cost' => $repair->total_cost,
            'hours_spent' => $repair->hours_spent,
            'parts' => $parts,
            'vehicle' => $repair->vehicle,
            'mechanic' => $repair->mechanic
        ];

        return response()->json($repairData);
    }

    public function store(Request $request)
    {
        $request->validate([
            'mechanic_id' => 'required|exists:mechanics,id',
            'vehicle_id' => 'required|exists:vehicles,id',
            'description' => 'required|string',
            'repair_date' => 'required|date',
            'parts' => 'array',
            'parts.*' => 'exists:parts,id',
        ]);

        $repair = Repair::create([
            'mechanic_id' => $request->mechanic_id,
            'vehicle_id' => $request->vehicle_id,
            'description' => $request->description,
            'repair_date' => $request->repair_date,
            'hours_spent' => $request->hours_spent ?? 0,
        ]);

        $partIds = $request->input('parts', []);
        $repair->parts()->sync($partIds);

        $repair->calculateTotalCost();

        return response()->json($repair->load('parts'), 201);
    }

    public function update(Request $request, $id)
    {
        try {
            $repair = Repair::find($id);
            if (!$repair) {
                return response()->json(['error' => 'Reparación no encontrada'], 404);
            }

            $request->validate([
                'description' => 'sometimes|string',
                'repair_date' => 'sometimes|date',
                'mechanic_id' => 'sometimes|required|exists:mechanics,id',
                'parts' => 'sometimes|array',
                'parts.*' => 'exists:parts,id',
                'hours_spent' => 'sometimes|numeric|min:0',
            ]);

            $repair->update($request->only(['description', 'repair_date', 'mechanic_id', 'hours_spent']));

            if ($request->has('parts')) {
                $partIds = $request->input('parts');
                $repair->parts()->sync($partIds);
            }

            $repair->calculateTotalCost();

            return response()->json($repair->load('parts'), 200);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar la reparación: ' . $e->getMessage());
            return response()->json(['error' => 'Error en el servidor'], 500);
        }
    }

    public function destroy($id)
    {
        $repair = Repair::find($id);

        if (!$repair) {
            return response()->json(['error' => 'Reparación no encontrada'], 404);
        }

        $repair->parts()->detach();
        $repair->delete();

        return response()->json(['message' => 'Reparación eliminada']);
    }

    public function getRepairsByVehicle($vehicleId)
    {
        $repairs = Repair::where('vehicle_id', $vehicleId)->get();
        return response()->json($repairs);
    }

    public function getRepairsByMechanic($mechanicId)
    {
        $repairs = Repair::where('mechanic_id', $mechanicId)->get();
        return response()->json($repairs);
    }

}
