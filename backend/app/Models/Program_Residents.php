<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program_Residents extends Model
{
    use HasFactory;

    // Optional: Explicitly define the table name just in case Laravel gets confused by the underscore
    protected $table = 'program_resident';

    protected $fillable = [
        'resident_id',
        'program_id',
        'status',
        'date_applied',
        'remarks'
    ];

    /**
     * Get the resident associated with this enrollment.
     */
    public function resident()
    {
        // Using your groupmate's plural model name "Residents"
        return $this->belongsTo(Residents::class, 'resident_id');
    }

    /**
     * Get the program associated with this enrollment.
     */
    public function program()
    {
        // Using your groupmate's plural model name "Programs"
        return $this->belongsTo(Programs::class, 'program_id');
    }
}