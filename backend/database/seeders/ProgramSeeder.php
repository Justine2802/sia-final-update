<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Programs;
use App\Models\Residents;
use Illuminate\Support\Facades\DB;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Define the specific programs allowed by your ProgramsController validation
        $programsData = [
            [
                'program_name' => 'Senior Citizen Pension',
                'description' => 'Social Pension for Indigent Senior Citizens to augment daily subsistence.',
                'budget_allocation' => 150000.00,
            ],
            [
                'program_name' => 'TUPAD',
                'description' => 'Tulong Panghanapbuhay sa Ating Disadvantaged/Displaced Workers.',
                'budget_allocation' => 250000.00,
            ],
            [
                'program_name' => 'Rice Distribution',
                'description' => 'Monthly rice subsidy distribution for qualified indigent families.',
                'budget_allocation' => 50000.00,
            ],
            [
                'program_name' => 'Financial Aid',
                'description' => 'Emergency financial assistance for medical or burial expenses.',
                'budget_allocation' => 100000.00,
            ],
        ];

        // 2. Insert Programs and capture them
        foreach ($programsData as $data) {
            $program = Programs::create($data);

            // 3. Optional: Link the first resident to ALL programs for testing
            // This ensures your "Enrollments" table is populated immediately
            $resident = Residents::first();
            
            if ($resident) {
                DB::table('program_resident')->insert([
                    'resident_id' => $resident->id,
                    'program_id' => $program->id,
                    'status' => 'Applied', // Starting status
                    'date_applied' => now(),
                    'remarks' => 'Initial seed enrollment.',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}