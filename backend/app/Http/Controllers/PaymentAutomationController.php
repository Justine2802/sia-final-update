<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use App\Models\Certificates;
use Illuminate\Support\Facades\Log;
use Exception;

class PaymentAutomationController extends Controller
{
    /**
     * Start the Stripe Checkout Process
     */
    public function startPayment(Request $request)
{
    \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

    try {
        // If the resident is paying for an existing request, find it by ID
        // Ensure your React frontend is sending 'cert_id'
        $cert = Certificates::find($request->cert_id);

        if (!$cert) {
            // If it's a brand new request from the resident side:
            $cert = Certificates::create([
                'resident_id' => $request->resident_id, 
                'certificate_type' => $request->certificate_type,
                'purpose' => $request->purpose,
                'amount' => $request->price,
                'status' => 'Pending Payment', 
            ]);
        }

        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'php',
                    'product_data' => ['name' => $cert->certificate_type],
                    'unit_amount' => (int)($cert->amount * 100), 
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('payment.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => 'http://localhost:5173/certificates?payment=cancelled',
            'metadata' => ['cert_id' => $cert->id]
        ]);

        $cert->update(['stripe_session_id' => $session->id]);

        return response()->json(['url' => $session->url]);

    } catch (\Exception $e) {
        // This log will tell you exactly why the 500 error happened
        \Illuminate\Support\Facades\Log::error('Stripe Error: ' . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    /**
     * Handle the redirect back from Stripe after payment
     */
    public function handleSuccess(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret') ?? env('STRIPE_SECRET'));
        
        $sessionId = $request->query('session_id');

        // Validation: If it's just the placeholder string, redirect away
        if (!$sessionId || $sessionId === '{CHECKOUT_SESSION_ID}') {
            return redirect('http://localhost:5173/certificates?payment=invalid');
        }

        try {
            // 1. Retrieve the session from Stripe
            $session = Session::retrieve($sessionId);
            
            // 2. Find the certificate using the metadata we sent in startPayment
            $cert = Certificates::find($session->metadata->cert_id);

            if ($cert && $session->payment_status === 'paid') {
                // 3. Update the status so it counts towards "Collection Today"
                $cert->update([
                    'status' => 'Requested', 
                    'amount' => $session->amount_total / 100, // Ensure exact amount paid is saved
                ]);

                // Optional: Trigger your email notification here

                return redirect('http://localhost:5173/certificates?payment=success');
            }

            return redirect('http://localhost:5173/certificates?payment=failed');

        } catch (Exception $e) {
            Log::error('Stripe Success Handler Error: ' . $e->getMessage());
            return redirect('http://localhost:5173/certificates?payment=error');
        }
    }
}