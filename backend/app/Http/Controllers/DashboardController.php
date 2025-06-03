<?php
namespace App\Http\Controllers;

use App\Models\Repair;
use App\Models\Part;
use App\Models\Client;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalClients = Client::count();
        $totalVehicles = Vehicle::count();

        $totalRepairs = Repair::count();
        $monthlyRepairs = Repair::whereMonth('repair_date', now()->month)->count();

        $totalHours = Repair::sum('hours_spent');
        $avgHoursPerRep = Repair::avg('hours_spent');

        $totalRevenue = Repair::sum('total_cost');
        $monthlyRevenue = Repair::whereMonth('repair_date', now()->month)
            ->sum('total_cost');

        $avgCost = Repair::avg('total_cost');

        $topClients = Repair::select('clients.id', 'clients.name', DB::raw('count(*) as repairs_count'))
            ->join('vehicles', 'vehicles.id', 'repairs.vehicle_id')
            ->join('clients', 'clients.id', 'vehicles.client_id')
            ->groupBy('clients.id', 'clients.name')
            ->orderByDesc('repairs_count')
            ->limit(5)
            ->get();

        $topVehicles = Repair::select('vehicles.id', 'vehicles.license_plate', DB::raw('count(*) as repairs_count'))
            ->join('vehicles', 'vehicles.id', 'repairs.vehicle_id')
            ->groupBy('vehicles.id', 'vehicles.license_plate')
            ->orderByDesc('repairs_count')
            ->limit(5)
            ->get();

        $avgRepairsPerClient = $totalClients
            ? round($totalRepairs / $totalClients, 2)
            : 0;

        $lowStockParts = Part::where('stock', '<', 20)->count();
        $inventoryValue = Part::sum(DB::raw('price * stock'));

        $avgPartMargin = Part::avg(DB::raw('(price * profit_margin / 100)'));

        $repairsByYear = Repair::select(
            DB::raw('YEAR(repair_date) as year'),
            DB::raw('count(*) as count')
        )
            ->groupBy('year')
            ->orderBy('year', 'desc')
            ->get();

        return response()->json([
            'totalClients' => $totalClients,
            'totalVehicles' => $totalVehicles,
            'totalRepairs' => $totalRepairs,
            'monthlyRepairs' => $monthlyRepairs,
            'totalHours' => $totalHours,
            'avgHoursPerRep' => $avgHoursPerRep,
            'totalRevenue' => $totalRevenue,
            'monthlyRevenue' => $monthlyRevenue,
            'avgCost' => $avgCost,
            'avgRepairsPerClient' => $avgRepairsPerClient,
            'lowStockParts' => $lowStockParts,
            'inventoryValue' => $inventoryValue,
            'avgPartMargin' => $avgPartMargin,
            'topClients' => $topClients,
            'topVehicles' => $topVehicles,
            'repairsByYear' => $repairsByYear,
        ], 200);

    }
}
