<?php

namespace Tests\Feature;

use App\Models\Contact;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_form_submission_creates_contact_record()
    {
        $contactData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'institution' => 'Test University',
            'message' => 'This is a test message from the contact form.',
        ];

        $response = $this->post('/contact', $contactData);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('contacts', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'institution' => 'Test University',
            'message' => 'This is a test message from the contact form.',
            'status' => 'new',
            'is_read' => false,
        ]);
    }

    public function test_contact_form_validates_required_fields()
    {
        $response = $this->post('/contact', []);

        $response->assertSessionHasErrors(['name', 'email', 'message']);
    }

    public function test_contact_form_validates_email_format()
    {
        $contactData = [
            'name' => 'John Doe',
            'email' => 'invalid-email',
            'message' => 'Test message',
        ];

        $response = $this->post('/contact', $contactData);

        $response->assertSessionHasErrors(['email']);
    }

    public function test_contact_form_accepts_optional_institution_field()
    {
        $contactData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => 'This is a test message.',
        ];

        $response = $this->post('/contact', $contactData);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('contacts', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'institution' => null,
            'message' => 'This is a test message.',
        ]);
    }

    public function test_contact_form_validates_message_length()
    {
        $contactData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'message' => str_repeat('a', 2001), // Exceeds 2000 character limit
        ];

        $response = $this->post('/contact', $contactData);

        $response->assertSessionHasErrors(['message']);
    }
} 