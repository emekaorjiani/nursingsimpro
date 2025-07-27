<?php

namespace Database\Factories;

use App\Models\Contact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contact>
 */
class ContactFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->safeEmail(),
            'institution' => $this->faker->optional()->company(),
            'message' => $this->faker->paragraph(3),
            'status' => $this->faker->randomElement(['new', 'in_progress', 'resolved', 'closed']),
            'is_read' => $this->faker->boolean(70), // 70% chance of being read
            'admin_response' => $this->faker->optional()->paragraph(),
            'responded_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
            'responded_by' => null, // Will be set when admin responds
        ];
    }

    /**
     * Indicate that the contact is new.
     */
    public function asNew(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'new',
            'is_read' => false,
            'admin_response' => null,
            'responded_at' => null,
            'responded_by' => null,
        ]);
    }

    /**
     * Indicate that the contact is unread.
     */
    public function unread(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_read' => false,
        ]);
    }

    /**
     * Indicate that the contact has been responded to.
     */
    public function responded(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'resolved',
            'is_read' => true,
            'admin_response' => $this->faker->paragraph(),
            'responded_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ]);
    }
} 