<?php

namespace App\Http\Controllers\Location;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Grimzy\LaravelMysqlSpatial\Types\Point;

class LocationController extends Controller
{
    public function update()
    {
        $validated = request()->validate([
            'location' => 'required|array',
            'location.lat' => 'required|min:-90|max:90',
            'location.lng' => 'required|min:-180|max:180',
        ]);
        $user = auth()->user();
        $user->location = new Point($validated['location']['lat'], $validated['location']['lng']);
        $user->save();
        return new UserResource($user);
    }
}
