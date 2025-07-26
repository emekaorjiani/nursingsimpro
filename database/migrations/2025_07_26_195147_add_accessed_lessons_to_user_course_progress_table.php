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
        Schema::table('user_course_progress', function (Blueprint $table) {
            $table->json('accessed_lessons')->nullable()->after('completed_lessons'); // Array of accessed lesson IDs
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_course_progress', function (Blueprint $table) {
            $table->dropColumn('accessed_lessons');
        });
    }
};
