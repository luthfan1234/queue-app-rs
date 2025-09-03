
import { SVGAttributes } from 'react';

export default function AppLogo(props: { className?: string } & SVGAttributes<SVGElement>) {
    return (
        <div className={`flex items-center space-x-3 ${props.className ?? ''}`}>


            <div className="grid text-left leading-tight">
                <span className="text-sm font-semibold text-green-800">RS Dr. Oen</span>
                <span className="text-xs text-slate-500">Sistem Antrian</span>
            </div>
        </div>
    );
}
