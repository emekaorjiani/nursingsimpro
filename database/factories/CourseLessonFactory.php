<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\CourseLesson;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CourseLesson>
 */
class CourseLessonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(3);
        
        return [
            'course_id' => Course::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'summary' => $this->faker->paragraph(),
            'content' => $this->faker->paragraphs(3, true),
            'duration_minutes' => $this->faker->numberBetween(15, 120),
            'order' => $this->faker->numberBetween(1, 10),
            'is_published' => $this->faker->boolean(80), // 80% chance of being published
            'video_url' => $this->faker->optional()->url(),
            'resources' => null,
        ];
    }

    /**
     * Indicate that the lesson is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => true,
        ]);
    }

    /**
     * Indicate that the lesson is unpublished.
     */
    public function unpublished(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => false,
        ]);
    }

    /**
     * Indicate that the lesson has a video.
     */
    public function withVideo(): static
    {
        return $this->state(fn (array $attributes) => [
            'video_url' => $this->faker->url(),
        ]);
    }

    /**
     * Indicate that the lesson has resources.
     */
    public function withResources(): static
    {
        return $this->state(fn (array $attributes) => [
            'resources' => [
                [
                    'name' => 'Sample Document.pdf',
                    'path' => 'lesson-materials/sample-document.pdf',
                    'size' => 1024000,
                    'type' => 'application/pdf',
                ],
                [
                    'name' => 'Presentation.pptx',
                    'path' => 'lesson-materials/presentation.pptx',
                    'size' => 2048000,
                    'type' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                ],
            ],
        ]);
    }
} 