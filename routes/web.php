<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Course routes
Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
Route::get('/courses/{course:slug}', [CourseController::class, 'show'])->name('courses.show');

// Protected routes (require authentication)
Route::middleware(['auth'])->group(function () {
    // Course enrollment
    Route::post('/courses/{course:slug}/enroll', [CourseController::class, 'enroll'])->name('courses.enroll');
    
    // User's enrolled courses
    Route::get('/my-courses', [CourseController::class, 'myCourses'])->name('courses.my-courses');
    
    // Lesson routes
    Route::get('/courses/{course:slug}/lessons/{lesson:slug}', [LessonController::class, 'show'])->name('lessons.show');
    Route::post('/courses/{course:slug}/lessons/{lesson:slug}/complete', [LessonController::class, 'complete'])->name('lessons.complete');
    Route::post('/courses/{course:slug}/lessons/{lesson:slug}/progress', [LessonController::class, 'updateProgress'])->name('lessons.progress');
    Route::post('/courses/{course:slug}/lessons/{lesson:slug}/navigate-forward', [LessonController::class, 'navigateForward'])->name('lessons.navigate-forward');
Route::post('/courses/{course:slug}/lessons/{lesson:slug}/complete-course', [LessonController::class, 'completeCourse'])->name('lessons.complete-course');
});

// Breeze authentication routes
Route::get('/dashboard', [App\Http\Controllers\AdminController::class, 'dashboard'])
    ->middleware(['auth', 'verified', 'admin'])
    ->name('dashboard');

// Admin routes
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [App\Http\Controllers\AdminController::class, 'users'])->name('users');
    Route::get('/courses', [App\Http\Controllers\AdminController::class, 'courses'])->name('courses');
    Route::get('/courses/create', [App\Http\Controllers\AdminController::class, 'createCourse'])->name('courses.create');
    Route::post('/courses', [App\Http\Controllers\AdminController::class, 'storeCourse'])->name('courses.store');
    
    // Redirect old ID-based URLs to slug-based URLs (must be before slug routes)
    Route::get('/courses/{id}', function ($id) {
        $course = \App\Models\Course::find($id);
        if ($course) {
            return redirect()->route('admin.courses.detail', $course->slug);
        }
        abort(404);
    })->where('id', '[0-9]+');
    
    Route::get('/courses/{course}', [App\Http\Controllers\AdminController::class, 'courseDetail'])->name('courses.detail');
    Route::get('/courses/{course}/edit', [App\Http\Controllers\AdminController::class, 'editCourse'])->name('courses.edit');
    Route::put('/courses/{course}', [App\Http\Controllers\AdminController::class, 'updateCourse'])->name('courses.update');
    Route::delete('/courses/{course}', [App\Http\Controllers\AdminController::class, 'deleteCourse'])->name('courses.delete');
    
    // Lesson management
    Route::post('/lessons', [App\Http\Controllers\AdminController::class, 'storeLesson'])->name('lessons.store');
    Route::put('/lessons/{lesson:id}', [App\Http\Controllers\AdminController::class, 'updateLesson'])->name('lessons.update');
    Route::delete('/lessons/{lesson:id}', [App\Http\Controllers\AdminController::class, 'deleteLesson'])->name('lessons.destroy');
    
    Route::get('/analytics', [App\Http\Controllers\AdminController::class, 'analytics'])->name('analytics');
    Route::get('/settings', [App\Http\Controllers\AdminController::class, 'settings'])->name('settings');
    
    // Message management routes
    Route::get('/messages', [App\Http\Controllers\AdminController::class, 'messages'])->name('messages');
    Route::get('/messages/{contact:id}', [App\Http\Controllers\AdminController::class, 'messageDetail'])->name('messages.detail');
    Route::post('/messages/{contact:id}/respond', [App\Http\Controllers\AdminController::class, 'respondToMessage'])->name('messages.respond');
    Route::put('/messages/{contact:id}/status', [App\Http\Controllers\AdminController::class, 'updateMessageStatus'])->name('messages.status');
    Route::delete('/messages/{contact:id}', [App\Http\Controllers\AdminController::class, 'deleteMessage'])->name('messages.delete');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
