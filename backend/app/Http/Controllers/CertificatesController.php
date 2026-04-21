<?php

namespace App\Http\Controllers;

use App\Models\Certificates;
use App\Models\Resident;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CertificatesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $certificates = Certificates::with('resident')->get();
        return response()->json($certificates, 200);
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
            'resident_id'      => 'required|exists:residents,id',
            'certificate_type' => 'required|in:Barangay Clearance,Indigency,Residency',
            'purpose'          => 'required|in:Employment,Education,Legal,General',
        ]);

        $certificates = Certificates::create($validated);

        return response()->json([
            'message' => 'Certificate request submitted successfully.',
            'data' => $certificates
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Certificates $certificates)
    {
        return response()->json($certificates->load('resident'), 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Certificates $certificates)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Certificates $certificates)
    {
        $validated = $request->validate([
            'status' => 'required|in:Requested,Processing,Issued,Denied',
        ]);

        $certificates->status = $validated['status'];

        if ($validated['status'] === 'Issued') {
            $certificates->issued_at = Carbon::now();
            
            /*
              INTEGRATION POINT: Notification Service
              Here you would trigger: Mail::to($certificates->resident->email)->send(...);
              As per project requirement 4.3 (Notification Service Integration)
            */
        }

        $certificates->save();

        return response()->json([
            'message' => 'Certificate status updated.',
            'data' => $certificates
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Certificates $certificates)
    {
        $certificates->delete();
        return response()->json(['message' => 'Request deleted.'], 200);
    }
}
