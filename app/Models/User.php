<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the course progress for this user
     */
    public function courseProgress(): HasMany
    {
        return $this->hasMany(UserCourseProgress::class);
    }

    /**
     * Get the courses this user is enrolled in
     */
    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'user_course_progress')
            ->withPivot(['status', 'progress_percentage', 'started_at', 'completed_at'])
            ->withTimestamps();
    }

    /**
     * Check if user is enrolled in a specific course
     */
    public function isEnrolledIn($courseId)
    {
        return $this->courseProgress()->where('course_id', $courseId)->exists();
    }

    /**
     * Get user's progress for a specific course
     */
    public function getCourseProgress($courseId)
    {
        return $this->courseProgress()->where('course_id', $courseId)->first();
    }

    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->is_admin;
    }
}
