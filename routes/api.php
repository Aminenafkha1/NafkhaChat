<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\PassportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'v1', 'middleware' => 'cors'], function () {
    //unauthenticated routes (public) for All users type here here
    Route::post('login', [PassportController::class, 'login']);
    Route::post('signup', [PassportController::class, 'register']);

    Route::middleware(['auth:api'])->group(function () {
        // authenticated routes for all users type here 
        Route::get('user/me', [PassportController::class, 'getMe']);
        Route::post('chat/sendmsg', [ChatController::class, 'sendMessage']);
        Route::get('users', [PassportController::class, 'getUsers']);
        Route::get('messages/{user_id}', [ChatController::class, 'chatWith']);

    });
});
