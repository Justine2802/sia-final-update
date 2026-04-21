<?php

namespace App\Http\Controllers;

use App\Models\Program_Residents;
use App\Models\Programs;
use App\Models\Residents;
use Illuminate\Http\Request;

class ProgramResidentsController extends Controller
{
    /**
     * List all enrollments (Administrative View).
     */
    public function index()
    {
        $prog_res = Program_Residents::all();
        return response()->json($prog_res, 200);
    }

    /**
     * Create a new enrollment (The Enroll Logic).
     * This fulfills the requirement for implementing integration mechanisms[cite: 13, 143].
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'program_id'  => 'required|exists:programs,id',
            'status'      => 'required|in:Applied,Approved,Claimed,Rejected',
            'remarks'     => 'nullable|string'
        ]);

        $prog_res = Program_Residents::create([
            'resident_id'  => $validated['resident_id'],
            'program_id'   => $validated['program_id'],
            'status'       => $validated['status'],
            'date_applied' => now(),
            'remarks'      => $validated['remarks']
        ]);

        return response()->json([
            'message' => 'Resident successfully enrolled in program.',
            'data' => $prog_res
        ], 201);
    }

    /**
     * Show a specific enrollment record.
     */
    public function show($id)
    {
        $prog_res = Program_Residents::findOrFail($id);
        return response()->json($prog_res, 200);
    }

    /**
     * Update an enrollment (e.g., changing status from 'Applied' to 'Approved').
     */
    public function update(Request $request, $id)
    {
        $prog_res = Program_Residents::findOrFail($id);

        $validated = $request->validate([
            'status'  => 'sometimes|in:Applied,Approved,Claimed,Rejected',
            'remarks' => 'sometimes|string'
        ]);

        $prog_res->update($validated);

        return response()->json([
            'message' => 'Enrollment status updated.',
            'data' => $prog_res
        ], 200);
    }

    /**
     * Remove a resident from a program.
     */
    public function destroy($id)
    {
        $prog_res = Program_Residents::findOrFail($id);
        $prog_res->delete();

        return response()->json([
            'message' => 'Enrollment record removed.'
        ], 200);
    }
}