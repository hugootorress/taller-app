<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'license_plate', 'model', 'year', 'client_id','image'
    ];

    public function repairs()
    {
        return $this->hasMany(Repair::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}

