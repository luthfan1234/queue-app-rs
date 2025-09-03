<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Queue;

class ResetQueues extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'queue:reset';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset all queue data and statistics';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Resetting queue data...');

        // Delete all queue records
        Queue::truncate();

        $this->info('All queue data has been reset successfully!');
        $this->info('Statistics:');
        $this->info('- Waiting: 0');
        $this->info('- Serving: 0');
        $this->info('- Completed: 0');

        return Command::SUCCESS;
    }
}
