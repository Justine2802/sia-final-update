<?php

namespace App\Http\Controllers;

use App\Models\Residents;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\ResidentActivity;


class ResidentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $residents = Residents::all();
        return response()->json($residents, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json(Residents::all(), 200);
    }

    /**
     * Register a new resident
     */
    public function register(Request $request)
    {
        // 1. Validate the incoming React data
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'middle_name' => 'nullable|string|max:50',
            'last_name' => 'required|string|max:50',
            'birth_date' => 'required|date',
            'gender' => 'required|in:Male,Female',
            'civil_status' => 'required|in:Single,Married,Widowed,Separated',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100', // Remove 'unique' rule if updating
            'address' => 'required|string|max:255',
            'purok' => 'nullable|string|max:50',
            'occupation' => 'nullable|string|max:100',
            'is_voter' => 'required|boolean',
            'is_verified' => 'required|boolean',
            'password' => 'nullable|string|min:6'
        ]);

        // 2. Create the Resident and HASH the password
        $resident = Residents::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'birth_date' => date('Y-m-d H:i:s', strtotime($validated['birth_date'])),
            'address' => $validated['address'],
            'password' => Hash::make($validated['password']), // NEVER save raw passwords!
        ]);

        // 3. Return the response in the exact format React is expecting
        return response()->json([
            'message' => 'Account created successfully',
            'data' => $resident
        ], 201);
    }

    // This function will get the history for a specific resident
public function getActivityHistory($id)
{
    $activities = ResidentActivity::where('resident_id', $id)
                    ->orderBy('created_at', 'desc')
                    ->get();

    return response()->json($activities);
}


    /**
     * Login resident
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $resident = Residents::where('email', $validated['email'])->first();

        if (!$resident || !Hash::check($validated['password'], $resident->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'data' => $resident
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name'  => 'required|string|max:50',
            'email'      => 'nullable|email|unique:residents,email',
            'phone'      => 'nullable|string|max:20',
            'birth_date' => 'required|date',
            'address'    => 'required|string|max:255',
            'password'   => 'nullable|string|min:6',
            'is_verified' => 'boolean'
        ]);

        // Hash password if provided
        if (isset($validated['password']) && $validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $resident = Residents::create($validated);

        return response()->json([
            'message' => 'Resident registered successfully',
            'data' => $resident
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Residents $residents)
    {
        return response()->json($residents, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Residents $residents)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Residents $residents)
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:50',
            'last_name'  => 'sometimes|string|max:50',
            'email'      => 'sometimes|email|unique:residents,email,' . $residents->id,
            'phone'      => 'sometimes|string|max:20',
            'birth_date' => 'sometimes|date',
            'address'    => 'sometimes|string|max:255',
            'is_verified' => 'sometimes|boolean'
        ]);

        $residents->update($validated);

        return response()->json([
            'message' => 'Resident records updated',
            'data' => $residents
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Residents $residents)
    {
        $residents->delete();

        return response()->json([
            'message' => 'Resident record deleted'
        ], 200);
    }
}
