<?php

use App\Http\Controllers\Api\AuthenticationController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Location\LocationController;
use App\Http\Controllers\Me\MeController;
use App\Http\Controllers\Social\FollowingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

/* Authentication
----------------*/

Route::post('/register', RegisterController::class)
    ->middleware('guest')
    ->name('register');

Route::post('/login', [AuthenticationController::class, 'store'])
    ->middleware('guest')
    ->name('login');

Route::post('/logout', [AuthenticationController::class, 'destroy'])
    ->middleware('auth:sanctum')
    ->name('logout');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [MeController::class, 'profile'])
        ->name('me.profile');
    Route::put('location' , [LocationController::class, 'update'])
        ->name('location.update');

    Route::group(['prefix' => 'social'], function () {
        Route::post('follow/{user}', [FollowingController::class, 'store'])
            ->name('social.following.store');
        Route::delete('follow/{user}', [FollowingController::class, 'destroy'])
            ->name('social.following.destroy');
        Route::get('followings', [FollowingController::class, 'followings']);
    Route::get('search', [FollowingController::class, 'search'])
        ->name('search');
    });
});
