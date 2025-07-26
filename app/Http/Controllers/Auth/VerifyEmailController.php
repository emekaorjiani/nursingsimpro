<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            // Redirect based on user role
            if (auth()->user()->is_admin) {
                return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
            } else {
                return redirect()->intended(route('courses.my-courses', absolute: false).'?verified=1');
            }
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        // Redirect based on user role
        if (auth()->user()->is_admin) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        } else {
            return redirect()->intended(route('courses.my-courses', absolute: false).'?verified=1');
        }
    }
}
