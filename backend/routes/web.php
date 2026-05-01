<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CertificatesController;
use App\Http\Controllers\IncidentsController;
use App\Http\Controllers\ProgramResidentsController;
use App\Http\Controllers\ProgramsController;
use App\Http\Controllers\ResidentsController;
use App\Http\Controllers\PaymentAutomationController; // New Controller
use Illuminate\Support\Facades\Route;

// Public / Welcome
Route::get('/', function () {
    return view('welcome');
});

// Authentication Routes
Route::post('/residents/register', [ResidentsController::class, 'register']);
Route::post('/residents/login', [ResidentsController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

// --- STRIPE & AUTOMATION ROUTES ---
// These are placed outside the admin prefix so residents can access them.
Route::post('/automation/stripe-checkout', [PaymentAutomationController::class, 'startPayment']);

// Success route: Stripe redirects here. We use a GET route because Stripe 
// redirects via the browser address bar.
Route::get('/automation/success', [PaymentAutomationController::class, 'handleSuccess'])->name('payment.success');

// Resident Resource Access (Non-Admin versions)
// If you want residents to view/create their own certificates/incidents
Route::get('/residents/certificates', [CertificatesController::class, 'index']);
Route::post('/residents/certificates', [CertificatesController::class, 'store']);
Route::get('/residents/incidents', [IncidentsController::class, 'index']);
Route::post('/residents/incidents', [IncidentsController::class, 'store']);

// Admin Protected Routes
Route::prefix('admin')->middleware(['auth', 'is_admin'])->group(function () {
    
    // Residents Specific
    Route::get('/residents', [ResidentsController::class, 'index'])->name('admin.residents.index');
    Route::get('/residents/{id}/history', [ResidentsController::class, 'getActivityHistory'])->name('admin.residents.history');
    Route::get('/residents/{id}/edit', [ResidentsController::class, 'edit'])->name('admin.residents.edit');
    Route::put('/residents/{id}', [ResidentsController::class, 'update'])->name('admin.residents.update');

    // CRUD Resources
    // Note: ensure model names in controllers match singular/plural route params
    Route::apiResource('residents', ResidentsController::class);
    Route::apiResource('incidents', IncidentsController::class);
    Route::apiResource('certificates', CertificatesController::class);
    Route::apiResource('programs', ProgramsController::class);
    Route::apiResource('enrollments', ProgramResidentsController::class);

    // Custom Enrollment Trigger
    Route::post('programs/{program}/enroll', [ProgramResidentsController::class, 'enroll'])->name('programs.enroll');
});