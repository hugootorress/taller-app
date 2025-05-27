<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Repair extends Model
{
    protected $fillable = [
        'mechanic_id', 'vehicle_id', 'description', 'repair_date', 'total_cost', 'hours_spent'
    ];

    public function parts()
    {
        return $this->belongsToMany(Part::class, 'part_repair');
    }

    public function mechanic()
    {
        return $this->belongsTo(Mechanic::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function calculateTotalCost()
    {
        $partsCost = $this->parts->sum(function ($part) {
            return $part->sale_price; 
        });

        $laborCost = $this->hours_spent * $this->mechanic->hourly_rate;

        $totalCost = $partsCost + $laborCost;
        
        $this->total_cost = $totalCost;
        $this->save();

        return $totalCost;
    }
}
