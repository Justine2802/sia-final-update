<?php

namespace App\Http\Controllers;

use App\Models\Incidents;
use Illuminate\Http\Request;

class IncidentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $incidents = Incidents::with('residents')->get();
        return response()->json($incidents, 200);
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
            'resident_id'  => 'required|exists:residents,id',
            'incident_type' => 'required|in:Theft,Physical Altercation,Noise Complaint,Other',
            'description'   => 'required|string',
            'status' => 'nullable|string'
        ]);

        $incidents = Incidents::create($validated);

        return response()->json([
            'message' => 'Incident report filed successfully.',
            'data' => $incidents
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Incidents $incidents)
    {
        return response()->json($incidents->load('residents'), 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Incidents $incidents)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Incidents $incidents)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Under Investigation,Resolved',
        ]);

        $incidents->update($validated);

        /**
         * INTEGRATION POINT: SMS Notification
         * The system can send an SMS when a report status changes[cite: 44].
         */

        return response()->json([
            'message' => 'Incident status updated.',
            'data' => $incidents
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Incidents $incidents)
    {
        $incidents->delete();
        return response()->json(['message' => 'Incident record removed.'], 200);
    }
}
