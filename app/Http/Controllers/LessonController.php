<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\CourseLesson;
use App\Models\UserCourseProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LessonController extends Controller
{
    /**
     * Display the specified lesson
     */
    public function show(Course $course, CourseLesson $lesson)
    {
        if (!$course->is_published || !$lesson->is_published) {
            abort(404);
        }

        // Check if user is enrolled
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();
        $userProgress = $user->getCourseProgress($course->id);

        if (!$userProgress) {
            return redirect()->route('courses.show', $course)
                ->with('error', 'You must enroll in this course to access lessons.');
        }

        // Mark course as started if not already
        if ($userProgress->status === 'not_started') {
            $userProgress->markAsStarted();
        }

        // Get all lessons for navigation
        $lessons = $course->publishedLessons()->get();
        $currentLessonIndex = $lessons->search(function ($item) use ($lesson) {
            return $item->id === $lesson->id;
        });

        $nextLesson = $currentLessonIndex < $lessons->count() - 1 ? $lessons[$currentLessonIndex + 1] : null;
        $previousLesson = $currentLessonIndex > 0 ? $lessons[$currentLessonIndex - 1] : null;

        // Only track lesson access if course is not completed (to avoid affecting progress)
        if ($userProgress->progress_percentage < 100) {
            $userProgress->trackLessonAccess($lesson->id, false);
            $userProgress->refresh();
        }

        // Check if lesson is completed
        $isLessonCompleted = $userProgress->isLessonCompleted($lesson->id);

        return Inertia::render('Lessons/Show', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
            ],
            'lesson' => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'content' => $lesson->content,
                'slug' => $lesson->slug,
                'summary' => $lesson->summary,
                'video_url' => $lesson->video_url,
                'duration_minutes' => $lesson->duration_minutes,
                'order' => $lesson->order,
                'resources' => $lesson->resources,
                'is_completed' => $isLessonCompleted,
            ],
            'navigation' => [
                'next_lesson' => $nextLesson ? [
                    'id' => $nextLesson->id,
                    'title' => $nextLesson->title,
                    'slug' => $nextLesson->slug,
                ] : null,
                'previous_lesson' => $previousLesson ? [
                    'id' => $previousLesson->id,
                    'title' => $previousLesson->title,
                    'slug' => $previousLesson->slug,
                ] : null,
                'current_index' => $currentLessonIndex + 1,
                'total_lessons' => $lessons->count(),
                'is_course_completed' => $userProgress->progress_percentage >= 100,
            ],
            'userProgress' => [
                'progress_percentage' => $userProgress->progress_percentage,
                'status' => $userProgress->status,
                'completed_lessons' => $userProgress->completed_lessons ?? [],
                'time_spent' => $userProgress->getFormattedTimeSpent(),
                'estimated_completion' => $userProgress->getEstimatedTimeToCompletion(),
            ],
            'user' => $user,
        ]);
    }

    /**
     * Mark lesson as completed
     */
    public function complete(Request $request, Course $course, CourseLesson $lesson)
    {
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = auth()->user();
        $userProgress = $user->getCourseProgress($course->id);

        if (!$userProgress) {
            return response()->json(['error' => 'Not enrolled in course'], 400);
        }

        // Mark lesson as completed
        $userProgress->markLessonCompleted($lesson->id);

        // Get updated progress data
        $userProgress->refresh();

        // Return Inertia response with flash data
        return back()->with('data', [
            'progress_percentage' => $userProgress->progress_percentage,
            'status' => $userProgress->status,
            'completed_lessons' => $userProgress->completed_lessons ?? [],
            'time_spent' => $userProgress->getFormattedTimeSpent(),
            'estimated_completion' => $userProgress->getEstimatedTimeToCompletion(),
            'next_lesson' => $userProgress->getNextLesson() ? [
                'id' => $userProgress->getNextLesson()->id,
                'title' => $userProgress->getNextLesson()->title,
                'slug' => $userProgress->getNextLesson()->slug,
            ] : null,
        ]);
    }

    /**
     * Handle forward navigation and track progress
     */
    public function navigateForward(Request $request, Course $course, CourseLesson $lesson)
    {
        if (!auth()->check()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            return back()->with('error', 'Unauthorized');
        }

        $user = auth()->user();
        $userProgress = $user->getCourseProgress($course->id);

        if (!$userProgress) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Not enrolled in course'], 400);
            }
            return back()->with('error', 'Not enrolled in course');
        }

        // Only track progress if course is not completed (to avoid affecting completed course progress)
        if ($userProgress->progress_percentage < 100) {
            $userProgress->trackLessonAccess($lesson->id, true);
            $userProgress->refresh();
        }

        // Get the next lesson
        $nextLesson = $userProgress->getNextLesson();
        
        // Prepare updated progress data
        $updatedProgressData = [
            'progress_percentage' => $userProgress->progress_percentage,
            'status' => $userProgress->status,
            'completed_lessons' => $userProgress->completed_lessons ?? [],
            'time_spent' => $userProgress->getFormattedTimeSpent(),
            'estimated_completion' => $userProgress->getEstimatedTimeToCompletion(),
        ];
        
        if ($nextLesson) {
            // Return JSON response with updated progress data for AJAX requests
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'progress_data' => $updatedProgressData,
                    'next_lesson_url' => route('lessons.show', [$course->slug, $nextLesson->slug]),
                ]);
            }
            
            // Redirect to next lesson with updated progress data
            return redirect()->route('lessons.show', [$course->slug, $nextLesson->slug])
                ->with('data', $updatedProgressData);
        } else {
            // Course completed
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'progress_data' => $updatedProgressData,
                    'course_completed' => true,
                    'course_url' => route('courses.show', $course->slug),
                ]);
            }
            
            // Redirect to course page with completion message
            return redirect()->route('courses.show', $course->slug)
                ->with('success', 'Congratulations! You have completed this course.');
        }
    }

    /**
     * Complete the entire course (mark final lesson and update course status)
     */
    public function completeCourse(Request $request, Course $course, CourseLesson $lesson)
    {
        if (!auth()->check()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            return back()->with('error', 'Unauthorized');
        }

        $user = auth()->user();
        $userProgress = $user->getCourseProgress($course->id);

        if (!$userProgress) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Not enrolled in course'], 400);
            }
            return back()->with('error', 'Not enrolled in course');
        }

        // Only mark lesson as completed if course is not already completed
        if ($userProgress->progress_percentage < 100) {
            $userProgress->markLessonCompleted($lesson->id);
            $userProgress->refresh();
        }

        // Check if this was the final lesson and course is now completed
        $isCourseCompleted = $userProgress->progress_percentage >= 100;

        // Prepare updated progress data
        $updatedProgressData = [
            'progress_percentage' => $userProgress->progress_percentage,
            'status' => $userProgress->status,
            'completed_lessons' => $userProgress->completed_lessons ?? [],
            'time_spent' => $userProgress->getFormattedTimeSpent(),
            'estimated_completion' => $userProgress->getEstimatedTimeToCompletion(),
        ];

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'progress_data' => $updatedProgressData,
                'course_completed' => $isCourseCompleted,
                'course_url' => route('courses.show', $course->slug),
            ]);
        }

        // Redirect to course page with completion message
        return redirect()->route('courses.show', $course->slug)
            ->with('success', 'Congratulations! You have completed this course.')
            ->with('data', $updatedProgressData);
    }

    /**
     * Update lesson progress (for real-time tracking)
     */
    public function updateProgress(Request $request, Course $course, CourseLesson $lesson)
    {
        if (!auth()->check()) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            return back()->with('error', 'Unauthorized');
        }

        $user = auth()->user();
        $userProgress = $user->getCourseProgress($course->id);

        if (!$userProgress) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Not enrolled in course'], 400);
            }
            return back()->with('error', 'Not enrolled in course');
        }

        // Update last accessed time
        $userProgress->update([
            'last_accessed_at' => now(),
            'course_lesson_id' => $lesson->id,
        ]);

        // Return appropriate response based on request type
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'last_accessed_at' => $userProgress->last_accessed_at,
            ]);
        }

        return back()->with('success', 'Progress updated');
    }
}
