<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incidents extends Model
{
    protected $fillable = ['resident_id', 'incident_type', 'description', 'status'];

    public function residents()
    {
        return $this->belongsTo(Residents::class);
    }
}