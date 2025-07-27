<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\UserCourseProgress;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\CourseLesson;
use Illuminate\Support\Str;

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
            'totalMessages' => Contact::count(),
            'newMessages' => Contact::new()->count(),
            'unreadMessages' => Contact::unread()->count(),
        ];

        // Get recent users (last 7 days)
        $recentUsers = User::latest()
            ->take(5)
            ->get(['id', 'name', 'email', 'created_at'])
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at->diffForHumans(),
                    'is_recent' => $user->created_at->isAfter(now()->subDays(7)),
                ];
            });

        // Get recent unread and in-progress messages only
        $recentMessages = Contact::whereIn('status', ['new', 'in_progress'])
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'email', 'message', 'status', 'created_at'])
            ->map(function ($contact) {
                return [
                    'id' => $contact->id,
                    'name' => $contact->name,
                    'email' => $contact->email,
                    'message' => \Str::limit($contact->message, 50),
                    'status' => $contact->status,
                    'created_at' => $contact->created_at->diffForHumans(),
                    'is_recent' => $contact->created_at->isAfter(now()->subDays(7)),
                ];
            });

        // Get top 4 most popular courses
        $popularCourses = Course::withCount(['enrollments as enrolled_count'])
            ->withCount(['enrollments as completed_count' => function ($query) {
                $query->where('status', 'completed');
            }])
            ->orderBy('enrolled_count', 'desc')
            ->take(4)
            ->get()
            ->map(function ($course) {
                $totalEnrollments = $course->enrollments()->count();
                $completedEnrollments = $course->enrollments()->where('status', 'completed')->count();
                
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'enrolled_count' => $course->enrolled_count,
                    'completed_count' => $course->completed_count,
                    'completion_rate' => $totalEnrollments > 0 ? round(($completedEnrollments / $totalEnrollments) * 100) : 0,
                    'thumbnail' => $course->thumbnail,
                ];
            });

        // Get detailed activity data for tabulated view
        $activityData = [
            'users' => [
                'new_users_7_days' => User::where('created_at', '>=', now()->subDays(7))->count(),
                'new_users_30_days' => User::where('created_at', '>=', now()->subDays(30))->count(),
                'total_users' => User::count(),
                'active_users' => User::whereHas('courseProgress', function($query) {
                    $query->where('status', 'in_progress');
                })->count(),
            ],
            'messages' => [
                'new_messages_7_days' => Contact::where('created_at', '>=', now()->subDays(7))->count(),
                'new_messages_30_days' => Contact::where('created_at', '>=', now()->subDays(30))->count(),
                'total_messages' => Contact::count(),
                'unread_messages' => Contact::unread()->count(),
                'in_progress_messages' => Contact::where('status', 'in_progress')->count(),
                'resolved_messages' => Contact::where('status', 'resolved')->count(),
            ],
            'enrollments' => [
                'new_enrollments_7_days' => UserCourseProgress::where('created_at', '>=', now()->subDays(7))->count(),
                'new_enrollments_30_days' => UserCourseProgress::where('created_at', '>=', now()->subDays(30))->count(),
                'total_enrollments' => UserCourseProgress::count(),
                'active_enrollments' => UserCourseProgress::where('status', 'in_progress')->count(),
                'completed_enrollments' => UserCourseProgress::where('status', 'completed')->count(),
            ],
            'courses' => [
                'completed_courses_7_days' => UserCourseProgress::where('status', 'completed')
                    ->where('updated_at', '>=', now()->subDays(7))
                    ->count(),
                'completed_courses_30_days' => UserCourseProgress::where('status', 'completed')
                    ->where('updated_at', '>=', now()->subDays(30))
                    ->count(),
                'total_courses' => Course::count(),
                'active_courses' => Course::whereHas('enrollments', function($query) {
                    $query->where('status', 'in_progress');
                })->count(),
            ],
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentMessages' => $recentMessages,
            'popularCourses' => $popularCourses,
            'activityData' => $activityData,
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
        try {
            // Debug: Log what we received
            \Log::info('Course store request received', [
                'has_file' => $request->hasFile('thumbnail'),
                'all_data' => $request->all(),
                'files' => $request->allFiles(),
            ]);

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
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return validation errors with old input data preserved
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput($request->except(['thumbnail'])); // Exclude file from old input
        }
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
        try {
            // Debug: Log what we received
            \Log::info('Course update request received', [
                'has_file' => $request->hasFile('thumbnail'),
                'all_data' => $request->all(),
                'files' => $request->allFiles(),
            ]);

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
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return validation errors with old input data preserved
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput($request->except(['thumbnail'])); // Exclude file from old input
        }
    }

    public function deleteCourse(Course $course)
    {
        $course->delete();
        return redirect()->route('admin.courses')->with('success', 'Course deleted successfully!');
    }

    public function storeLesson(Request $request)
    {
        try {
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
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return validation errors with old input data preserved
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput($request->except(['video_file', 'materials'])); // Exclude files from old input
        }
    }

    public function updateLesson(Request $request, CourseLesson $lesson)
    {
        try {
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
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Return validation errors with old input data preserved
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput($request->except(['video_file', 'materials'])); // Exclude files from old input
        }
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

    // Message Management Methods
    public function messages()
    {
        $contacts = Contact::with('respondedBy')
            ->latest()
            ->paginate(20)
            ->through(function ($contact) {
                return [
                    'id' => $contact->id,
                    'name' => $contact->name,
                    'email' => $contact->email,
                    'institution' => $contact->institution,
                    'message' => $contact->message,
                    'status' => $contact->status,
                    'is_read' => $contact->is_read,
                    'admin_response' => $contact->admin_response,
                    'created_at' => $contact->formatted_created_at,
                    'responded_at' => $contact->formatted_responded_at,
                    'responded_by' => $contact->respondedBy ? $contact->respondedBy->name : null,
                    'status_color' => $contact->status_color,
                    'has_response' => $contact->hasResponse(),
                ];
            });

        // Get contact statistics
        $stats = [
            'total' => Contact::count(),
            'new' => Contact::new()->count(),
            'unread' => Contact::unread()->count(),
            'recent' => Contact::recent()->count(),
        ];

        return Inertia::render('Admin/Messages', [
            'contacts' => $contacts,
            'stats' => $stats,
        ]);
    }

    public function messageDetail(Contact $contact)
    {
        // Mark as read when admin views it
        if (!$contact->is_read) {
            $contact->markAsRead();
        }

        return Inertia::render('Admin/MessageDetail', [
            'contact' => [
                'id' => $contact->id,
                'name' => $contact->name,
                'email' => $contact->email,
                'institution' => $contact->institution,
                'message' => $contact->message,
                'status' => $contact->status,
                'is_read' => $contact->is_read,
                'admin_response' => $contact->admin_response,
                'created_at' => $contact->formatted_created_at,
                'responded_at' => $contact->formatted_responded_at,
                'responded_by' => $contact->respondedBy ? $contact->respondedBy->name : null,
                'status_color' => $contact->status_color,
                'has_response' => $contact->hasResponse(),
            ],
        ]);
    }

    public function respondToMessage(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'response' => 'required|string|max:2000',
        ]);

        $contact->markAsResponded($validated['response'], auth()->id());

        return back()->with('success', 'Message response sent successfully!');
    }

    public function updateMessageStatus(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,in_progress,resolved,closed',
        ]);

        $contact->updateStatus($validated['status']);

        return back()->with('success', 'Message status updated successfully!');
    }

    public function deleteMessage(Contact $contact)
    {
        $contact->delete();
        return redirect()->route('admin.messages')->with('success', 'Message deleted successfully!');
    }
}
