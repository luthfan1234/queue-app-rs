import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import usePusher from "@/hooks/use-pusher";
import AppLayout from "@/layouts/app-layout";
import { SharedData, type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Clock, CheckCircle2, Users2, Phone, Zap } from "lucide-react";
import { useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Manajemen Antrian - RS Dr. Oen",
    href: "/dashboard",
  },
];

type Queue = {
  id: number;
  number: number;
  service_name: string;
  called_at: string;
  counter: number;
  created_at: string;
};

interface DashboardProps extends SharedData {
  currentServing: Queue | null;
  nextQueues: Queue[];
  selectedCounter: number;
  countersStatus: {
    [key: number]: {
      counter: number;
      status: 'busy' | 'available';
      current_queue: Queue | null;
    };
  };
  statistics: {
    waiting: number;
    serving: number;
    complete: number;
  };
}

export default function Dashboard(props: DashboardProps) {
  const [currentServing, setCurrentServing] = useState<Queue | null>(
    props.currentServing
  );
  const [nextQueues, setNextQueues] = useState<Queue[]>(props.nextQueues);
  const [statistics, setStatistics] = useState(props.statistics);
  const [selectedCounter, setSelectedCounter] = useState<number>(props.selectedCounter);
  const [countersStatus, setCountersStatus] = useState(props.countersStatus);

  const [disabledCallNext, setDisabledCallNext] = useState(false);

  usePusher("queue-updates", {
    "queue-created": (data) => {
      const queueData = data as { queue: Queue };
      setNextQueues((prev) => [...prev, queueData.queue]);
      setStatistics((prev) => ({
        ...prev,
        waiting: prev.waiting + 1,
      }));
    },
    "queue-called": () => {
      setTimeout(() => {
        setDisabledCallNext(false);
      }, 5000);
    },
  });

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCallNext = async () => {
    try {
      const response = await fetch("/dashboard/call-next", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": props.csrf as string,
        },
        body: JSON.stringify({
          counter: selectedCounter,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.queue) {
        setCurrentServing(result.queue);
        setNextQueues((prev) => prev.filter((q) => q.id !== result.queue.id));
        setStatistics((prev) => ({
          ...prev,
          waiting: prev.waiting - 1,
          serving: prev.serving + 1, // Add 1 to serving count
        }));

        // Update counters status
        setCountersStatus((prev) => ({
          ...prev,
          [selectedCounter]: {
            counter: selectedCounter,
            status: 'busy',
            current_queue: result.queue,
          },
        }));

        setDisabledCallNext(true);
      } else {
        alert(result.message || "No queues waiting");
      }
    } catch (error) {
      console.error("Error calling next queue:", error);
      alert("Failed to call next queue. Please try again.");
    }
  };

  const handleCompleteQueue = async () => {
    try {
      const response = await fetch("/dashboard/complete-queue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": props.csrf as string,
        },
        body: JSON.stringify({
          counter: selectedCounter,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setCurrentServing(null);
        setStatistics((prev) => ({
          ...prev,
          serving: Math.max(0, prev.serving - 1), // Ensure it doesn't go negative
          complete: prev.complete + 1,
        }));

        // Update counters status
        setCountersStatus((prev) => ({
          ...prev,
          [selectedCounter]: {
            counter: selectedCounter,
            status: 'available',
            current_queue: null,
          },
        }));
      } else {
        alert(result.message || "Failed to complete queue");
      }
    } catch (error) {
      console.error("Error completing queue:", error);
      alert("Failed to complete queue. Please try again.");
    }
  };

  const handleCounterChange = (counter: number) => {
    setSelectedCounter(counter);
    // Update current serving based on selected counter
    const counterStatus = countersStatus[counter];
    setCurrentServing(counterStatus?.current_queue || null);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Rumah Sakit Dr. Oen - Sistem Manajemen Antrian" />
      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
        {/* Counter Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="h-5 w-5 text-green-700" />
              Pilih Loket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((counter) => (
                <Button
                  key={counter}
                  onClick={() => handleCounterChange(counter)}
                  variant={selectedCounter === counter ? "default" : "outline"}
                  className={`p-4 h-16 ${
                    selectedCounter === counter
                      ? "bg-green-700 hover:bg-green-800"
                      : "hover:bg-green-50"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">Loket {counter}</div>
                    <div className="text-xs">
                      {countersStatus[counter]?.status === 'busy' ? 'Sibuk' : 'Tersedia'}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Menunggu
              </CardTitle>
              <Users2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium text-green-900 dark:text-green-100">
                {statistics.waiting}
              </div>
              <p className="text-xs font-medium text-green-600 dark:text-green-400">
                Pasien menunggu
              </p>
            </CardContent>
          </Card>


          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Sedang Dilayani
              </CardTitle>
              <Users2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium text-green-900 dark:text-green-100">
                {statistics.serving}
              </div>
              <p className="text-xs font-medium text-green-600 dark:text-green-400">
                Loket aktif
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Selesai Hari Ini
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-medium text-purple-900 dark:text-purple-100">
                {statistics.complete}
              </div>
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400">
                Pelanggan terlayani
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Current Serving */}
          <Card className="md:col-span-1 border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-700" />
                  Sedang Dilayani - Loket {selectedCounter}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCallNext}
                    disabled={nextQueues.length === 0 || disabledCallNext || currentServing !== null}
                    size="sm"
                    className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-normal"
                    variant="default"
                  >
                    <Phone className="h-4 w-4" />
                    {currentServing ? 'Sedang Melayani' : 'Panggil Selanjutnya'}
                  </Button>
                  {currentServing && (
                    <Button
                      onClick={handleCompleteQueue}
                      size="sm"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-normal"
                      variant="default"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Selesai
                    </Button>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentServing ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="mb-2 text-6xl font-light text-green-700">
                      {currentServing.number}
                    </div>
                    <Badge variant="secondary" className="px-4 py-2 text-lg font-normal bg-gray-100 text-slate-700">
                      {currentServing.service_name}
                    </Badge>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Loket: {selectedCounter} | Called at:{" "}
                    {currentServing.called_at
                      ? formatTime(currentServing.called_at)
                      : "N/A"}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="mb-2 text-4xl font-light text-gray-400">
                    ---
                  </div>
                  <p className="text-gray-500 font-normal">
                    Tidak ada pasien yang sedang dilayani
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next in Line */}
          <Card className="md:col-span-1 border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-700" />
                Antrian Selanjutnya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nextQueues.length > 0 ? (
                  nextQueues.map((queue, index) => (
                    <div
                      key={queue.id}
                      className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-primary">
                          {queue.number}
                        </div>
                        <div>
                          <div className="font-medium">
                            {queue.service_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Registered: {formatTime(queue.created_at)}
                          </div>
                        </div>
                      </div>
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        {index === 0 ? "Next" : `#${index + 1}`}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No queues waiting</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
