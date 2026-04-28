<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is logged in AND their is_admin column is true (1)
        if (Auth::check() && Auth::user()->is_admin) {
            return $next($request); // Let them pass
        }

        // Otherwise, kick them out
        return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
    }
}