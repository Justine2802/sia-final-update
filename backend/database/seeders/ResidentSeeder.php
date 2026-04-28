<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
// Using the correct Singular model names
use App\Models\Residents;
use App\Models\Incidents;
use App\Models\Certificates;

class ResidentSeeder extends Seeder
{
    public function run(): void
    {
        $resident = Residents::create([
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'email' => 'juan@example.com',
            'phone' => '09123456789',
            'birth_date' => '1990-05-15',
            'address' => '123 Maginhawa St, Brgy. 404',
            'purok' => 'Purok 1',
            'gender' => 'Male',
            'civil_status' => 'Single',
            'is_voter' => true,
            'is_verified' => true,
            'password' => bcrypt('password123'),
        ]);

        Residents::factory()->count(10)->create();

        Incidents::create([
            'resident_id' => $resident->id,
            'incident_type' => 'Noise Complaint',
            'description' => 'Loud karaoke at 2 AM.',
            'status' => 'Resolved',
        ]);

        Certificates::create([
            'resident_id' => $resident->id,
            'certificate_type' => 'Barangay Clearance',
            'status' => 'Issued',
        ]);
    }
}