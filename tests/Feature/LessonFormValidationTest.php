<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\CourseLesson;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LessonFormValidationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create an admin user
        $this->admin = User::factory()->create([
            'is_admin' => true,
        ]);

        // Create a test course
        $this->course = Course::factory()->create();

        // Create a test lesson
        $this->lesson = CourseLesson::factory()->create([
            'course_id' => $this->course->id,
            'title' => 'Test Lesson',
            'content' => 'Test content',
        ]);

        Storage::fake('public');
    }

    public function test_lesson_form_preserves_old_input_when_validation_fails()
    {
        $response = $this->actingAs($this->admin)
            ->put(route('admin.lessons.update', $this->lesson->id), [
                'title' => '', // This will fail validation
                'slug' => 'test-slug',
                'content' => 'Updated content',
                'duration_minutes' => 45,
                'order' => 1,
                'is_published' => true,
                'video_url' => 'https://example.com/video',
            ]);

        $response->assertSessionHasErrors(['title']);
        $response->assertSessionHas('_old_input');
        
        // Check that old input is preserved
        $oldInput = session('_old_input');
        $this->assertEquals('test-slug', $oldInput['slug']);
        $this->assertEquals('Updated content', $oldInput['content']);
        $this->assertEquals(45, $oldInput['duration_minutes']);
        $this->assertEquals(1, $oldInput['order']);
        $this->assertTrue($oldInput['is_published']);
        $this->assertEquals('https://example.com/video', $oldInput['video_url']);
    }

    public function test_lesson_form_preserves_old_input_when_file_validation_fails()
    {
        // Create an invalid file (wrong type)
        $invalidFile = UploadedFile::fake()->create('document.txt', 100);

        $response = $this->actingAs($this->admin)
            ->put(route('admin.lessons.update', $this->lesson->id), [
                'title' => 'Valid Title',
                'slug' => 'valid-slug',
                'content' => 'Valid content',
                'duration_minutes' => 30,
                'order' => 1,
                'is_published' => false,
                'video_file' => $invalidFile, // This will fail validation
            ]);

        $response->assertSessionHasErrors(['video_file']);
        $response->assertSessionHas('_old_input');
        
        // Check that old input is preserved (excluding file fields)
        $oldInput = session('_old_input');
        $this->assertEquals('Valid Title', $oldInput['title']);
        $this->assertEquals('valid-slug', $oldInput['slug']);
        $this->assertEquals('Valid content', $oldInput['content']);
        $this->assertEquals(30, $oldInput['duration_minutes']);
        $this->assertEquals(1, $oldInput['order']);
        $this->assertFalse($oldInput['is_published']);
        
        // File fields should not be in old input
        $this->assertArrayNotHasKey('video_file', $oldInput);
        $this->assertArrayNotHasKey('materials', $oldInput);
    }

    public function test_lesson_form_successfully_updates_with_valid_data()
    {
        $response = $this->actingAs($this->admin)
            ->put(route('admin.lessons.update', $this->lesson->id), [
                'title' => 'Updated Title',
                'slug' => 'updated-slug',
                'content' => 'Updated content',
                'duration_minutes' => 60,
                'order' => 2,
                'is_published' => true,
                'video_url' => 'https://youtube.com/watch?v=test',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Check that the lesson was updated
        $this->lesson->refresh();
        $this->assertEquals('Updated Title', $this->lesson->title);
        $this->assertEquals('updated-slug', $this->lesson->slug);
        $this->assertEquals('Updated content', $this->lesson->content);
        $this->assertEquals(60, $this->lesson->duration_minutes);
        $this->assertEquals(2, $this->lesson->order);
        $this->assertTrue($this->lesson->is_published);
        $this->assertEquals('https://youtube.com/watch?v=test', $this->lesson->video_url);
    }

    public function test_lesson_form_successfully_uploads_valid_video_file()
    {
        $videoFile = UploadedFile::fake()->create('video.mp4', 100);

        $response = $this->actingAs($this->admin)
            ->put(route('admin.lessons.update', $this->lesson->id), [
                'title' => 'Video Lesson',
                'slug' => 'video-lesson',
                'content' => 'Content with video',
                'duration_minutes' => 30,
                'order' => 1,
                'is_published' => true,
                'video_file' => $videoFile,
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Check that the video was uploaded
        $this->lesson->refresh();
        $this->assertNotNull($this->lesson->video_url);
        $this->assertStringContainsString('lesson-videos', $this->lesson->video_url);
        
        // Check that the file was stored
        Storage::disk('public')->assertExists($this->lesson->video_url);
    }

    public function test_lesson_form_successfully_uploads_valid_materials()
    {
        $pdfFile = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this->actingAs($this->admin)
            ->put(route('admin.lessons.update', $this->lesson->id), [
                'title' => 'Lesson with Materials',
                'slug' => 'lesson-with-materials',
                'content' => 'Content with materials',
                'duration_minutes' => 30,
                'order' => 1,
                'is_published' => true,
                'materials' => [$pdfFile],
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Check that the materials were uploaded
        $this->lesson->refresh();
        $this->assertNotNull($this->lesson->resources);
        $this->assertCount(1, $this->lesson->resources);
        $this->assertEquals('document.pdf', $this->lesson->resources[0]['name']);
        
        // Check that the file was stored
        Storage::disk('public')->assertExists($this->lesson->resources[0]['path']);
    }
} 