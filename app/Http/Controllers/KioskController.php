<?php

namespace App\Http\Controllers;

use App\Events\QueueCreated;
use App\Models\Queue;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KioskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('kiosk');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!$request->service_id) {
            return Inertia::render('kiosk');
        }

        $serviceMap = [
            1 => ['code' => 'EGD', 'name' => 'Pelayanan Gawat Darurat'],
            2 => ['code' => 'PRJ', 'name' => 'Pelayanan Rawat jalan / Poliklinik'],
            3 => ['code' => 'RI', 'name' => 'Rawat Inap'],
            4 => ['code' => 'F', 'name' => 'Pelayanan Farmasi'],
            5 => ['code' => 'GDM', 'name' => 'Pelayanan Gigi dan Mulut'],
            6 => ['code' => 'LAB', 'name' => 'Pelayanan Laboratorium'],
            7 => ['code' => 'RAD', 'name' => 'Pelayanan Radiologi'],
        ];

        $service = $serviceMap[$request->service_id];

        $generateNumber = Queue::generateNumber($service['code']);

        $queue = Queue::create([
            'number' => $generateNumber,
            'service_name' => $service['name'],
            'service_code' => $service['code'],
        ]);

        QueueCreated::dispatch($queue);

        return response()->json([
            'number' => $generateNumber,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
