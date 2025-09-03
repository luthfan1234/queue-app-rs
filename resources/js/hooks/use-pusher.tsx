import pusher from '@/lib/pusher';
import type { Channel } from 'pusher-js';
import { useEffect, useRef } from 'react';

type EventHandlers = {
    [eventName: string]: (data: unknown) => void;
};

export function usePusher(channelName: string, eventHandlers: EventHandlers) {
    const channelRef = useRef<Channel | null>(null);

    useEffect(() => {
        // Subscribe to channel
        channelRef.current = pusher.subscribe(channelName);
        const channel = channelRef.current;

        // Bind event handlers
        Object.entries(eventHandlers).forEach(([eventName, handler]) => {
            channel.bind(eventName, handler);
        });

        // Cleanup function
        return () => {
            Object.keys(eventHandlers).forEach((eventName) => {
                channel.unbind(eventName);
            });
            pusher.unsubscribe(channelName);
            channelRef.current = null;
        };
    }, [channelName, eventHandlers]);

    return channelRef.current;
}

export default usePusher;
