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
        return response()->json([
            'status' => true,
            'user' => $user = User::create($request->credentials()),
            'token' => $user->createToken('access token')->plainTextToken
        ], 201);
    }
}
