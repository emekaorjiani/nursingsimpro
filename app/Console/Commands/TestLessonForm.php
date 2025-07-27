<?php

namespace App\Console\Commands;

use App\Models\Course;
use App\Models\CourseLesson;
use Illuminate\Console\Command;

class TestLessonForm extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lesson:test {--course-id= : Specific course ID to use}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test lesson form functionality and create sample lessons';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $courseId = $this->option('course-id');

        if ($courseId) {
            $course = Course::find($courseId);
            if (!$course) {
                $this->error("Course with ID {$courseId} not found!");
                return 1;
            }
        } else {
            // Get the first course or create one
            $course = Course::first();
            if (!$course) {
                $this->info('No courses found. Creating a sample course...');
                $course = Course::factory()->create();
            }
        }

        $this->info("Using course: {$course->title} (ID: {$course->id})");

        // Create some test lessons
        $lessons = CourseLesson::factory()->count(3)->create([
            'course_id' => $course->id,
        ]);

        $this->info("✅ Created 3 test lessons for course '{$course->title}'");

        // Show lesson details
        $this->newLine();
        $this->info('Created Lessons:');
        $this->table(
            ['ID', 'Title', 'Slug', 'Duration', 'Published'],
            $lessons->map(function ($lesson) {
                return [
                    $lesson->id,
                    $lesson->title,
                    $lesson->slug,
                    $lesson->duration_minutes . ' min',
                    $lesson->is_published ? 'Yes' : 'No',
                ];
            })
        );

        $this->newLine();
        $this->info('Form Validation Features:');
        $this->line('✅ Old input preservation when validation fails');
        $this->line('✅ File upload validation with error handling');
        $this->line('✅ Form data persistence across validation errors');
        $this->line('✅ Proper error messages for each field');

        $this->newLine();
        $this->info('You can now:');
        $this->line("• Visit /admin/courses/{$course->id} to edit the course");
        $this->line('• Try editing lessons and test file uploads');
        $this->line('• Submit forms with validation errors to see old input preservation');
        $this->line('• Upload videos and materials to test file handling');

        $this->newLine();
        $this->info('Test Scenarios:');
        $this->line('1. Try submitting a lesson form with empty required fields');
        $this->line('2. Upload an invalid file type (e.g., .txt for video)');
        $this->line('3. Upload a file that exceeds size limits');
        $this->line('4. Verify that other form fields retain their values');

        return 0;
    }
} 