<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AutomationController;


Route::post('/automation/stripe-checkout', [AutomationController::class, 'createCheckout']);
Route::get('/automation/success', [AutomationController::class, 'paymentSuccess']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');