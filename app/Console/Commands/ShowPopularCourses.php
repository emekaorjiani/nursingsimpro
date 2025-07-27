<?php

namespace App\Console\Commands;

use App\Models\Course;
use Illuminate\Console\Command;

class ShowPopularCourses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'courses:popular {--limit=4 : Number of courses to show}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Show the most popular courses based on user engagement metrics';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $limit = (int) $this->option('limit');

        $this->info("Fetching the {$limit} most popular courses...\n");

        $popularCourses = Course::published()
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
                $enrollmentScore = $course->enrollment_count * 1;
                $completionScore = $course->completion_count * 2;
                $recentActivityScore = $course->recent_activity * 1.5;
                
                $popularityScore = $enrollmentScore + $completionScore + $recentActivityScore;
                
                $completionRate = $course->enrollment_count > 0 
                    ? round(($course->completion_count / $course->enrollment_count) * 100, 1)
                    : 0;

                return [
                    'title' => $course->title,
                    'enrollment_count' => $course->enrollment_count,
                    'completion_count' => $course->completion_count,
                    'recent_activity' => $course->recent_activity,
                    'completion_rate' => $completionRate,
                    'popularity_score' => $popularityScore,
                    'difficulty' => $course->difficulty,
                    'duration' => $course->duration_weeks . ' weeks',
                ];
            })
            ->sortByDesc('popularity_score')
            ->take($limit)
            ->values();

        if ($popularCourses->isEmpty()) {
            $this->warn('No courses found with engagement data.');
            return;
        }

        $headers = [
            'Rank',
            'Course Title',
            'Enrollments',
            'Completions',
            'Recent Activity',
            'Completion Rate',
            'Popularity Score',
            'Difficulty',
            'Duration'
        ];

        $rows = $popularCourses->map(function ($course, $index) {
            return [
                $index + 1,
                $course['title'],
                $course['enrollment_count'],
                $course['completion_count'],
                $course['recent_activity'],
                $course['completion_rate'] . '%',
                $course['popularity_score'],
                ucfirst($course['difficulty']),
                $course['duration']
            ];
        })->toArray();

        $this->table($headers, $rows);

        $this->info("\nPopularity Score Calculation:");
        $this->line("• Enrollment Count × 1");
        $this->line("• Completion Count × 2 (weighted higher)");
        $this->line("• Recent Activity (30 days) × 1.5");
        $this->line("• Total = Enrollment + Completion + Recent Activity");
    }
} 