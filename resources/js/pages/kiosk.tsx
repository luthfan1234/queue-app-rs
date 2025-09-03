import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import DisplayLayout from '@/layouts/display-layout';
import { Stethoscope, Heart, UserCheck, Calendar } from 'lucide-react';
import { useState } from 'react';

const services = [
    { id: 1, name: 'Pelayanan Gawat Darurat', icon: Stethoscope },
    { id: 2, name: 'Pelayanan Rawat Jalan / Poliklinik', icon: UserCheck },
    { id: 3, name: 'Pelayanan Rawat Inap', icon: Heart },
    { id: 4, name: 'Pelayanan Farmasi', icon: Calendar },
];

export default function Kiosk({ csrf }: { csrf: string }) {
    const [queueNumber, setQueueNumber] = useState<string | null>(null);

    const handleGetQueue = async (serviceId?: number) => {
        // Call KioskController store method
        const response = await fetch('/kiosk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
            },
            body: JSON.stringify({
                service_id: serviceId,
            }),
        });

        const data = await response.json();
        console.log(data.number);
        setQueueNumber(data.number);
    };

    return (
        <DisplayLayout>
            {/* Medical Header */}
            <header className="mt-8 text-center">
                <div className="mb-8 mt-20">

                    <h1 className="text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        RUMAH SAKIT DR. OEN SURAKARTA
                    </h1>
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-10 h-0.5 bg-gradient-to-r from-white/70 to-white/50 rounded-full"></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-heartbeat shadow-lg"></div>
                        <div className="w-10 h-0.5 bg-gradient-to-r from-white/50 to-white/70 rounded-full"></div>
                    </div>

                </div>
            </header>

            <div className="mx-auto w-full max-w-6xl">
                {!queueNumber ? (
                    <div className="rounded-3xl bg-white/95 backdrop-blur-md p-8 shadow-2xl border border-white/40 relative overflow-hidden">
                        {/* Medical background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-100/30 to-green-100/30 rounded-full -translate-y-32 translate-x-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-green-100/30 to-emerald-100/30 rounded-full translate-y-24 -translate-x-24"></div>

                        {/* Medical cross patterns */}
                        <div className="absolute top-8 left-8 medical-cross text-emerald-500"></div>
                        <div className="absolute bottom-8 right-8 medical-cross text-green-500"></div>

                        <div className="relative z-10">
                            <div className="mb-8 text-center">
                                <h2 className="mb-4 text-3xl font-bold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                    Pilih Layanan yang Anda Butuhkan
                                </h2>
                                <p className="text-lg text-slate-600">Sentuh tombol sesuai dengan layanan yang diinginkan</p>
                            </div>

                            <div className="grid min-h-80 grid-cols-2 gap-6">
                                {services.map((service, index) => (
                                    <Button
                                        key={service.id}
                                        onClick={() => handleGetQueue(service.id)}
                                        className={`h-full w-full text-xl flex-col gap-4 border-0 shadow-lg hover:shadow-xl transition-all duration-500 font-semibold rounded-2xl relative overflow-hidden group ${
                                            index === 0 ? 'bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700' :
                                            index === 1 ? 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' :
                                            index === 2 ? 'bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' :
                                            'bg-gradient-to-br from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700'
                                        } text-white hover:scale-[1.02]`}
                                    >
                                        {/* Medical background decoration for each button */}
                                        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                            <div className="absolute top-3 right-3 medical-cross text-white"></div>
                                            <div className="absolute bottom-3 left-3 w-8 h-8 border border-white/20 rounded-full"></div>
                                        </div>

                                        <div className="relative z-20 flex items-center justify-center">
                                            <Icon iconNode={service.icon} className="size-12 text-white mb-2 group-hover:scale-110 transition-transform duration-500 mr-4" />
                                            <span className="text-white font-semibold">{service.name}</span>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-3xl bg-white/95 backdrop-blur-md p-12 text-center shadow-2xl border border-white/40 relative overflow-hidden">
                        {/* Medical background decoration */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-100/20 to-emerald-100/20 rounded-full -translate-y-24 translate-x-24"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-100/20 to-green-100/20 rounded-full translate-y-16 -translate-x-16"></div>

                        {/* Medical cross patterns */}
                        <div className="absolute top-8 left-8 medical-cross text-emerald-300"></div>
                        <div className="absolute bottom-8 right-8 medical-cross text-green-300"></div>

                        <div className="relative z-10">
                            <div className="mb-6">
                                <div className="inline-flex items-center justify-center w-18 h-18 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-2xl shadow-green-500/40 relative">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse-green"></div>
                                </div>
                                <h2 className="mb-4 text-3xl font-bold text-slate-800" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                    Nomor Antrian Anda
                                </h2>
                            </div>

                            <div className="mb-8 relative">
                                <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text animate-heartbeat" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                    {queueNumber}
                                </div>
                                <div className="absolute inset-0 text-8xl font-bold text-emerald-300/20 animate-pulse" style={{ fontFamily: 'Nunito, sans-serif' }}>
                                    {queueNumber}
                                </div>
                            </div>

                            <p className="mb-8 text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                                Mohon tunggu hingga nomor Anda dipanggil.
                                <br />
                                Perhatikan layar display untuk giliran Anda.
                            </p>

                            <Button
                                onClick={() => setQueueNumber(null)}
                                size="lg"
                                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
                            >
                                Kembali ke Layanan
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </DisplayLayout>
    );
}
