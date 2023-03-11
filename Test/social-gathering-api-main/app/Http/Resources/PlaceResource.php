<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PlaceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'name' => $this->name,
            'address' => $this->vicinity,
            'location' => [
                'latitude' => $this->geometry->location->lat,
                'longitude' => $this->geometry->location->lng,
            ],
            'photo_url' => isset($this->photos) ? 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' . $this->photos[0]?->photo_reference . '&key=' . env('GOOGLE_MAPS_API_KEY') : null,
            'rating' => $this->rating,
        ];
    }
}
