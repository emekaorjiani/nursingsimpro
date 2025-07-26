<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'slug',
        'image',
        'difficulty',
        'duration_weeks',
        'time_commitment_hours',
        'language',
        'learning_objectives',
        'prerequisites',
        'is_published',
        'is_featured',
        'order',
        'category',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    /**
     * Get the lessons for this course
     */
    public function lessons(): HasMany
    {
        return $this->hasMany(CourseLesson::class)->orderBy('order');
    }

    /**
     * Get the user progress for this course
     */
    public function userProgress(): HasMany
    {
        return $this->hasMany(UserCourseProgress::class);
    }

    /**
     * Get the enrollments for this course (alias for userProgress)
     */
    public function enrollments(): HasMany
    {
        return $this->hasMany(UserCourseProgress::class);
    }

    /**
     * Get published lessons only
     */
    public function publishedLessons(): HasMany
    {
        return $this->hasMany(CourseLesson::class)
            ->where('is_published', true)
            ->orderBy('order');
    }

    /**
     * Scope for published courses
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope for featured courses
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Get the total duration of the course in minutes
     */
    public function getTotalDurationAttribute()
    {
        return $this->lessons->sum('duration_minutes');
    }

    /**
     * Get the total number of lessons
     */
    public function getTotalLessonsAttribute()
    {
        return $this->lessons->count();
    }

    /**
     * Get the route key name for the model
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
