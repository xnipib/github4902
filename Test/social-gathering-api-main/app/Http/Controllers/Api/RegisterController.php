<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;

class RegisterController extends Controller
{
    /**
     * Register new users.
     *
     * @param  \Requests\Auth\RegisterRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(RegisterRequest $request)
    { 
        $credentials = $request->credentials();
        unset($credentials['password_confirmation']);
        return response()->json([
            'status' => true,
            'user' => $user = User::create($credentials),
            'token' => $user->createToken('access token')->plainTextToken
        ], 201);
    }
}
