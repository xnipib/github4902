<?php

namespace App\Http\Requests;


use App\Http\Controllers\Api\Rules\isValidPasswordRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
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
     * @return array
     */
    public function rules()
    {
        return [
            'name'             => ['nullable', 'min:2'],
            'email'            => ['nullable', 'email:dns,rfc', 'unique:users,email'],
            'password'         => ['nullable', 'min:8'],
            'current_password' => ['required_with:password'],
            'photo'            => ['image', 'nullable'],
        ];
    }

}
