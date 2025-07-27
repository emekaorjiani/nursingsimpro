<?php

namespace Database\Factories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Course>
 */
class CourseFactory extends Factory
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
            'title' => $title,
            'description' => $this->faker->paragraph(3),
            'slug' => Str::slug($title),
            'difficulty' => $this->faker->randomElement(['beginner', 'intermediate', 'advanced']),
            'duration_weeks' => $this->faker->numberBetween(1, 12),
            'time_commitment_hours' => $this->faker->numberBetween(1, 20),
            'language' => 'English',
            'learning_objectives' => json_encode([
                'Objective 1',
                'Objective 2',
                'Objective 3',
            ]),
            'prerequisites' => $this->faker->sentence(),
            'is_published' => true,
            'is_featured' => $this->faker->boolean(20),
            'order' => $this->faker->numberBetween(1, 100),
            'category' => 'nursing',
            'tags' => $this->faker->randomElements(['simulation', 'beginner', 'fundamentals', 'safety', 'assessment', 'clinical-skills'], 3),
        ];
    }

    /**
     * Indicate that the course is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => true,
        ]);
    }

    /**
     * Indicate that the course is unpublished.
     */
    public function unpublished(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => false,
        ]);
    }

    /**
     * Indicate that the course is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }
} 