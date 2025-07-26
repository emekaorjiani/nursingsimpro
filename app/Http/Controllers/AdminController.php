<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\UserCourseProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

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
