<?php

namespace App\Http\Controllers;

use App\Models\Mechanic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class MechanicController extends Controller
{
    public function index()
    {
        return response()->json(Mechanic::all());
    }

    public function show($id)
    {
        $mechanic = Mechanic::find($id);

        if (!$mechanic) {
            return response()->json(['error' => 'Mecánico no encontrado'], 404);
        }

        return response()->json($mechanic);
    }

    public function update(Request $request, $id)
    {
        $mechanic = Mechanic::find($id);

        if (!$mechanic) {
            return response()->json(['error' => 'Mecánico no encontrado'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:mechanics,email,' . $id,
            'password' => 'nullable|string|min:6',
            'hourly_rate' => 'sometimes|required|numeric|min:0',
            'image' => 'nullable|string',
            'role' => 'sometimes|required|in:admin,mecanico'
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

        $mechanic->name = $request->name ?? $mechanic->name;
        $mechanic->email = $request->email ?? $mechanic->email;
        $mechanic->hourly_rate = $request->hourly_rate ?? $mechanic->hourly_rate;
        $mechanic->image = $request->image ?? $mechanic->image;
        $mechanic->role = $request->role ?? $mechanic->role;

        if ($request->filled('password')) {
            $mechanic->password = Hash::make($request->password);
        }

        $mechanic->save();

        return response()->json($mechanic);
    }

    public function destroy($id)
    {
        $mechanic = Mechanic::find($id);

        if (!$mechanic) {
            return response()->json(['error' => 'Mecánico no encontrado'], 404);
        }

        // Eliminar reparaciones asociadas
        foreach ($mechanic->repairs as $repair) {
            $repair->delete();
        }
        $mechanic->delete();

        return response()->json(['message' => 'Mecánico y sus reparaciones eliminados correctamente']);
    }
}
