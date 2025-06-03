<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Mechanic extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name', 'email', 'password', 'hourly_rate', 'image', 'role'
    ];

    protected $hidden = [
        'password',
    ];

    public function repairs()
    {
        return $this->hasMany(Repair::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
