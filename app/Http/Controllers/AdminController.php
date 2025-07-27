<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\UserCourseProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\CourseLesson;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Get basic statistics
        $stats = [
            'totalUsers' => User::count(),
            'totalCourses' => Course::count(),
            'activeEnrollments' => UserCourseProgress::where('status', 'in_progress')->count(),
            'completionRate' => $this->calculateCompletionRate(),
        ];

        // Get recent users
        $recentUsers = User::latest()
            ->take(5)
            ->get(['id', 'name', 'email', 'created_at'])
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at->diffForHumans(),
                ];
            });

        // Get course progress data
        $courseProgress = Course::withCount(['enrollments as enrolled_count'])
            ->withCount(['enrollments as active_users' => function ($query) {
                $query->where('status', 'in_progress');
            }])
            ->get()
            ->map(function ($course) {
                $totalEnrollments = $course->enrollments()->count();
                $completedEnrollments = $course->enrollments()->where('status', 'completed')->count();
                
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'enrolled_count' => $course->enrolled_count,
                    'active_users' => $course->active_users,
                    'completion_rate' => $totalEnrollments > 0 ? round(($completedEnrollments / $totalEnrollments) * 100) : 0,
                ];
            })
            ->take(4);

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'courseProgress' => $courseProgress,
        ]);
    }

    private function calculateCompletionRate()
    {
        $totalEnrollments = UserCourseProgress::count();
        $completedEnrollments = UserCourseProgress::where('status', 'completed')->count();
        
        return $totalEnrollments > 0 ? round(($completedEnrollments / $totalEnrollments) * 100) : 0;
    }

    public function users()
    {
        $users = User::with('courseProgress')
            ->withCount('courseProgress')
            ->latest()
            ->paginate(20)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at->format('M j, Y'),
                    'course_progress_count' => $user->course_progress_count,
                ];
            });

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function courses()
    {
        $courses = Course::withCount(['enrollments', 'lessons'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Courses', [
            'courses' => $courses,
        ]);
    }

    public function createCourse()
    {
        return Inertia::render('Admin/CreateCourse');
    }

    public function storeCourse(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'slug' => 'required|string|unique:courses,slug',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'duration_weeks' => 'required|integer|min:1',
            'time_commitment_hours' => 'required|integer|min:1',
            'language' => 'required|string|max:50',
            'learning_objectives' => 'nullable|string',
            'prerequisites' => 'nullable|string',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('course-thumbnails', 'public');
            $validated['thumbnail'] = $thumbnailPath;
        }

        $course = Course::create($validated);

        return redirect()->route('admin.courses')->with('success', 'Course created successfully!');
    }

    public function courseDetail(Course $course)
    {
        $course->load(['lessons' => function ($query) {
            $query->orderBy('order');
        }]);

        return Inertia::render('Admin/CourseDetail', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'description' => $course->description,
                'slug' => $course->slug,
                'thumbnail' => $course->thumbnail,
                'difficulty' => $course->difficulty,
                'duration_weeks' => $course->duration_weeks,
                'time_commitment_hours' => $course->time_commitment_hours,
                'language' => $course->language,
                'learning_objectives' => $course->learning_objectives,
                'prerequisites' => $course->prerequisites,
                'is_published' => $course->is_published,
                'is_featured' => $course->is_featured,
                'enrollments_count' => $course->enrollments()->count(),
            ],
            'lessons' => $course->lessons->map(function ($lesson) {
                return [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'slug' => $lesson->slug,
                    'summary' => $lesson->summary,
                    'content' => $lesson->content,
                    'duration_minutes' => $lesson->duration_minutes,
                    'order' => $lesson->order,
                    'is_published' => $lesson->is_published,
                    'video_url' => $lesson->video_url,
                    'resources' => $lesson->resources,
                ];
            }),
        ]);
    }

    public function editCourse(Course $course)
    {
        return Inertia::render('Admin/EditCourse', [
            'course' => $course,
        ]);
    }

    public function updateCourse(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'slug' => 'required|string|unique:courses,slug,' . $course->id,
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'duration_weeks' => 'required|integer|min:1',
            'time_commitment_hours' => 'required|integer|min:1',
            'language' => 'required|string|max:50',
            'learning_objectives' => 'nullable|string',
            'prerequisites' => 'nullable|string',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('course-thumbnails', 'public');
            $validated['thumbnail'] = $thumbnailPath;
        }

        $course->update($validated);

        return redirect()->route('admin.courses.detail', $course)->with('success', 'Course updated successfully!');
    }

    public function deleteCourse(Course $course)
    {
        $course->delete();
        return redirect()->route('admin.courses')->with('success', 'Course deleted successfully!');
    }

    public function storeLesson(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:course_lessons,slug',
            'summary' => 'nullable|string',
            'content' => 'required|string',
            'duration_minutes' => 'required|integer|min:1',
            'order' => 'required|integer|min:1',
            'is_published' => 'boolean',
            'video_url' => 'nullable|url',
            'video_file' => 'nullable|file|mimes:mp4,mov,avi,wmv,flv|max:512000', // 500MB max
            'materials' => 'nullable|array',
            'materials.*' => 'file|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,txt,zip,rar|max:51200', // 50MB max per file
        ]);

        // Handle video file upload
        if ($request->hasFile('video_file')) {
            $videoPath = $request->file('video_file')->store('lesson-videos', 'public');
            $validated['video_url'] = $videoPath; // Store file path in video_url field
        }

        // Handle materials upload
        $materials = [];
        if ($request->hasFile('materials')) {
            foreach ($request->file('materials') as $material) {
                $materialPath = $material->store('lesson-materials', 'public');
                $materials[] = [
                    'name' => $material->getClientOriginalName(),
                    'path' => $materialPath,
                    'size' => $material->getSize(),
                    'type' => $material->getMimeType(),
                ];
            }
        }
        $validated['resources'] = $materials;

        $lesson = CourseLesson::create($validated);

        return redirect()->back()->with('success', 'Lesson created successfully!');
    }

    public function updateLesson(Request $request, CourseLesson $lesson)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:course_lessons,slug,' . $lesson->id,
            'summary' => 'nullable|string',
            'content' => 'required|string',
            'duration_minutes' => 'required|integer|min:1',
            'order' => 'required|integer|min:1',
            'is_published' => 'boolean',
            'video_url' => 'nullable|url',
            'video_file' => 'nullable|file|mimes:mp4,mov,avi,wmv,flv|max:512000', // 500MB max
            'materials' => 'nullable|array',
            'materials.*' => 'file|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,txt,zip,rar|max:51200', // 50MB max per file
        ]);

        // Handle video file upload
        if ($request->hasFile('video_file')) {
            $videoPath = $request->file('video_file')->store('lesson-videos', 'public');
            $validated['video_url'] = $videoPath; // Store file path in video_url field
        }

        // Handle materials upload
        $materials = $lesson->resources ?? [];
        if ($request->hasFile('materials')) {
            foreach ($request->file('materials') as $material) {
                $materialPath = $material->store('lesson-materials', 'public');
                $materials[] = [
                    'name' => $material->getClientOriginalName(),
                    'path' => $materialPath,
                    'size' => $material->getSize(),
                    'type' => $material->getMimeType(),
                ];
            }
        }
        $validated['resources'] = $materials;

        $lesson->update($validated);

        return redirect()->back()->with('success', 'Lesson updated successfully!');
    }

    public function deleteLesson(CourseLesson $lesson)
    {
        $lesson->delete();
        return redirect()->back()->with('success', 'Lesson deleted successfully!');
    }

    public function analytics()
    {
        // Monthly user registrations
        $monthlyRegistrations = User::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Course enrollment trends
        $enrollmentTrends = UserCourseProgress::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('Admin/Analytics', [
            'monthlyRegistrations' => $monthlyRegistrations,
            'enrollmentTrends' => $enrollmentTrends,
        ]);
    }

    public function settings()
    {
        return Inertia::render('Admin/Settings');
    }
}
