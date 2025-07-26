<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class UserCourseProgress extends Model
{
    use HasFactory;

    protected $table = 'user_course_progress';

    protected $fillable = [
        'user_id',
        'course_id',
        'course_lesson_id',
        'status',
        'progress_percentage',
        'started_at',
        'completed_at',
        'last_accessed_at',
        'completed_lessons',
        'accessed_lessons',
    ];

    protected $casts = [
        'completed_lessons' => 'array',
        'accessed_lessons' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'last_accessed_at' => 'datetime',
    ];

    /**
     * Get the user that owns this progress
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the course for this progress
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the current lesson for this progress
     */
    public function currentLesson(): BelongsTo
    {
        return $this->belongsTo(CourseLesson::class, 'course_lesson_id');
    }

    /**
     * Mark lesson as completed
     */
    public function markLessonCompleted($lessonId)
    {
        $completedLessons = $this->completed_lessons ?? [];
        if (!in_array($lessonId, $completedLessons)) {
            $completedLessons[] = $lessonId;
            $this->update([
                'completed_lessons' => $completedLessons,
                'last_accessed_at' => now(),
                'course_lesson_id' => $lessonId, // Update current lesson
            ]);
            
            // Refresh the model to get updated data
            $this->refresh();
            
            // Update progress percentage
            $this->updateProgressPercentage();
            
            // Update status
            $this->updateStatus();
        }
    }

    /**
     * Track lesson access and automatically mark as completed when navigating forward
     */
    public function trackLessonAccess($lessonId, $isForwardNavigation = false)
    {
        $completedLessons = $this->completed_lessons ?? [];
        $accessedLessons = $this->accessed_lessons ?? [];
        
        // Always update last accessed time and current lesson
        $this->update([
            'last_accessed_at' => now(),
            'course_lesson_id' => $lessonId,
        ]);
        
        // Add to accessed lessons if not already there
        if (!in_array($lessonId, $accessedLessons)) {
            $accessedLessons[] = $lessonId;
            $this->update(['accessed_lessons' => $accessedLessons]);
        }
        
        // If this is forward navigation and lesson hasn't been completed yet, mark it as completed
        if ($isForwardNavigation && !in_array($lessonId, $completedLessons)) {
            $this->markLessonCompleted($lessonId);
        }
    }

    /**
     * Check if lesson has been accessed
     */
    public function isLessonAccessed($lessonId)
    {
        $accessedLessons = $this->accessed_lessons ?? [];
        return in_array($lessonId, $accessedLessons);
    }

    /**
     * Update progress percentage
     */
    public function updateProgressPercentage()
    {
        $totalLessons = $this->course->publishedLessons()->count();
        $completedLessons = count($this->completed_lessons ?? []);
        
        if ($totalLessons > 0) {
            $percentage = round(($completedLessons / $totalLessons) * 100);
            $this->update(['progress_percentage' => $percentage]);
        }
    }

    /**
     * Update course status based on progress
     */
    public function updateStatus()
    {
        if ($this->progress_percentage >= 100) {
            $this->update([
                'status' => 'completed',
                'completed_at' => now(),
            ]);
        } elseif ($this->progress_percentage > 0) {
            $this->update(['status' => 'in_progress']);
        }
    }

    /**
     * Mark course as started
     */
    public function markAsStarted()
    {
        $this->update([
            'status' => 'in_progress',
            'started_at' => $this->started_at ?? now(),
            'last_accessed_at' => now(),
        ]);
    }

    /**
     * Get next lesson to complete
     */
    public function getNextLesson()
    {
        $completedLessonIds = $this->completed_lessons ?? [];
        $allLessons = $this->course->publishedLessons()->orderBy('order')->get();
        
        foreach ($allLessons as $lesson) {
            if (!in_array($lesson->id, $completedLessonIds)) {
                return $lesson;
            }
        }
        
        return null;
    }

    /**
     * Get current lesson (last accessed or next to complete)
     */
    public function getCurrentLesson()
    {
        if ($this->course_lesson_id) {
            return $this->course->lessons()->find($this->course_lesson_id);
        }
        
        return $this->getNextLesson();
    }

    /**
     * Check if lesson is completed
     */
    public function isLessonCompleted($lessonId)
    {
        $completedLessons = $this->completed_lessons ?? [];
        return in_array($lessonId, $completedLessons);
    }

    /**
     * Get time spent on course
     */
    public function getTimeSpent()
    {
        if (!$this->started_at) {
            return 0;
        }
        
        $endTime = $this->completed_at ?? now();
        return $this->started_at->diffInMinutes($endTime);
    }

    /**
     * Get formatted time spent
     */
    public function getFormattedTimeSpent()
    {
        $minutes = $this->getTimeSpent();
        $hours = floor($minutes / 60);
        $remainingMinutes = $minutes % 60;
        
        if ($hours > 0) {
            return "{$hours}h {$remainingMinutes}m";
        }
        
        return "{$remainingMinutes}m";
    }

    /**
     * Get estimated time to completion
     */
    public function getEstimatedTimeToCompletion()
    {
        $totalLessons = $this->course->publishedLessons()->count();
        $completedLessons = count($this->completed_lessons ?? []);
        $remainingLessons = $totalLessons - $completedLessons;
        
        if ($remainingLessons <= 0) {
            return 0;
        }
        
        // Estimate 30 minutes per lesson on average
        $estimatedMinutesPerLesson = 30;
        return $remainingLessons * $estimatedMinutesPerLesson;
    }
}
