<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate(Contact::rules());
            
            // Create the contact message
            $contact = Contact::create($validated);
            
            // Log the contact for debugging (optional)
            \Log::info('New contact form submission', [
                'name' => $contact->name,
                'email' => $contact->email,
                'institution' => $contact->institution,
                'message_length' => strlen($contact->message),
            ]);
            
            return back()->with('success', 'Thank you for your message! We will get back to you soon.');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            \Log::error('Contact form error', [
                'error' => $e->getMessage(),
                'data' => $request->except(['message']), // Don't log the full message for privacy
            ]);
            
            return back()->with('error', 'Sorry, there was an error sending your message. Please try again or contact us directly.');
        }
    }

    /**
     * Show contact form (if needed for a dedicated contact page)
     */
    public function show()
    {
        return Inertia::render('Contact');
    }
}
