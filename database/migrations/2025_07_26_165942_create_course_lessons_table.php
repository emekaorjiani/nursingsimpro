<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('course_lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->string('slug')->unique();
            $table->text('summary')->nullable();
            $table->string('video_url')->nullable();
            $table->string('duration_minutes')->default(30);
            $table->integer('order')->default(0);
            $table->boolean('is_published')->default(false);
            $table->json('resources')->nullable(); // Additional resources, links, etc.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_lessons');
    }
};
