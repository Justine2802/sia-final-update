<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Programs extends Model
{
    protected $fillable = ['program_name', 'description', 'budget_allocation'];

    public function residents()
    {
        return $this->belongsToMany(Residents::class, 'program_resident', 'program_id', 'resident_id')
                    ->withPivot('status', 'date_applied', 'remarks')
                    ->withTimestamps();
    }
}

