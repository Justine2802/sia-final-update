<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incidents extends Model
{
   
protected $fillable = ['resident_id', 'incident_type', 'description', 'status', 'remarks'];

    public function residents()
    {
        return $this->belongsTo(Residents::class, 'resident_id');
    }
}