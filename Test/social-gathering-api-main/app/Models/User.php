<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use DB;
use Grimzy\LaravelMysqlSpatial\Eloquent\SpatialTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SpatialTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    protected $spatialFields = [
        'location',
    ];

    public function follow(User $user)
    {
        return $this->followingsRelation()->updateOrCreate([
            'user_id' => $user->id,
        ]);
    }

    public function followingsRelation()
    {
        return $this->hasMany(Follow::class, 'following_user_id');
    }
    public function follows(): HasMany
    {
        return $this->hasMany(Follow::class, 'user_id');
    }

    public function followers()
    {
        return $this->hasManyThrough(
            self::class,
            Follow::class,
            'user_id',
            'id',
            'id',
            'following_user_id'
        );
    }

    public function followings()
    {
        return $this->hasManyThrough(
            self::class,
            Follow::class,
            'following_user_id',
            'id',
            'id',
            'user_id'
        );
    }

    public function scopeSelectDistanceTo($query, float $lat, float $lng)
    {
        $query->addSelect(
            DB::raw(
                "(IF (users.location_visible = 1 ,ST_Distance_Sphere(`location`, POINT($lng, $lat)) , NULL) ) as distance"
            )
        );
    }

    public function scopeOrderByDistance($query, float $lat, float $lng)
    {
        $query->orderBy(
            DB::raw(
                "ST_Distance_Sphere(`location`, POINT({$lng}, {$lat}))"
            )
        );
    }
}
