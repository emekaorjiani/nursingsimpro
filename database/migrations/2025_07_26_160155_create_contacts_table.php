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
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('institution')->nullable();
            $table->text('message');
            $table->enum('status', ['new', 'in_progress', 'resolved', 'closed'])->default('new');
            $table->boolean('is_read')->default(false);
            $table->text('admin_response')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->unsignedBigInteger('responded_by')->nullable();
            $table->timestamps();
            
            $table->foreign('responded_by')->references('id')->on('users')->onDelete('set null');
            $table->index(['status', 'is_read']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
