<?php

namespace App\Http\Controllers;

use App\Models\Incidents;
use Illuminate\Http\Request;

class IncidentsController extends Controller
{
    public function index()
    {
        $incidents = Incidents::with('residents')->get();
        return response()->json($incidents, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id'   => 'required|exists:residents,id',
            'incident_type' => 'required|in:Theft,Physical Altercation,Noise Complaint,Property Damage,Other',
            'description'   => 'required|string',
            'status'        => 'nullable|string'
        ]);

        // Default to PENDING if status is not provided
        $validated['status'] = $validated['status'] ?? 'PENDING';

        $incident = Incidents::create($validated);

        return response()->json([
            'message' => 'Incident report filed successfully.',
            'data' => $incident
        ], 201);
    }

    // FIXED: Changed parameter variable to singular $incident for Route Model Binding
    public function update(Request $request, Incidents $incident)
    {
        $validated = $request->validate([
            'status'  => 'required|in:PENDING,RESOLVED,DISMISSED',
            'remarks' => 'nullable|string'
        ]);

        $incident->update($validated);

        return response()->json([
            'message' => 'Incident status updated successfully.',
            'data' => $incident
        ], 200);
    }
    
    public function destroy(Incidents $incident)
    {
        $incident->delete();
        return response()->json(['message' => 'Incident record removed.'], 200);
    }
}