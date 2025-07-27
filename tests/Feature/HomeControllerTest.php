<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use App\Models\UserCourseProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_returns_popular_courses()
    {
        // Create test courses
        $course1 = Course::factory()->create([
            'title' => 'Introduction to Nursing Simulation',
            'is_published' => true,
            'is_featured' => true,
        ]);

        $course2 = Course::factory()->create([
            'title' => 'Advanced Patient Assessment',
            'is_published' => true,
            'is_featured' => false,
        ]);

        $course3 = Course::factory()->create([
            'title' => 'Emergency Nursing Procedures',
            'is_published' => true,
            'is_featured' => false,
        ]);

        // Create test users
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create();

        // Create course enrollments with different engagement levels
        // Course 1: High enrollment, high completion
        UserCourseProgress::create([
            'user_id' => $user1->id,
            'course_id' => $course1->id,
            'status' => 'completed',
            'progress_percentage' => 100,
            'started_at' => now()->subDays(10),
            'completed_at' => now()->subDays(5),
            'last_accessed_at' => now()->subDays(5),
        ]);

        UserCourseProgress::create([
            'user_id' => $user2->id,
            'course_id' => $course1->id,
            'status' => 'completed',
            'progress_percentage' => 100,
            'started_at' => now()->subDays(8),
            'completed_at' => now()->subDays(3),
            'last_accessed_at' => now()->subDays(3),
        ]);

        UserCourseProgress::create([
            'user_id' => $user3->id,
            'course_id' => $course1->id,
            'status' => 'in_progress',
            'progress_percentage' => 50,
            'started_at' => now()->subDays(5),
            'last_accessed_at' => now()->subDays(1),
        ]);

        // Course 2: Medium enrollment, medium completion
        UserCourseProgress::create([
            'user_id' => $user1->id,
            'course_id' => $course2->id,
            'status' => 'completed',
            'progress_percentage' => 100,
            'started_at' => now()->subDays(15),
            'completed_at' => now()->subDays(10),
            'last_accessed_at' => now()->subDays(10),
        ]);

        UserCourseProgress::create([
            'user_id' => $user2->id,
            'course_id' => $course2->id,
            'status' => 'in_progress',
            'progress_percentage' => 30,
            'started_at' => now()->subDays(12),
            'last_accessed_at' => now()->subDays(2),
        ]);

        // Course 3: Low enrollment, no completion
        UserCourseProgress::create([
            'user_id' => $user1->id,
            'course_id' => $course3->id,
            'status' => 'not_started',
            'progress_percentage' => 0,
            'started_at' => now()->subDays(20),
            'last_accessed_at' => now()->subDays(20),
        ]);

        // Make request to home page
        $response = $this->get('/');

        // Assert response is successful
        $response->assertStatus(200);

        // Assert that popular courses are returned
        $response->assertInertia(fn ($page) => 
            $page->has('popularCourses')
                ->where('popularCourses.0.title', 'Introduction to Nursing Simulation') // Should be first due to high engagement
                ->where('popularCourses.0.enrollment_count', 3)
                ->where('popularCourses.0.completion_count', 2)
                ->where('popularCourses.1.title', 'Advanced Patient Assessment') // Should be second
                ->where('popularCourses.1.enrollment_count', 2)
                ->where('popularCourses.1.completion_count', 1)
        );
    }

    public function test_popular_courses_are_limited_to_four()
    {
        // Create 6 published courses
        for ($i = 1; $i <= 6; $i++) {
            Course::factory()->create([
                'title' => "Course {$i}",
                'is_published' => true,
            ]);
        }

        // Make request to home page
        $response = $this->get('/');

        // Assert response is successful
        $response->assertStatus(200);

        // Assert that only 4 popular courses are returned
        $response->assertInertia(fn ($page) => 
            $page->has('popularCourses')
                ->where('popularCourses', fn ($courses) => count($courses) <= 4)
        );
    }

    public function test_only_published_courses_are_included_in_popular_courses()
    {
        // Create published and unpublished courses
        $publishedCourse = Course::factory()->create([
            'title' => 'Published Course',
            'is_published' => true,
        ]);

        $unpublishedCourse = Course::factory()->create([
            'title' => 'Unpublished Course',
            'is_published' => false,
        ]);

        // Make request to home page
        $response = $this->get('/');

        // Assert response is successful
        $response->assertStatus(200);

        // Assert that only published courses are included
        $response->assertInertia(fn ($page) => 
            $page->has('popularCourses')
                ->where('popularCourses', fn ($courses) => 
                    collect($courses)->every(fn ($course) => $course['title'] !== 'Unpublished Course')
                )
        );
    }
} 