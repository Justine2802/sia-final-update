<?php

use App\Http\Controllers\CertificatesController;
use App\Http\Controllers\IncidentsController;
use App\Http\Controllers\ProgramResidentsController;
use App\Http\Controllers\ProgramsController;
use App\Http\Controllers\ResidentsController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Authentication Routes
Route::post('/residents/register', [ResidentsController::class, 'register']);
Route::post('/residents/login', [ResidentsController::class, 'login']);

//CRUD
Route::resource('residents', ResidentsController::class);
Route::resource('incidents', IncidentsController::class);
Route::resource('certificates', CertificatesController::class);
Route::resource('programs', ProgramsController::class);
Route::resource('enrollments', ProgramResidentsController::class);

//Custom
Route::post('programs/{program}/enroll', [ProgramResidentsController::class, 'enroll'])->name('programs.enroll');