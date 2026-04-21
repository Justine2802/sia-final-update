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
        $middleware->validateCsrfTokens(except: [
            'residents',
            'residents/*',
            'incidents',
            'incidents/*',
            'certificates',
            'certificates/*',
            'programs',
            'programs/*',
            'prog_res',
            'prog_res/*',
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