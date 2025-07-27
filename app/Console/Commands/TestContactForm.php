<?php

namespace App\Console\Commands;

use App\Models\Contact;
use Illuminate\Console\Command;

class TestContactForm extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'contact:test {--count=5 : Number of test contacts to create}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create test contact form submissions for testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = (int) $this->option('count');

        $this->info("Creating {$count} test contact submissions...");

        $contacts = Contact::factory()->count($count)->create();

        $this->info("✅ Created {$count} test contacts successfully!");

        // Show summary
        $this->newLine();
        $this->info('Contact Summary:');
        $this->table(
            ['Status', 'Count'],
            [
                ['New', Contact::new()->count()],
                ['In Progress', Contact::where('status', 'in_progress')->count()],
                ['Resolved', Contact::where('status', 'resolved')->count()],
                ['Closed', Contact::where('status', 'closed')->count()],
                ['Unread', Contact::unread()->count()],
                ['Total', Contact::count()],
            ]
        );

        $this->newLine();
        $this->info('You can now:');
        $this->line('• Visit /admin/contacts to view all contacts');
        $this->line('• Test the contact form on the landing page');
        $this->line('• Use the admin interface to respond to contacts');
    }
} 