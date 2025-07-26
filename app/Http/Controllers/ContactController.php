<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate(Contact::rules());
            
            Contact::create($validated);
            
            return back()->with('success', 'Thank you for your message! We will get back to you soon.');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        }
    }
}
