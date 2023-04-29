<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\User */
class UserResource extends JsonResource
{
    /**
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'               => $this->id,
            'name'             => $this->name,
            'photo'            => $this->photo,
            'email'            => $this->email,
            'location_visible' => $this->location_visible,
            'location'         => $this->location,
            'followed'         => (bool)$this->followed,
            'distance'         => $this->distance === null ? null : round($this->distance * 0.621371 / 100, 2),
            'created_at'       => $this->created_at,
            'updated_at'       => $this->updated_at,
        ];
    }
}
