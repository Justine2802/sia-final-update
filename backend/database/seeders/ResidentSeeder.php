<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResidentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a specific resident
        $resident = \App\Models\Residents::create([
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'email' => 'juan@example.com',
            'phone' => '09123456789',
            'birth_date' => '1990-05-15 00:00:00',
            'address' => '123 Maginhawa St, Brgy. 404',
            'is_verified' => true,
            'password' => bcrypt('password123'),
        ]);

        // Create an incident for this resident
        \App\Models\Incidents::create([
            'resident_id' => $resident->id,
            'incident_type' => 'Noise Complaint',
            'description' => 'Loud karaoke at 2 AM.',
            'status' => 'Resolved',
        ]);

        // Create a certificate request
        \App\Models\Certificates::create([
            'resident_id' => $resident->id,
            'certificate_type' => 'Barangay Clearance',
            'purpose' => 'Employment',
            'status' => 'Issued',
            'issued_at' => now(),
        ]);
    }
}
