<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VisitResource extends JsonResource
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
            'id' => $this->id,
            'place' => new LocationResource($this->location),
            'user' => new UserResource($this->user),
            'visited_with' => new UserResource($this->visitedWith),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
