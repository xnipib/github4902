<?php

namespace App\Http\Controllers\Me;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;

class MeController extends Controller
{
	public function profile()
	{
		return new UserResource(auth()->user());
	}
}
