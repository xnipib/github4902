<?php

namespace App\Http\Controllers\Social;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;

class FollowingController extends Controller
{
	public function store(User $user)
    {
        auth()->user()->follow($user);
    }

    public function destroy(User $user)
    {
        auth()->user()->followingsRelation()->where('user_id', $user->id)->delete();
    }

    public function followings()
    {
        ray()->queries();
        return UserResource::collection(auth()->user()->followings);
    }

    public function search()
    {
        request()->validate([
            'email' => 'required|email',
        ]);
        $userId = auth()->user()->id;
        $email = request()->input('email');
        $users = User::query()
            ->select('users.*')
            ->addSelect(\DB::raw("(case when (SELECT COUNT(*) from follows where follows.following_user_id = {$userId}  and follows.user_id = users.id) then 1 else 0 end )as followed"))
            ->where('id', '!=', auth()->id())
            ->where('email', 'like', "%$email%")
            ->get();
        return UserResource::collection($users);
    }
}
