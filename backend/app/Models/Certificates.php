<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificates extends Model
{
    protected $fillable = ['resident_id', 'certificate_type', 'purpose', 'status', 'issued_at'];

    public function resident()
    {
        return $this->belongsTo(Residents::class);
    }
}
