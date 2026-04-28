<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function adminLogin(Request $request)
    {
        // 1. Validate the incoming React data
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // 2. Auth::attempt automatically checks the `users` table
        if (Auth::attempt($credentials)) {
            // Regenerate session to prevent fixation attacks
            $request->session()->regenerate(); 
            
            $admin = Auth::user();

            // 3. Send the data back to React, explicitly attaching the 'admin' role
            return response()->json([
                'message' => 'Admin logged in successfully',
                'data' => [
                    'id' => $admin->id,
                    'name' => $admin->name, 
                    'email' => $admin->email,
                    'role' => 'admin' // The React frontend needs this to route correctly
                ]
            ]);
        }

        // 4. Return an error if credentials don't match the users table
        return response()->json([
            'message' => 'Invalid admin credentials'
        ], 401);
    }
}