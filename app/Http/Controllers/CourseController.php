<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\UserCourseProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Display a listing of the courses
     */
    public function index()
    {
        $courses = Course::published()
            ->with(['lessons' => function ($query) {
                $query->where('is_published', true);
            }])
            ->orderBy('order')
            ->get()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'description' => $course->description,
                    'slug' => $course->slug,
                    'image' => $course->image,
                    'thumbnail' => $course->thumbnail,
                    'difficulty' => $course->difficulty,
                    'duration_weeks' => $course->duration_weeks,
                    'time_commitment_hours' => $course->time_commitment_hours,
                    'language' => $course->language,
                    'is_featured' => $course->is_featured,
                    'category' => $course->category,
                    'tags' => $course->tags,
                    'total_lessons' => $course->total_lessons,
                    'total_duration' => $course->total_duration,
                    'duration' => $course->duration_weeks . ' weeks',
                    'user_progress' => auth()->check() ? auth()->user()->getCourseProgress($course->id) : null,
                ];
            });

        $featuredCourses = $courses->where('is_featured', true)->values()->toArray();
        $allCourses = $courses->where('is_featured', false)->values()->toArray();

        return Inertia::render('Courses/Index', [
            'featuredCourses' => $featuredCourses,
            'allCourses' => $allCourses,
            'user' => auth()->user(),
        ]);
    }

    /**
     * Display the specified course
     */
    public function show(Course $course)
    {
        if (!$course->is_published) {
            abort(404);
        }

        $course->load(['lessons' => function ($query) {
            $query->where('is_published', true)->orderBy('order');
        }]);

        $userProgress = null;
        if (auth()->check()) {
            $userProgress = auth()->user()->getCourseProgress($course->id);
            if ($userProgress) {
                // Refresh the progress data to ensure it's up to date
                $userProgress->refresh();
            }
        }

        return Inertia::render('Courses/Show', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'description' => $course->description,
                'slug' => $course->slug,
                'image' => $course->image,
                'thumbnail' => $course->thumbnail,
                'difficulty' => $course->difficulty,
                'duration_weeks' => $course->duration_weeks,
                'time_commitment_hours' => $course->time_commitment_hours,
                'language' => $course->language,
                'learning_objectives' => is_array($course->learning_objectives) ? implode("\n• ", array_merge([''], $course->learning_objectives)) : $course->learning_objectives,
                'prerequisites' => $course->prerequisites,
                'category' => $course->category,
                'tags' => $course->tags,
                'total_lessons' => $course->total_lessons,
                'total_duration' => $course->total_duration,
                'duration' => $course->duration_weeks . ' weeks',
                'lessons' => $course->lessons->map(function ($lesson) use ($userProgress) {
                    return [
                        'id' => $lesson->id,
                        'title' => $lesson->title,
                        'slug' => $lesson->slug,
                        'summary' => $lesson->summary,
                        'duration_minutes' => $lesson->duration_minutes,
                        'order' => $lesson->order,
                        'is_completed' => $userProgress ? $userProgress->isLessonCompleted($lesson->id) : false,
                    ];
                })->toArray(),
            ],
            'userProgress' => $userProgress,
            'user' => auth()->user(),
        ]);
    }

    /**
     * Enroll user in a course
     */
    public function enroll(Course $course)
    {
        if (!auth()->check()) {
            return redirect()->route('login')
                ->with('message', 'Please log in to enroll in this course.')
                ->with('returnUrl', route('courses.show', $course));
        }

        $user = auth()->user();

        // Check if already enrolled
        if ($user->isEnrolledIn($course->id)) {
            return redirect()->route('courses.show', $course)
                ->with('info', 'You are already enrolled in this course.');
        }

        // Create enrollment with enhanced tracking
        UserCourseProgress::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'not_started',
            'progress_percentage' => 0,
            'started_at' => now(),
            'last_accessed_at' => now(),
            'completed_lessons' => [],
        ]);

        return redirect()->route('courses.show', $course)
            ->with('success', 'Successfully enrolled in ' . $course->title . '. You can now access all lessons.');
    }

    /**
     * Get user's enrolled courses with enhanced progress data
     */
    public function myCourses()
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();
        $enrolledCourses = $user->courseProgress()
            ->with(['course' => function ($query) {
                $query->with(['lessons' => function ($q) {
                    $q->where('is_published', true)->orderBy('order');
                }]);
            }])
            ->orderBy('last_accessed_at', 'desc')
            ->get()
            ->map(function ($progress) {
                $course = $progress->course;
                $totalLessons = $course->lessons->count();
                $completedLessons = count($progress->completed_lessons ?? []);
                $nextLesson = $progress->getNextLesson();
                
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'description' => $course->description,
                    'slug' => $course->slug,
                    'image' => $course->image,
                    'thumbnail' => $course->thumbnail,
                    'difficulty' => $course->difficulty,
                    'progress_percentage' => $progress->progress_percentage,
                    'status' => $progress->status,
                    'started_at' => $progress->started_at,
                    'last_accessed_at' => $progress->last_accessed_at,
                    'completed_at' => $progress->completed_at,
                    'total_lessons' => $totalLessons,
                    'completed_lessons' => $completedLessons,
                    'time_spent' => $progress->getFormattedTimeSpent(),
                    'estimated_completion' => $progress->getEstimatedTimeToCompletion(),
                    'next_lesson' => $nextLesson ? [
                        'id' => $nextLesson->id,
                        'title' => $nextLesson->title,
                        'slug' => $nextLesson->slug,
                    ] : null,
                    'current_lesson' => $progress->getCurrentLesson() ? [
                        'id' => $progress->getCurrentLesson()->id,
                        'title' => $progress->getCurrentLesson()->title,
                        'slug' => $progress->getCurrentLesson()->slug,
                    ] : null,
                ];
            })
            ->toArray();

        return Inertia::render('Courses/MyCourses', [
            'enrolledCourses' => $enrolledCourses,
            'user' => $user,
        ]);
    }
}
