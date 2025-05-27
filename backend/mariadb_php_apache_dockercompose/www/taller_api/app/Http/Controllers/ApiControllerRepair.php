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
        return response()->json(Repair::with(['parts', 'vehicle', 'mechanic'])->get());
    }

    public function show($id)
    {
        $repair = Repair::with(['parts', 'vehicle', 'mechanic'])->find($id);

        if (!$repair) {
            return response()->json(['error' => 'Reparación no encontrada'], 404);
        }

        return response()->json($repair);
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

}
