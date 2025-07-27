<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CourseFormValidationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        
        // Create admin user
        $this->admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($this->admin);
    }

    public function test_course_form_preserves_old_input_when_validation_fails()
    {
        $response = $this->post(route('admin.courses.store'), [
            'title' => '', // Empty to trigger validation error
            'description' => '', // Empty to trigger validation error
            'slug' => '', // Empty to trigger validation error
            'difficulty' => '', // Empty to trigger validation error
            'duration_weeks' => '', // Empty to trigger validation error
            'time_commitment_hours' => '', // Empty to trigger validation error
            'language' => '', // Empty to trigger validation error
            'learning_objectives' => 'Learn something',
            'prerequisites' => 'None',
            'is_published' => true,
            'is_featured' => false,
        ]);

        $response->assertSessionHasErrors(['title', 'description', 'slug', 'difficulty', 'duration_weeks', 'time_commitment_hours', 'language']);
        $response->assertSessionHasInput('title', '');
        $response->assertSessionHasInput('description', '');
        $response->assertSessionHasInput('slug', '');
        $response->assertSessionHasInput('difficulty', '');
        $response->assertSessionHasInput('duration_weeks', '');
        $response->assertSessionHasInput('time_commitment_hours', '');
        $response->assertSessionHasInput('language', '');
        $response->assertSessionHasInput('learning_objectives', 'Learn something');
        $response->assertSessionHasInput('prerequisites', 'None');
        $response->assertSessionHasInput('is_published', true);
        $response->assertSessionHasInput('is_featured', false);
    }

    public function test_course_form_preserves_old_input_when_file_validation_fails()
    {
        $response = $this->post(route('admin.courses.store'), [
            'title' => 'Test Course',
            'description' => 'Test description',
            'slug' => 'test-course',
            'difficulty' => 'beginner',
            'duration_weeks' => 4,
            'time_commitment_hours' => 8,
            'language' => 'English',
            'learning_objectives' => 'Learn something',
            'prerequisites' => 'None',
            'is_published' => true,
            'is_featured' => false,
            'thumbnail' => UploadedFile::fake()->create('document.txt', 100), // Invalid file type
        ]);

        // When file is uploaded, we get redirect with session errors
        $response->assertSessionHasErrors(['thumbnail']);
        // Verify that non-file fields are preserved
        $response->assertSessionHasInput('title', 'Test Course');
        $response->assertSessionHasInput('description', 'Test description');
        $response->assertSessionHasInput('slug', 'test-course');
        $response->assertSessionHasInput('difficulty', 'beginner');
        $response->assertSessionHasInput('duration_weeks', 4);
        $response->assertSessionHasInput('time_commitment_hours', 8);
        $response->assertSessionHasInput('language', 'English');
        $response->assertSessionHasInput('learning_objectives', 'Learn something');
        $response->assertSessionHasInput('prerequisites', 'None');
        $response->assertSessionHasInput('is_published', true);
        $response->assertSessionHasInput('is_featured', false);
    }

    public function test_course_form_successfully_creates_with_valid_data()
    {
        $response = $this->post(route('admin.courses.store'), [
            'title' => 'Test Course',
            'description' => 'Test description',
            'slug' => 'test-course',
            'difficulty' => 'beginner',
            'duration_weeks' => 4,
            'time_commitment_hours' => 8,
            'language' => 'English',
            'learning_objectives' => 'Learn something',
            'prerequisites' => 'None',
            'is_published' => true,
            'is_featured' => false,
        ]);

        $response->assertRedirect(route('admin.courses'));
        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('courses', [
            'title' => 'Test Course',
            'description' => 'Test description',
            'slug' => 'test-course',
            'difficulty' => 'beginner',
            'duration_weeks' => 4,
            'time_commitment_hours' => 8,
            'language' => 'English',
            'learning_objectives' => 'Learn something',
            'prerequisites' => 'None',
            'is_published' => true,
            'is_featured' => false,
        ]);
    }

    public function test_course_form_successfully_uploads_valid_thumbnail()
    {
        $file = UploadedFile::fake()->image('thumbnail.jpg', 100, 100);

        $response = $this->post(route('admin.courses.store'), [
            'title' => 'Test Course',
            'description' => 'Test description',
            'slug' => 'test-course',
            'difficulty' => 'beginner',
            'duration_weeks' => 4,
            'time_commitment_hours' => 8,
            'language' => 'English',
            'learning_objectives' => 'Learn something',
            'prerequisites' => 'None',
            'is_published' => true,
            'is_featured' => false,
            'thumbnail' => $file,
        ]);

        // When file is uploaded, we get redirect with success
        $response->assertRedirect(route('admin.courses'));
        $response->assertSessionHas('success');
        
        $course = Course::where('title', 'Test Course')->first();
        $this->assertNotNull($course->thumbnail);
        Storage::disk('public')->assertExists($course->thumbnail);
    }

    public function test_course_update_form_preserves_old_input_when_validation_fails()
    {
        $course = Course::factory()->create([
            'title' => 'Original Title',
            'description' => 'Original description',
            'slug' => 'original-slug',
        ]);

        $response = $this->put(route('admin.courses.update', $course), [
            'title' => '', // Empty to trigger validation error
            'description' => '', // Empty to trigger validation error
            'slug' => '', // Empty to trigger validation error
            'difficulty' => '', // Empty to trigger validation error
            'duration_weeks' => '', // Empty to trigger validation error
            'time_commitment_hours' => '', // Empty to trigger validation error
            'language' => '', // Empty to trigger validation error
            'learning_objectives' => 'Updated objectives',
            'prerequisites' => 'Updated prerequisites',
            'is_published' => false,
            'is_featured' => true,
        ]);

        $response->assertSessionHasErrors(['title', 'description', 'slug', 'difficulty', 'duration_weeks', 'time_commitment_hours', 'language']);
        $response->assertSessionHasInput('title', '');
        $response->assertSessionHasInput('description', '');
        $response->assertSessionHasInput('slug', '');
        $response->assertSessionHasInput('difficulty', '');
        $response->assertSessionHasInput('duration_weeks', '');
        $response->assertSessionHasInput('time_commitment_hours', '');
        $response->assertSessionHasInput('language', '');
        $response->assertSessionHasInput('learning_objectives', 'Updated objectives');
        $response->assertSessionHasInput('prerequisites', 'Updated prerequisites');
        $response->assertSessionHasInput('is_published', false);
        $response->assertSessionHasInput('is_featured', true);
    }

    public function test_course_update_form_successfully_updates_with_valid_data()
    {
        $course = Course::factory()->create([
            'title' => 'Original Title',
            'description' => 'Original description',
            'slug' => 'original-slug',
        ]);

        $response = $this->put(route('admin.courses.update', $course), [
            'title' => 'Updated Title',
            'description' => 'Updated description',
            'slug' => 'updated-slug',
            'difficulty' => 'intermediate',
            'duration_weeks' => 6,
            'time_commitment_hours' => 12,
            'language' => 'Spanish',
            'learning_objectives' => 'Updated objectives',
            'prerequisites' => 'Updated prerequisites',
            'is_published' => false,
            'is_featured' => true,
        ]);

        $course->refresh();
        $response->assertRedirect(route('admin.courses.detail', $course));
        $response->assertSessionHas('success');
        $this->assertEquals('Updated Title', $course->title);
        $this->assertEquals('Updated description', $course->description);
        $this->assertEquals('updated-slug', $course->slug);
        $this->assertEquals('intermediate', $course->difficulty);
        $this->assertEquals(6, $course->duration_weeks);
        $this->assertEquals(12, $course->time_commitment_hours);
        $this->assertEquals('Spanish', $course->language);
        $this->assertEquals('Updated objectives', $course->learning_objectives);
        $this->assertEquals('Updated prerequisites', $course->prerequisites);
        $this->assertFalse($course->is_published);
        $this->assertTrue($course->is_featured);
    }
} 