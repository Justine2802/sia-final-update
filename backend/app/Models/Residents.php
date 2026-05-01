<?php

namespace App\Models;

// Change this line to include the Authenticatable alias
use Illuminate\Foundation\Auth\User as Authenticatable; 
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// Change "extends Model" to "extends Authenticatable"
class Residents extends Authenticatable 
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name', 
        'middle_name', 
        'last_name', 
        'birth_date',
        'gender', 
        'civil_status', 
        'phone', 
        'email',
        'address', 
        'purok', 
        'occupation', 
        'is_voter',
        'is_verified',
        'password' 
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}