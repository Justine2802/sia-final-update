<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use App\Models\Certificates; 
use Illuminate\Support\Facades\Mail;

class AutomationController extends Controller
{
    public function createCheckout(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $session = Session::create([
            'payment_method_types' => ['card'], 
            'line_items' => [[
                'price_data' => [
                    'currency' => 'php',
                    'product_data' => [
                        'name' => $request->certificate_type,
                        'description' => 'Purpose: ' . $request->purpose,
                    ],
                    'unit_amount' => $request->price * 100, // 50.00 PHP
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            // Pass the record ID so we know which one to update on success
            'success_url' => url('/api/automation/success?id=' . $request->id),
            'cancel_url' => url('/dashboard'),
        ]);

        return response()->json(['url' => $session->url]);
    }

    public function paymentSuccess(Request $request)
{
    $id = $request->query('id');
    
    // 1. Find the certificate AND the resident linked to it
    $record = Certificates::with('resident')->find($id);

    if ($record) {
        $record->update(['status' => 'Paid']);

        // 2. Send the email to the resident's actual email address
        if ($record->resident) {
            Mail::send('emails.receipt', ['record' => $record], function ($m) use ($record) {
                $m->to($record->resident->email)->subject('Payment Confirmed - Simplipiká');
            });
        }
    }

    return redirect('http://localhost:5173/dashboard?payment=success');
}
}