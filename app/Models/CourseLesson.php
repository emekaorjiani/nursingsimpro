<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseLesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'content',
        'slug',
        'summary',
        'video_url',
        'duration_minutes',
        'order',
        'is_published',
        'resources',
    ];

    protected $casts = [
        'resources' => 'array',
        'is_published' => 'boolean',
    ];

    /**
     * Get the course that owns this lesson
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the route key name for the model
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    /**
     * Get the next lesson in the course
     */
    public function getNextLessonAttribute()
    {
        return $this->course->lessons()
            ->where('order', '>', $this->order)
            ->where('is_published', true)
            ->first();
    }

    /**
     * Get the previous lesson in the course
     */
    public function getPreviousLessonAttribute()
    {
        return $this->course->lessons()
            ->where('order', '<', $this->order)
            ->where('is_published', true)
            ->orderBy('order', 'desc')
            ->first();
    }
}
