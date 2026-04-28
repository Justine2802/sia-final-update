<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // 1. Must be imported
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class Residents extends Model
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
        'is_verified'
    ];

    protected $hidden = [
        'password',
    ];

    public function activities()
{
    return $this->hasMany(ResidentActivity::class)->latest();
}
}