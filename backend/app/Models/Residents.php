<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;



class Residents extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'birth_date',
        'address',
        'is_verified',
        'email',
        'phone',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    public function activities()
{
    return $this->hasMany(ResidentActivity::class)->latest();
}
}