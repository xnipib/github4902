<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Services\UploadImage;
use Hash;

class MeController extends Controller
{
    public function profile()
    {
        return new UserResource(auth()->user());
    }

    public function update(UpdateProfileRequest $request, UploadImage $uploadImage)
    {
        $user = auth()->user();
        $validated = $request->validated();
        //hash password
        if ($request->has('password')) {
            if (!Hash::check($request->input('current_password'), $user->password)) {
                abort(400, "Invalid current password");
            }
            $validated['password'] = Hash::make($validated['password']);
            unset($validated['current_password']);
        }
        if ($request->hasFile('photo')) {
            $validated['photo'] = $uploadImage->upload($request->file('photo'), env('S3_BUCKET'), 'profile-photos');
        }
        $user->update($validated);

        return new UserResource($user);
    }
}
