<?php

namespace App\Http\Controllers;

use App\Models\Programs;
use App\Models\Residents;
use Illuminate\Http\Request;

class ProgramsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Programs::all(), 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_name'      => 'required|in:Senior Citizen Pension,TUPAD,Rice Distribution,Financial Aid',
            'description'       => 'required|string',
            'budget_allocation' => 'required|numeric',
        ]);

        $programs = Programs::create($validated);

        return response()->json([
            'message' => 'Social assistance program created.',
            'data' => $programs
        ], 211);
    }

    /**
     * Display the specified resource.
     */
    public function show(Programs $programs)
    {
        return response()->json($programs->load('residents'), 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Programs $programs)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Programs $programs)
    {
        $validated = $request->validate([
            'program_name'      => 'sometimes|in:Senior Citizen Pension,TUPAD,Rice Distribution,Financial Aid',
            'description'       => 'sometimes|string',
            'budget_allocation' => 'sometimes|numeric',
        ]);

        $programs->update($validated);

        return response()->json([
            'message' => 'Program details updated.',
            'data' => $programs
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Programs $programs)
    {
        $programs->delete();
        return response()->json(['message' => 'Program deleted.'], 200);
    }

    public function enroll(Request $request, Programs $programs)
    {
        $validated = $request->validate([
            'residents_id' => 'required|exists:residents,id',
            'remarks'      => 'nullable|string'
        ]);

        // Attaches the resident to the program in the pivot table
        $programs->residents()->attach($validated['residents_id'], [
            'status' => 'Approved',
            'date_applied' => now(),
            'remarks' => $request->remarks
        ]);

        return response()->json([
            'message' => 'Resident successfully enrolled in the program.'
        ], 200);
    }
}
