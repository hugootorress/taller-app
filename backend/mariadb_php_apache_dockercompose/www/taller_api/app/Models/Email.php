<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Email extends Model
{
    use HasFactory;

    protected $fillable = [
        'from_email',
        'from_name',
        'to_email',
        'subject',
        'body',
        'is_sent',
    ];
}
