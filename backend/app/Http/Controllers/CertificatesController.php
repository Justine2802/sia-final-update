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

    public function getCollectionStats()
{
    // Sum the 'amount' column for all paid/issued certificates today
    $totalToday = Certificates::whereDate('created_at', today())
        ->whereIn('status', ['Paid', 'Requested', 'Issued']) 
        ->sum('amount');

    return response()->json([
        'collection_today' => $totalToday
    ]);
}
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
   public function update(Request $request, $id)
{
    // 1. Manually find the existing record by ID
    $certificate = Certificates::find($id);

    if (!$certificate) {
        return response()->json(['message' => 'Certificate not found'], 404);
    }

    // 2. Validate incoming data
    $validated = $request->validate([
        'status' => 'required|string',
        'amount' => 'nullable|numeric'
    ]);

    // 3. Update the existing instance (DO NOT use Certificates::create)
    $certificate->status = $validated['status'];
    
    if ($request->has('amount')) {
        $certificate->amount = $validated['amount'];
    }

    if ($validated['status'] === 'Issued') {
        $certificate->issued_at = \Carbon\Carbon::now();
    }

    // 4. Save the existing record (this runs an UPDATE query)
    $certificate->save();

    return response()->json([
        'message' => 'Certificate updated successfully.',
        'data' => $certificate
    ], 200);
}
}