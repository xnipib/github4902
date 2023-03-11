<?php

namespace App\Http\Controllers\Location;

use App\Http\Controllers\Controller;
use App\Http\Requests\MarkLocationVisitedRequest;
use App\Http\Requests\NearbyRequest;
use App\Http\Resources\PlaceResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\VisitResource;
use App\Models\Location;
use App\Models\User;
use Grimzy\LaravelMysqlSpatial\Types\Point;
use Illuminate\Support\Facades\Http;

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

    public function setLocationVisibility(): UserResource
    {
        $validated = request()->validate([
            'location_visible' => 'required|boolean',
        ]);
        /* @var User $user */
        $user = auth()->user();
        $user->location_visible = $validated['location_visible'];
        $user->save();
        return new UserResource($user);
    }
    
    public function nearby(NearbyRequest $request)
    {
        $latitude = $request->input('latitude');
        $longitude = $request->input('longitude');
        $keyword = $request->input('keyword');
    
        $places = $this->getPlacesNearby($latitude, $longitude, $keyword);


        
        return  PlaceResource::collection($places->results);
    }

    private function getPlacesNearby($latitude, $longitude, $keyword)
    {
        $client = new \GuzzleHttp\Client();
        $response = $client->get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', [
            'query' => [
                'location' => "$latitude,$longitude",
                'radius' => 500, // in meters
                'keyword' => $keyword,
                'key' => env('GOOGLE_MAPS_API_KEY'),
            ]
        ]);
   
        return json_decode($response->getBody()->getContents());
    }


    public function markLocationVisited(MarkLocationVisitedRequest $request)
    {
        $location = Location::updateOrCreate(
            [
                'longitude' => $request->input('longitude'),
                'latitude' => $request->input('latitude'),
            ],
            [
                'name' => $request->input('name') ?? '',
                'address' => $request->input('address') ?? '',
                'photo_url' => $request->input('photo_url') ?? '',
            ]
        );
        
        $visit = auth()->user()->visits()->firstOrCreate([
            'location_id' => $location->id,
            'visited_with' => $request->input('visited_with') ?? null,
        ]);

        return new VisitResource($visit);
    }

    public function visitedLocations()
    {
        $visits = auth()->user()->visits()->with('location', 'visitedWith')->get();
        return VisitResource::collection($visits);
    }
}
