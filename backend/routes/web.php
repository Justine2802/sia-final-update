<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CertificatesController;
use App\Http\Controllers\IncidentsController;
use App\Http\Controllers\ProgramResidentsController;
use App\Http\Controllers\ProgramsController;
use App\Http\Controllers\ResidentsController;
use Illuminate\Support\Facades\Route;

// Public / Welcome
Route::get('/', function () {
    return view('welcome');
});

// Authentication Routes
Route::post('/residents/register', [ResidentsController::class, 'register']);
Route::post('/residents/login', [ResidentsController::class, 'login']);

Route::post('/admin/login', [AuthController::class, 'adminLogin']);

// Admin Protected Routes
Route::prefix('admin')->middleware(['auth', 'is_admin'])->group(function () {
    
    // Residents Specific
    Route::get('/residents', [ResidentsController::class, 'index'])->name('admin.residents.index');
    Route::get('/residents/{id}/history', [ResidentsController::class, 'getActivityHistory'])->name('admin.residents.history');
    Route::get('/residents/{id}/edit', [ResidentsController::class, 'edit'])->name('admin.residents.edit');
    Route::put('/residents/{id}', [ResidentsController::class, 'update'])->name('admin.residents.update');

    // CRUD Resources (Usually best kept inside admin or protected middleware)
    Route::resource('residents', ResidentsController::class);
    Route::resource('incidents', IncidentsController::class);
    Route::resource('certificates', CertificatesController::class);
    Route::resource('programs', ProgramsController::class);
    Route::resource('enrollments', ProgramResidentsController::class);

    // Custom Enrollment Trigger
    Route::post('programs/{program}/enroll', [ProgramResidentsController::class, 'enroll'])->name('programs.enroll');
});