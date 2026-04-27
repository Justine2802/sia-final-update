<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResidentActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'resident_id',
        'type',
        'description',
        'status'
    ];

    // Link back to the User/Resident
    public function resident()
    {
        return $this->belongsTo(User::class, 'resident_id');
    }
}