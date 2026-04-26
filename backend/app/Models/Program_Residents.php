<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program_Residents extends Model
{
    protected $table = 'program_resident';

    protected $fillable = ['resident_id', 'program_id', 'status', 'date_applied', 'remarks'];
}