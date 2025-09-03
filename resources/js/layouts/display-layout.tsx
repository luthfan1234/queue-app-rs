import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export default ({ children }: Props) => {
    return (
        <>
            <Head title="Rumah Sakit Dr. Oen Surakarta - Sistem Antrian Digital">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=poppins:300,400,500,600,700,800&family=nunito:400,500,600,700" rel="stylesheet" />
            </Head>

            <main
                className="min-h-screen px-8 py-6 text-slate-800 relative overflow-hidden"
                style={{
                    backgroundImage: `url('/bg-emerald.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* Overlay untuk memberikan efek transparan dan mempertahankan readability */}
                <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[1px]"></div>

                {/* Medical background pattern overlay */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 38h2v4h-2v-2h-2v-2h2zm-2-2v2h-2v-2h2zm2-2h2v2h-2v-2zm2 2v2h2v-2h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                {/* Subtle medical cross decorations */}
                <div className="absolute top-10 right-10 w-8 h-8 opacity-10">
                    <div className="w-full h-1 bg-white absolute top-1/2 transform -translate-y-1/2 shadow-lg"></div>
                    <div className="h-full w-1 bg-white absolute left-1/2 transform -translate-x-1/2 shadow-lg"></div>
                </div>
                <div className="absolute bottom-20 left-20 w-6 h-6 opacity-10">
                    <div className="w-full h-1 bg-white absolute top-1/2 transform -translate-y-1/2 shadow-lg"></div>
                    <div className="h-full w-1 bg-white absolute left-1/2 transform -translate-x-1/2 shadow-lg"></div>
                </div>

                <div className="relative mx-auto max-w-7xl">
                    {children}
                </div>
            </main>
        </>
    );
};
