<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ExpenseController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

//Route::middleware(['auth', 'verified'])->group(function () {
//    Route::resource('expenses', ExpenseController::class);
//});
//
//Route::middleware(['auth', 'verified'])->group(function () {
//    Route::resource('accounts', AccountController::class);
//});
//
//Route::middleware(['auth', 'verified'])->group(function () {
//    Route::resource('categories', CategoryController::class);
//});

//expense-tracker-routes
Route::middleware(['auth'])->group(function () {
    Route::resource('/expenses', ExpenseController::class);
    Route::resource('/accounts', AccountController::class);
    Route::resource('/categories', CategoryController::class);
});

//Route::resource('accounts', AccountController::class);
//Route::resource('categories', CategoryController::class);
//Route::resource('expenses', ExpenseController::class);

require __DIR__.'/settings.php';
