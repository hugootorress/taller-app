<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApiControllerVehicle;
use App\Http\Controllers\ApiControllerClient;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\ApiControllerPart;
use App\Http\Controllers\ApiControllerRepair;
use App\Http\Controllers\MechanicController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ChatController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/send-email', [EmailController::class, 'send']);
    Route::get('/inbox', [EmailController::class, 'inbox']);

    Route::get('/clients', [ApiControllerClient::class, 'index']);
    Route::get('/clients/{id}', [ApiControllerClient::class, 'show']);
    Route::post('/clients', [ApiControllerClient::class, 'store']);
    Route::put('/clients/{id}', [ApiControllerClient::class, 'update']);
    Route::delete('/clients/{id}', [ApiControllerClient::class, 'destroy']);
    Route::get('/clients/{id}/vehicles', [ApiControllerClient::class, 'getVehiclesForClient']);
    Route::get('vehicles/{vehicleId}/repairs', [ApiControllerClient::class, 'getRepairsByVehicle']);

    Route::get('/vehicles', [ApiControllerVehicle::class, 'index']);
    Route::post('/vehicles', [ApiControllerVehicle::class, 'store']);
    Route::get('/vehicles/{id}', [ApiControllerVehicle::class, 'show']);
    Route::put('/vehicles/{id}', [ApiControllerVehicle::class, 'update']);
    Route::delete('vehicles/{id}', [ApiControllerVehicle::class, 'destroy']);
    Route::get('/vehicles/{id}/with-repairs', [ApiControllerVehicle::class, 'deleteVehicleWithRepairs']);
    Route::delete('/vehicles/{id}/delete-and-repairs', [ApiControllerVehicle::class, 'deleteVehicleAndRepairs']);

    Route::get('/parts', [ApiControllerPart::class, 'index']);
    Route::get('/parts/{id}', [ApiControllerPart::class, 'show']);
    Route::post('/parts', [ApiControllerPart::class, 'store']);
    Route::put('/parts/{id}', [ApiControllerPart::class, 'update']);
    Route::delete('/parts/{id}', [ApiControllerPart::class, 'destroy']);

    Route::get('/repairs', [ApiControllerRepair::class, 'index']);
    Route::get('/repairs/{id}', [ApiControllerRepair::class, 'show']);
    Route::post('/repairs', [ApiControllerRepair::class, 'store']);
    Route::put('/repairs/{id}', [ApiControllerRepair::class, 'update']);
    Route::delete('/repairs/{id}', [ApiControllerRepair::class, 'destroy']);
    Route::get('/repairs/vehicle/{vehicleId}', [ApiControllerRepair::class, 'getRepairsByVehicle']);

    Route::get('/mechanics', [MechanicController::class, 'index']);
    Route::get('/mechanics/{id}', [MechanicController::class, 'show']);
    Route::put('/mechanics/{id}', [MechanicController::class, 'update']);
    Route::delete('/mechanics/{id}', [MechanicController::class, 'destroy']);

    Route::get('/stats', [DashboardController::class, 'stats']);

    Route::post('/logout', [AuthController::class, 'logout']);
});

