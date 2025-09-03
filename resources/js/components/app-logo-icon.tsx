import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
            {/* Rounded medical cross */}
            <rect x="9" y="4" width="6" height="16" rx="1.5" fill="currentColor" />
            <rect x="4" y="9" width="16" height="6" rx="1.5" fill="currentColor" />

            {/* Queue indicator dots (stacked) */}
            <circle cx="19.2" cy="6" r="1.2" fill="currentColor" opacity="0.9" />
            <circle cx="19.2" cy="12" r="1.2" fill="currentColor" opacity="0.6" />
            <circle cx="19.2" cy="18" r="1.2" fill="currentColor" opacity="0.35" />
        </svg>
    );
}
