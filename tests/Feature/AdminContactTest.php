<?php

namespace Tests\Feature;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminContactTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create an admin user
        $this->admin = User::factory()->create([
            'is_admin' => true,
        ]);
    }

    public function test_admin_can_view_contacts_list()
    {
        // Create some test contacts
        Contact::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.contacts'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('contacts')
                ->has('stats')
        );
    }

    public function test_admin_can_view_contact_detail()
    {
        $contact = Contact::factory()->create();

        $response = $this->actingAs($this->admin)
            ->get(route('admin.contacts.detail', $contact));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => 
            $page->has('contact')
                ->where('contact.id', $contact->id)
        );
    }

    public function test_admin_can_respond_to_contact()
    {
        $contact = Contact::factory()->create();

        $response = $this->actingAs($this->admin)
            ->post(route('admin.contacts.respond', $contact), [
                'response' => 'Thank you for your message. We will get back to you soon.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'admin_response' => 'Thank you for your message. We will get back to you soon.',
            'status' => 'resolved',
            'is_read' => true,
            'responded_by' => $this->admin->id,
        ]);
    }

    public function test_admin_can_update_contact_status()
    {
        $contact = Contact::factory()->create();

        $response = $this->actingAs($this->admin)
            ->put(route('admin.contacts.status', $contact), [
                'status' => 'in_progress',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'status' => 'in_progress',
        ]);
    }

    public function test_admin_can_delete_contact()
    {
        $contact = Contact::factory()->create();

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.contacts.delete', $contact));

        $response->assertRedirect(route('admin.contacts'));
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('contacts', [
            'id' => $contact->id,
        ]);
    }

    public function test_contact_is_marked_as_read_when_admin_views_it()
    {
        $contact = Contact::factory()->create([
            'is_read' => false,
        ]);

        $this->actingAs($this->admin)
            ->get(route('admin.contacts.detail', $contact));

        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'is_read' => true,
        ]);
    }
} 