import usePusher from '../hooks/use-pusher';
import DisplayLayout from '@/layouts/display-layout';
import { useState, useEffect, useRef } from 'react';

interface Queue {
    id: number;
    number: string;
    service_name: string;
    counter: number | null;
}

interface DisplayQueueProps {
    currentQueue?: Queue;
    nextQueues?: Queue[];
}

export default function DisplayQueue({ currentQueue, nextQueues = [] }: DisplayQueueProps) {
    const [current, setCurrent] = useState<Queue | undefined>(currentQueue);
    const [next, setNext] = useState<Queue[]>(nextQueues.slice(0, 4));
    const [isPulsing, setIsPulsing] = useState(false);
    const bellAudioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element
    useEffect(() => {
        bellAudioRef.current = new Audio("/bell.wav");
        bellAudioRef.current.preload = "auto";
    }, []);

    const playBellAndAnnounce = async (queue: Queue) => {
        try {
            // Try to play bell sound
            if (bellAudioRef.current) {
                await bellAudioRef.current.play().catch((error) => {
                    console.log("Audio autoplay blocked by browser:", error);
                });
            }

            // Text-to-speech announcement
            setTimeout(() => {
                if ("speechSynthesis" in window) {
                    try {
                        const announcement = `Nomor antrian ${queue.number}, layanan ${queue.service_name}, silakan menuju ke loket ${queue.counter}`;
                        const utterance = new SpeechSynthesisUtterance(announcement);
                        utterance.lang = "id-ID";
                        utterance.rate = 0.9;
                        window.speechSynthesis.speak(utterance);
                    } catch (error) {
                        console.log("Failed to text-to-speech:", error);
                    }
                }
            }, 2000);
        } catch (error) {
            console.log("Failed to play bell:", error);
        }
    };    // Initialize Pusher for real-time updates
    // Lengkapi seperti pada slide PPT
    usePusher('queue-updates', {
        'queue-created': (data: unknown) => {
            const queueData = data as { queue: Queue };
            console.log('Queue created event received:', queueData);
            // Add new queue to next queues if there's space
            setNext((prev) => {
                const updated = [...prev, queueData.queue];
                return updated.slice(0, 4);
            });
        },
        'queue-called': (data: unknown) => {
            const queueData = data as { queue: Queue };
            console.log("Queue called event received:", queueData);
            setCurrent(queueData.queue);
            // Remove the called queue from next queues
            setNext((prev) => prev.filter((q) => q.id !== queueData.queue.id));
            // Trigger pulse animation
            setIsPulsing(true);
            setTimeout(() => setIsPulsing(false), 3000);
            // Play bell and announce
            playBellAndAnnounce(queueData.queue);
        },
    });

    return (
        <DisplayLayout>
            <div className="grid grid-cols-3 gap-8 h-screen">
                {/* Current Serving Section */}
                <div className="flex flex-col justify-between lg:col-span-2">
                    {/* Medical Header */}
                    <header className="py-6 text-center">
                        <div className="mb-2 mt-4">
                            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                RUMAH SAKIT DR. OEN SURAKARTA
                            </h1>
                            <div className="flex items-center justify-center space-x-3 mb-3">
                                <div className="w-10 h-0.5 bg-gradient-to-r from-white/70 to-white/50 rounded-full"></div>
                                <div className="w-3 h-3 bg-white rounded-full animate-heartbeat shadow-lg"></div>
                                <div className="w-10 h-0.5 bg-gradient-to-r from-white/50 to-white/70 rounded-full"></div>
                            </div>
                        </div>
                    </header>

                    {/* Medical Current Queue Display */}
                    <div className="flex-1 flex flex-col rounded-3xl bg-white/95 backdrop-blur-md p-8 shadow-2xl border border-white/30 relative overflow-hidden">
                        {/* Medical background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100/20 to-green-100/20 rounded-full -translate-y-32 translate-x-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-100/20 to-emerald-100/20 rounded-full translate-y-24 -translate-x-24"></div>

                        {/* Medical cross patterns */}
                        <div className="absolute top-8 left-8 medical-cross text-emerald-500"></div>
                        <div className="absolute bottom-8 right-8 medical-cross text-green-500"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-center mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                                    <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                        SEDANG DILAYANI
                                    </h2>
                                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            {current ? (
                                <div
                                    className={`flex flex-1 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-700 p-12 text-white transition-all duration-700 shadow-2xl shadow-emerald-500/30 relative overflow-hidden ${
                                        isPulsing ? 'ring-4 ring-emerald-300/50 ring-opacity-75 shadow-emerald-400/50 scale-[1.02] animate-pulse-green' : ''
                                    }`}
                                >
                                    {/* Medical animated background elements */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-4 left-4 w-12 h-12 border border-white/30 rounded-full animate-medic-float"></div>
                                        <div className="absolute bottom-4 right-4 w-8 h-8 border border-white/20 rounded-full animate-medic-float" style={{ animationDelay: '1s' }}></div>
                                        <div className="absolute top-1/2 right-8 w-4 h-4 bg-white/20 rounded-full animate-medic-float" style={{ animationDelay: '2s' }}></div>
                                    </div>

                                    <div className="absolute top-6 right-6">
                                        <div className="relative">
                                            <div className="w-3 h-3 bg-green-300 rounded-full animate-heartbeat"></div>
                                            <div className="absolute inset-0 w-3 h-3 bg-green-300 rounded-full animate-ping"></div>
                                        </div>
                                    </div>

                                    <div
                                        className={`mb-6 text-8xl font-bold transition-all duration-700 relative ${
                                            isPulsing ? 'scale-110 text-yellow-200 animate-heartbeat' : 'text-white'
                                        }`}
                                        style={{ fontFamily: 'Nunito, sans-serif' }}
                                    >
                                        {current.number}
                                        {isPulsing && (
                                            <div className="absolute inset-0 text-8xl font-bold text-yellow-200 animate-ping opacity-40">
                                                {current.number}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-2xl font-semibold text-emerald-100 mb-6 text-center">
                                        {current.service_name}
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                                        <div className="rounded-xl bg-white/95 backdrop-blur-sm px-6 py-3 text-xl font-bold text-emerald-700 shadow-lg border border-white/20">
                                            LOKET {current.counter ?? 'N/A'}
                                        </div>
                                        <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/50 p-12 text-slate-500 border-2 border-dashed border-emerald-200 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute inset-0" style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M20 18h2v4h-2v-2h-2v-2h2zm-2-2v2h-2v-2h2zm2-2h2v2h-2v-2zm2 2v2h2v-2h-2z'/%3E%3C/g%3E%3C/svg%3E")`,
                                        }}></div>
                                    </div>

                                    <div className="mb-6 relative">
                                        <svg className="w-20 h-20 text-emerald-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-3xl font-bold text-emerald-400 mb-3" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                        SIAP MELAYANI
                                    </div>
                                    <div className="text-lg text-slate-500">Menunggu pasien berikutnya</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Medical Footer */}
                    <footer className="py-6 text-center">
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/40">
                            <p className="text-lg font-semibold text-slate-700 mb-3">Mohon tunggu nomor antrian Anda dipanggil</p>
                            <div className="flex items-center justify-center space-x-3 text-sm text-slate-600">
                                <span className="inline-flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                                    <span>Rumah Sakit Dr. Oen Surakarta</span>
                                </span>
                                <span>•</span>
                                <span>Pelayanan Kesehatan Terpercaya</span>
                            </div>
                        </div>
                    </footer>
                </div>

                {/* Next Queues Section - Medical Green Theme */}
                <div className="py-6 lg:col-span-1">
                    <div className="flex h-full flex-col rounded-3xl bg-white/95 backdrop-blur-md p-6 shadow-2xl border border-white/40 relative overflow-hidden">
                        {/* Medical background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/20 to-green-100/20 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-100/20 to-emerald-100/20 rounded-full translate-y-12 -translate-x-12"></div>

                        <div className="relative z-10">
                            <h3 className="mb-6 text-center text-2xl font-bold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                ANTRIAN SELANJUTNYA
                            </h3>

                            <div className="flex flex-1 flex-col space-y-3 overflow-y-auto">
                                {next.length > 0 &&
                                    next.map((queue, index) => (
                                        <div
                                            key={queue.id}
                                            className={`flex flex-1 flex-col justify-center rounded-xl p-5 transition-all duration-500 border relative overflow-hidden ${
                                                index === 0
                                                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-200 shadow-xl shadow-emerald-500/30'
                                                    : 'bg-white/90 backdrop-blur-sm text-slate-800 border-emerald-200/60 hover:bg-white/95 hover:shadow-lg hover:border-emerald-300/60'
                                            }`}
                                        >
                                            {index === 0 && (
                                                <>
                                                    <div className="absolute top-2 right-2">
                                                        <div className="w-2 h-2 bg-yellow-300 rounded-full animate-heartbeat shadow-lg"></div>
                                                    </div>
                                                    <div className="absolute inset-0 opacity-10">
                                                        <div className="absolute bottom-0 right-0 w-16 h-16 border border-white/30 rounded-full translate-x-8 translate-y-8"></div>
                                                        <div className="absolute top-2 left-2 medical-cross text-white"></div>
                                                    </div>
                                                </>
                                            )}

                                            {index !== 0 && (
                                                <div className="absolute inset-0 opacity-5">
                                                    <div className="absolute top-2 right-2 medical-cross text-emerald-500"></div>
                                                </div>
                                            )}

                                            <div className={`mb-2 text-3xl font-bold relative ${
                                                index === 0 ? 'text-white' : 'text-emerald-700'
                                            }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                                                {queue.number}
                                                {index === 0 && (
                                                    <span className="absolute -top-1 -right-1 text-xs bg-yellow-300 text-yellow-900 px-2 py-1 rounded-full font-semibold animate-pulse">
                                                        BERIKUTNYA
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`text-sm font-medium ${
                                                index === 0 ? 'text-emerald-50' : 'text-slate-600'
                                            }`}>
                                                {queue.service_name}
                                            </div>
                                        </div>
                                    ))}

                                {/* Fill empty slots with medical placeholders */}
                                {Array.from({ length: Math.max(0, 4 - next.length) }).map((_, index) => (
                                    <div
                                        key={`empty-${index}`}
                                        className="flex flex-1 flex-col justify-center rounded-xl bg-emerald-50/50 backdrop-blur-sm p-5 text-center text-slate-400 border border-emerald-200/30 relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 opacity-5">
                                            <div className="absolute inset-0" style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M10 8h1v4h-1v-1h-1v-1h1zm-1-1v1h-1v-1h1zm1-1h1v1h-1v-1zm1 1v1h1v-1h-1z'/%3E%3C/g%3E%3C/svg%3E")`,
                                            }}></div>
                                        </div>
                                        <div className="absolute top-2 right-2 medical-cross text-emerald-300"></div>
                                        <div className="mb-2 text-3xl font-light text-emerald-300 relative" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                            ---
                                        </div>
                                        <div className="text-sm font-medium text-emerald-400">Menunggu</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DisplayLayout>
    );
}
