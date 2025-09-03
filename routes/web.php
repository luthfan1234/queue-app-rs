<?php

use App\Http\Controllers\DisplayController;
use App\Http\Controllers\KioskController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('kiosk');
})->name('home');

Route::get('/kiosk', [KioskController::class, 'index'])->name('kiosk');
Route::post('/kiosk', [KioskController::class, 'store'])->name('kiosk.store');
Route::get('/display-queue', [DisplayController::class, 'index'])->name('display-queue');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('dashboard/call-next', [DashboardController::class, 'callNext'])->name('dashboard.call-next');
    Route::post('dashboard/complete-queue', [DashboardController::class, 'completeQueue'])->name('dashboard.complete-queue');
    Route::post('dashboard/set-counter', [DashboardController::class, 'setCounter'])->name('dashboard.set-counter');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
