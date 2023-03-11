<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MarkLocationVisitedRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'name' => 'nullable|string',
            'photo_url' => 'nullable|string',
            'address' => 'nullable|string',
            'visited_with' => 'nullable|integer|exists:users,id'
        ];
    }
}
