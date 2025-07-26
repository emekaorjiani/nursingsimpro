<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        $returnUrl = request()->get('returnUrl');
        
        // Store return URL in session if provided
        if ($returnUrl) {
            session(['returnUrl' => $returnUrl]);
        }
        
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'message' => session('message'),
            'returnUrl' => $returnUrl,
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Check if there's a return URL in the session
        $returnUrl = session('returnUrl');
        
        if ($returnUrl) {
            // Clear the return URL from session
            $request->session()->forget('returnUrl');
            return redirect($returnUrl);
        }

        // Redirect based on user role
        if (auth()->user()->is_admin) {
            return redirect()->intended(route('dashboard', absolute: false));
        } else {
            return redirect()->intended(route('courses.my-courses', absolute: false));
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
