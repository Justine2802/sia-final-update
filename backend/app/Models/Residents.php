<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Residents extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'birth_date',
        'address',
        'password',
        'is_verified'
    ];

    protected $hidden = ['password'];
}