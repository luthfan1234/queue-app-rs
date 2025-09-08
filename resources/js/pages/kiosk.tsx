import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import DisplayLayout from '@/layouts/display-layout';
import { Stethoscope,Bone, UserCheck, Microscope, ScanLine, BriefcaseMedical, Syringe, Printer } from 'lucide-react';
import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const services = [
    { id: 1, name: 'Pelayanan Gawat Darurat', icon: Stethoscope },
    { id: 2, name: 'Pelayanan Rawat Jalan / Poliklinik', icon: UserCheck },
    { id: 3, name: 'Pelayanan Rawat Inap', icon: BriefcaseMedical },
    { id: 4, name: 'Pelayanan Farmasi', icon: Syringe },
    { id: 5, name: "Pelayanan Gigi dan Mulut", icon: Bone },
    { id: 6, name: "Pelayanan Laboratorium", icon: Microscope },
    { id: 7, name: "Pelayanan Radiologi", icon: ScanLine }
];

export default function Kiosk({ csrf }: { csrf: string }) {
    const [queueNumber, setQueueNumber] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<string>('');
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const handleGetQueue = async (serviceId?: number) => {
        // Find service name
        const service = services.find(s => s.id === serviceId);
        if (service) {
            setSelectedService(service.name);
        }

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

    const handlePrintTicket = async () => {
        setIsGeneratingPDF(true);
        try {
            if (printRef.current) {
                // Generate canvas from the ticket element
                const canvas = await html2canvas(printRef.current, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });

                // Create PDF
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: [80, 120] // Ticket size (80mm x 120mm)
                });

                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 80;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

                // Auto print
                pdf.autoPrint();
                pdf.output('dataurlnewwindow');
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Gagal mencetak tiket. Silakan coba lagi.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleSimplePrint = () => {
        // Simple browser print
        const printWindow = window.open('', '_blank');
        if (printWindow && printRef.current) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Tiket Antrian - ${queueNumber}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 20px;
                            width: 80mm;
                            background: white;
                        }
                        .ticket {
                            text-align: center;
                            border: 2px dashed #333;
                            padding: 20px;
                            margin: 0;
                        }
                        .queue-number {
                            font-size: 48px;
                            font-weight: bold;
                            margin: 20px 0;
                            color: #059669;
                        }
                        .service-name {
                            font-size: 14px;
                            margin: 10px 0;
                            font-weight: bold;
                        }
                        .hospital-name {
                            font-size: 16px;
                            font-weight: bold;
                            margin-bottom: 10px;
                        }
                        .instructions {
                            font-size: 12px;
                            margin-top: 15px;
                            line-height: 1.4;
                        }
                        .datetime {
                            font-size: 10px;
                            color: #666;
                            margin-top: 10px;
                        }
                        @media print {
                            body { margin: 0; padding: 0; }
                            .ticket { border: 2px dashed #333; page-break-inside: avoid; }
                        }
                    </style>
                </head>
                <body>
                    <div class="ticket">
                        <div class="hospital-name">RUMAH SAKIT DR. OEN</div>
                        <div class="hospital-name">SURAKARTA</div>
                        <hr style="margin: 15px 0; border: 1px solid #333;">
                        <div style="font-weight: bold; margin: 10px 0;">NOMOR ANTRIAN</div>
                        <div class="queue-number">${queueNumber}</div>
                        <div class="service-name">${selectedService}</div>
                        <hr style="margin: 15px 0; border: 1px solid #333;">
                        <div class="instructions">
                            Mohon tunggu hingga nomor Anda dipanggil.<br>
                            Perhatikan layar display untuk giliran Anda.
                        </div>
                        <div class="datetime">${new Date().toLocaleString('id-ID')}</div>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        }
    };

    return (
        <DisplayLayout>
            {/* Medical Header */}
            <header className="mt-8 text-center">
                <div className="mb-8 mt-20">

                    <h1 className="text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-lg" style={{ fontFamily: 'Nunito, sans-serif' }}>
                        RSIA Melati Husada
                    </h1>
                    <p className="text-sm mb-2 text-white/80">Jl. Kawi No.32, Gading Kasri, Kec. Klojen, Kota Malang, Jawa Timur</p>
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-10 h-0.5 bg-gradient-to-r from-white/70 to-white/50 rounded-full"></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-heartbeat shadow-lg"></div>
                        <div className="w-10 h-0.5 bg-gradient-to-r from-white/50 to-white/70 rounded-full"></div>
                    </div>

                </div>
            </header>

            <div className="mx-auto w-full max-w-8xl">
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

                            <div className="grid min-h-240 grid-cols-2 gap-6">
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

                            <div className="mb-6 text-lg font-semibold text-slate-700">
                                {selectedService}
                            </div>

                            <p className="mb-8 text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                                Mohon tunggu hingga nomor Anda dipanggil.
                                <br />
                                Perhatikan layar display untuk giliran Anda.
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-center mb-6">
                                <Button
                                    onClick={handleSimplePrint}
                                    disabled={isGeneratingPDF}
                                    size="lg"
                                    className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 flex items-center gap-2"
                                >
                                    <Printer className="w-5 h-5" />
                                    {isGeneratingPDF ? 'Mencetak...' : 'Cetak Tiket'}
                                </Button>

                                <Button
                                    onClick={handlePrintTicket}
                                    disabled={isGeneratingPDF}
                                    size="lg"
                                    variant="outline"
                                    className="bg-white/90 hover:bg-white border-2 border-emerald-600 text-emerald-700 hover:text-emerald-800 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Cetak PDF
                                </Button>
                            </div>

                            <Button
                                onClick={() => {
                                    setQueueNumber(null);
                                    setSelectedService('');
                                }}
                                size="lg"
                                variant="ghost"
                                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
                            >
                                Kembali ke Layanan
                            </Button>
                        </div>

                        {/* Hidden printable ticket */}
                        <div ref={printRef} className="hidden">
                            <div style={{
                                width: '80mm',
                                backgroundColor: 'white',
                                padding: '20px',
                                textAlign: 'center',
                                border: '2px dashed #333',
                                fontFamily: 'Arial, sans-serif'
                            }}>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                                    RSIA Melati Husada
                                </div>
                                <hr style={{ margin: '15px 0', border: '1px solid #333' }} />
                                <div style={{ fontWeight: 'bold', margin: '10px 0' }}>NOMOR ANTRIAN</div>
                                <div style={{
                                    fontSize: '48px',
                                    fontWeight: 'bold',
                                    margin: '20px 0',
                                    color: '#059669'
                                }}>
                                    {queueNumber}
                                </div>
                                <div style={{ fontSize: '14px', margin: '10px 0', fontWeight: 'bold' }}>
                                    {selectedService}
                                </div>
                                <hr style={{ margin: '15px 0', border: '1px solid #333' }} />
                                <div style={{ fontSize: '12px', marginTop: '15px', lineHeight: 1.4 }}>
                                    Mohon tunggu hingga nomor Anda dipanggil.<br />
                                    Perhatikan layar display untuk giliran Anda.
                                </div>
                                <div style={{ fontSize: '10px', color: '#666', marginTop: '10px' }}>
                                    {new Date().toLocaleString('id-ID')}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DisplayLayout>
    );
}
