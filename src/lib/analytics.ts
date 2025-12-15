type EventName =
    | 'search_performed'
    | 'event_viewed'
    | 'join_initiated'
    | 'join_completed'
    | 'join_failed'
    | 'organizer_publish';

interface AnalyticsProperties {
    [key: string]: any;
}

class Analytics {
    track(event: EventName, properties?: AnalyticsProperties) {
        // In production, send to PostHog/Google Analytics/Segment
        // For development, we log to console with a distinctive prefix
        if (process.env.NODE_ENV === 'development') {
            console.groupCollapsed(`📊 Analytics: ${event}`);
            console.log(properties);
            console.groupEnd();
        }
    }
}

export const analytics = new Analytics();
