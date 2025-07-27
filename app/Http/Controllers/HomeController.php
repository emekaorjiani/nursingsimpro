<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\UserCourseProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class HomeController extends Controller
{
    public function index()
    {
        // Get the 4 most popular courses based on engagement metrics
        $popularCourses = Course::published()
            ->with(['lessons' => function ($query) {
                $query->where('is_published', true);
            }])
            ->withCount(['userProgress as enrollment_count' => function ($query) {
                $query->where('status', '!=', 'cancelled');
            }])
            ->withCount(['userProgress as completion_count' => function ($query) {
                $query->where('status', 'completed');
            }])
            ->withCount(['userProgress as recent_activity' => function ($query) {
                $query->where('last_accessed_at', '>=', now()->subDays(30));
            }])
            ->get()
            ->map(function ($course) {
                // Calculate popularity score based on multiple factors
                $enrollmentScore = $course->enrollment_count * 1;
                $completionScore = $course->completion_count * 2; // Weight completions higher
                $recentActivityScore = $course->recent_activity * 1.5; // Weight recent activity
                
                $popularityScore = $enrollmentScore + $completionScore + $recentActivityScore;
                
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'description' => $course->description,
                    'slug' => $course->slug,
                    'thumbnail' => $course->thumbnail,
                    'difficulty' => $course->difficulty,
                    'duration_weeks' => $course->duration_weeks,
                    'time_commitment_hours' => $course->time_commitment_hours,
                    'category' => $course->category,
                    'tags' => $course->tags,
                    'total_lessons' => $course->total_lessons,
                    'total_duration' => $course->total_duration,
                    'duration' => $course->duration_weeks . ' weeks',
                    'enrollment_count' => $course->enrollment_count,
                    'completion_count' => $course->completion_count,
                    'recent_activity' => $course->recent_activity,
                    'popularity_score' => $popularityScore,
                    'completion_rate' => $course->enrollment_count > 0 
                        ? round(($course->completion_count / $course->enrollment_count) * 100, 1)
                        : 0,
                ];
            })
            ->sortByDesc('popularity_score')
            ->take(4)
            ->values()
            ->toArray();

        return Inertia::render('Home', [
            'title' => 'Nursing Simulation Excellence - Empowering Healthcare Education',
            'popularCourses' => $popularCourses,
        ]);
    }
}
