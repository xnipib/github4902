<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticationController extends Controller
{
    /**
     * Authenticate users.
     *
     * @param  Requests\Auth\LoginRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(LoginRequest $request)
    {
        if (!Auth::attempt($request->validated())) {
            return response()->json([
                'status' => false,
                'message' => 'These credentials do not match our records',
            ], 401);
        }

        // Revoke old token
        $user = User::where('email', $request->email)->first();
        

        return response()->json([
            'status' => true,
            'user' => $user,
            'token' => $user->createToken('access token')->plainTextToken
        ], 200);
    }

    /**
     * Revoke current user access token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->noContent();
    }
}
