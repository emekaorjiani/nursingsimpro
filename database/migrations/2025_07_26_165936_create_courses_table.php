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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->string('difficulty')->default('beginner'); // beginner, intermediate, advanced
            $table->integer('duration_weeks')->default(1);
            $table->integer('time_commitment_hours')->default(10); // hours per week
            $table->string('language')->default('English');
            $table->text('learning_objectives')->nullable();
            $table->text('prerequisites')->nullable();
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->integer('order')->default(0);
            $table->string('category')->default('nursing'); // nursing, healthcare, general
            $table->json('tags')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
