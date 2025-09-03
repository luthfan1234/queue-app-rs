<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Queue;

class DisplayController extends Controller
{
    public function index()
    {
        // Get current serving queue (any counter)
        $currentQueue = Queue::where('status', 'serving')
            ->orderBy('called_at', 'desc')
            ->first();

        // Get next queues in line
        $nextQueues = Queue::where('status', 'waiting')
            ->orderBy('created_at')
            ->take(4)
            ->get();

        return Inertia::render('display-queue', [
            'currentQueue' => $currentQueue,
            'nextQueues' => $nextQueues
        ]);
    }
}
