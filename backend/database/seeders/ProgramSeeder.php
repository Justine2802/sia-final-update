<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $program = \App\Models\Programs::create([
            'program_name' => 'Rice Distribution',
            'description' => 'Monthly rice subsidy for qualified residents.',
            'budget_allocation' => 50000.00,
        ]);

        // Link the first resident to this program
        $resident = \App\Models\Residents::first();
        if ($resident) {
            \DB::table('program_resident')->insert([
                'resident_id' => $resident->id,
                'program_id' => $program->id,
                'status' => 'Approved',
                'date_applied' => now(),
                'remarks' => 'Qualified for subsidy.',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
