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
    public function index()
    {
        // Get current serving queue
        $currentServing = Queue::where('status', 'serving')
            ->first();

        // Get next queues in line
        $nextQueues = Queue::where('status', 'waiting')
            ->orderBy('created_at')
            ->get();

        // Get all queues for statistics
        $totalWaiting = Queue::where('status', 'waiting')->count();
        $totalServing = Queue::where('status', 'serving')->count();
        $totalComplete = Queue::where('status', 'completed')->count();

        return Inertia::render('dashboard', [
            'currentServing' => $currentServing,
            'nextQueues' => $nextQueues,
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
        // Mark current serving as complete
        Queue::where('status', 'serving')
            ->update(['status' => 'completed']);

        // Get next queue in line
        $nextQueue = Queue::where('status', 'waiting')
            ->orderBy('created_at')
            ->first();

        if ($nextQueue) {
            $nextQueue->update([
                'status' => 'serving',
                'called_at' => now()
            ]);

            // Broadcast the queue update
            QueueCalled::dispatch([
                'id' => $nextQueue->id,
                'number' => $nextQueue->number,
                'service_name' => $nextQueue->service_name,
                'called_at' => $nextQueue->updated_at,
                'counter' => 1,
            ]);

            return response()->json([
                'success' => true,
                'queue' => [
                    'id' => $nextQueue->id,
                    'number' => $nextQueue->number,
                    'service_name' => $nextQueue->service_name,
                    'called_at' => $nextQueue->updated_at,
                    'counter' => 1,
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
}
