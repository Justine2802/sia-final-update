<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificates extends Model
{
  protected $fillable = [
    'resident_id', 
    'certificate_type', 
    'purpose', 
    'amount', // <--- This must be added to prevent the 500 error
    'status', 
    'stripe_session_id', 
    'issued_at'
];

    public function resident()
    {
        return $this->belongsTo(Residents::class);
    }
}
