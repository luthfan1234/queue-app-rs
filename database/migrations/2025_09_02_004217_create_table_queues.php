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
        Schema::create('table_queues', function (Blueprint $table) {
            $table->id();
            $table->string('number');
            $table->string('service_name');
            $table->string('service_code', 10);
            $table->enum('status', ['waiting', 'serving', 'completed', 'skipped'])->default('waiting');
            $table->integer('position')->nullable();
            $table->integer('counter')->nullable();
            $table->timestamp('called_at')->nullable();
            $table->timestamp('served_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['service_code', 'status']);
            $table->index('status', 'created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_queues');
    }
};
