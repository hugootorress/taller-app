<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Part extends Model
{
    protected $fillable = [
        'name', 'price', 'stock', 'profit_margin'
    ];

    protected $appends = ['sale_price'];

    public function getSalePriceAttribute()
    {
        return round((float) $this->price * (1 + ((float) $this->profit_margin / 100)), 2);
    }

    public function repairs()
    {
        return $this->belongsToMany(Repair::class);
    }
}



