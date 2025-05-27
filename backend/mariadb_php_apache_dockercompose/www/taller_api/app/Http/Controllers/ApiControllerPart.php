<?php

namespace App\Http\Controllers;

use App\Models\Part;
use Illuminate\Http\Request;

class ApiControllerPart extends Controller
{
    public function index()
    {
        $parts = Part::all()->map(function ($part) {
            return $part->toArray() + ['sale_price' => $part->sale_price];
        });

        return response()->json($parts);
    }

    public function show($id)
    {
        $part = Part::find($id);

        if ($part) {
            return response()->json($part->toArray() + ['sale_price' => $part->sale_price]);
        }

        return response()->json(['error' => 'Pieza no encontrada'], 404);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'profit_margin' => 'nullable|numeric|min:0',
        ]);

        $part = Part::create([
            'name' => $request->name,
            'price' => $request->price,
            'stock' => $request->stock,
            'profit_margin' => $request->profit_margin ?? 0,
        ]);

        return response()->json($part->toArray() + ['sale_price' => $part->sale_price], 201);
    }

    public function update(Request $request, $id)
    {
        $part = Part::find($id);

        if (!$part) {
            return response()->json(['error' => 'Pieza no encontrada'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'profit_margin' => 'sometimes|numeric|min:0',
        ]);

        $part->update($request->only('name', 'price', 'stock', 'profit_margin'));

        return response()->json($part->toArray() + ['sale_price' => $part->sale_price]);
    }

    public function destroy($id)
    {
        $part = Part::find($id);

        if (!$part) {
            return response()->json(['error' => 'Pieza no encontrada'], 404);
        }

        $part->delete();

        return response()->json(['message' => 'Pieza eliminada']);
    }
}
