<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CertificatesController;
use App\Http\Controllers\IncidentsController;
use App\Http\Controllers\ProgramResidentsController;
use App\Http\Controllers\ProgramsController;
use App\Http\Controllers\ResidentsController;
use App\Http\Controllers\PaymentAutomationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Stripe Payment Route (Public, but requires session or token for security)
// the user's login session or Bearer tokens.
Route::get('/payment/success', [PaymentAutomationController::class, 'handleSuccess'])
    ->name('payment.success');

// Authentication
Route::post('/residents/register', [ResidentsController::class, 'register']);
Route::post('/residents/login', [ResidentsController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);




 Route::post('/automation/stripe-checkout', [PaymentAutomationController::class, 'startPayment']);
Route::middleware('auth:sanctum')->group(function () {
    
    // User Info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Stripe Initialization
   

    // Document & Incident Submissions
    Route::post('/residents/certificates', [CertificatesController::class, 'store']);
    Route::post('/residents/incidents', [IncidentsController::class, 'store']);
    
});



Route::prefix('admin')->middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::get('/certificates/stats', [CertificatesController::class, 'getCollectionStats']);
    // CRUD Resources
    Route::apiResource('residents', ResidentsController::class);
    Route::apiResource('incidents', IncidentsController::class);
    Route::apiResource('certificates', CertificatesController::class);
    Route::apiResource('programs', ProgramsController::class);
    Route::apiResource('enrollments', ProgramResidentsController::class);

    // Custom Admin logic
    Route::get('/residents/{id}/history', [ResidentsController::class, 'getActivityHistory']);
    Route::post('programs/{program}/enroll', [ProgramResidentsController::class, 'enroll']);
    
});