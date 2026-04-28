<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        
        // 1. Tell Laravel what 'is_admin' means
        $middleware->alias([
            'is_admin' => \App\Http\Middleware\IsAdmin::class,
        ]);

        // 2. Your existing CSRF exclusions
        $middleware->validateCsrfTokens(except: [
            'residents/login',
            'residents/register',
            'admin/residents',
            'admin/residents/*',
            'admin/incidents',
            'admin/incidents/*',
            'admin/certificates',
            'admin/certificates/*',
            'admin/programs',
            'admin/programs/*',
            'admin/prog_res',
            'admin/prog_res/*',
            'admin/login',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

/*
Route::resource('residents', ResidentsController::class);
Route::resource('incidents', IncidentsController::class);
Route::resource('certificates', CertificatesController::class);
Route::resource('programs', ProgramsController::class);
Route::resource('prog_res', ProgramResidentsController::class);
*/