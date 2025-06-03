<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Mechanic;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function me(Request $request)
    {
        \Log::info('Solicitud recibida:', $request->headers->all());
        return response()->json($request->user());
    }


    public function updateMe(Request $request)
    {
        $mechanic = $request->user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:mechanics,email,' . $mechanic->id,
            'hourly_rate' => 'required|numeric|min:0',
            'password' => 'nullable|string|min:6',
            'image' => 'nullable|string',
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $mechanic->update($data);

        return response()->json($mechanic);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:mechanics,email',
            'password' => 'required|string|min:6',
            'hourly_rate' => 'required|numeric|min:0',
            'image' => 'nullable|string',
        ]);

        $mechanic = Mechanic::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'hourly_rate' => $request->hourly_rate,
            'image' => $request->image,
        ]);

        return response()->json([
            'respuesta' => 'Mecánico creado correctamente'
        ], 200);
    }


    public function login(Request $request)
    {
        \Log::info('Login attempt:', ['email' => $request->email]);

        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $mechanic = Mechanic::where('email', $request->email)->first();

        if (!$mechanic || !Hash::check($request->password, $mechanic->password)) {
            return response()->json(['respuesta' => 'Unauthorized'], 401);
        }

        $token = $mechanic->createToken('miToken')->plainTextToken;

        return response()->json([
            'token' => $token,
            'mechanic' => [
                'id' => $mechanic->id,
                'name' => $mechanic->name,
                'email' => $mechanic->email,
                'hourly_rate' => $mechanic->hourly_rate,
                'image' => $mechanic->image,
                'role' => $mechanic->role,
            ]
        ]);

    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['respuesta' => 'Token revocado']);
    }
}
