<?php

namespace App\Http\Controllers;

use App\Events\QueueCalled;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Queue;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with queue information
     */
    public function index(Request $request)
    {
        // Get selected counter from request or default to 1
        $selectedCounter = $request->get('counter', 1);
        
        // Get current serving queue for this counter
        $currentServing = Queue::where('status', 'serving')
            ->where('counter', $selectedCounter)
            ->first();

        // Get next queues in line
        $nextQueues = Queue::where('status', 'waiting')
            ->orderBy('created_at')
            ->get();

        // Get all queues for statistics
        $totalWaiting = Queue::where('status', 'waiting')->count();
        $totalServing = Queue::where('status', 'serving')->count();
        $totalComplete = Queue::where('status', 'completed')->count();

        // Get counters status
        $countersStatus = [];
        for ($i = 1; $i <= 3; $i++) {
            $servingQueue = Queue::where('status', 'serving')
                ->where('counter', $i)
                ->first();
            $countersStatus[$i] = [
                'counter' => $i,
                'status' => $servingQueue ? 'busy' : 'available',
                'current_queue' => $servingQueue
            ];
        }

        return Inertia::render('dashboard', [
            'currentServing' => $currentServing,
            'nextQueues' => $nextQueues,
            'selectedCounter' => $selectedCounter,
            'countersStatus' => $countersStatus,
            'statistics' => [
                'waiting' => $totalWaiting,
                'serving' => $totalServing,
                'complete' => $totalComplete,
            ],
        ]);
    }

    /**
     * Call next queue in line
     */
    public function callNext(Request $request)
    {
        // Get counter from request
        $counter = $request->input('counter', 1);
        
        // Mark current serving as complete for this counter
        Queue::where('status', 'serving')
            ->where('counter', $counter)
            ->update(['status' => 'completed', 'completed_at' => now()]);

        // Get next queue in line
        $nextQueue = Queue::where('status', 'waiting')
            ->orderBy('created_at')
            ->first();

        if ($nextQueue) {
            $nextQueue->update([
                'status' => 'serving',
                'counter' => $counter,
                'called_at' => now(),
                'served_at' => now()
            ]);

            // Broadcast the queue update
            QueueCalled::dispatch([
                'id' => $nextQueue->id,
                'number' => $nextQueue->number,
                'service_name' => $nextQueue->service_name,
                'called_at' => $nextQueue->called_at,
                'counter' => $counter,
            ]);

            return response()->json([
                'success' => true,
                'queue' => [
                    'id' => $nextQueue->id,
                    'number' => $nextQueue->number,
                    'service_name' => $nextQueue->service_name,
                    'called_at' => $nextQueue->called_at,
                    'counter' => $counter,
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No queues waiting'
        ]);
    }

    /**
     * Get current queue status (for API)
     */
    public function status()
    {
        $currentServing = Queue::where('status', 'serving')
            ->first();

        $nextQueues = Queue::where('status', 'waiting')
            ->orderBy('created_at')
            ->take(4)
            ->get();

        return response()->json([
            'currentServing' => $currentServing,
            'nextQueues' => $nextQueues,
        ]);
    }

    /**
     * Complete current queue at specific counter
     */
    public function completeQueue(Request $request)
    {
        $counter = $request->input('counter', 1);
        
        $currentQueue = Queue::where('status', 'serving')
            ->where('counter', $counter)
            ->first();

        if ($currentQueue) {
            $currentQueue->update([
                'status' => 'completed',
                'completed_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Queue completed successfully'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No queue currently serving at this counter'
        ]);
    }

    /**
     * Set counter for dashboard
     */
    public function setCounter(Request $request)
    {
        $counter = $request->input('counter', 1);
        
        // Validate counter number
        if (!in_array($counter, [1, 2, 3])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid counter number'
            ]);
        }

        return response()->json([
            'success' => true,
            'counter' => $counter,
            'message' => "Counter set to $counter"
        ]);
    }
}
