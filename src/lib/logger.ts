export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogPayload {
    message: string;
    details?: any;
    error?: Error | unknown;
    path?: string;
    userId?: string;
}

class Logger {
    private log(level: LogLevel, payload: LogPayload) {
        const timestamp = new Date().toISOString();
        const { message, details, error, path, userId } = payload;

        const logEntry = {
            timestamp,
            level,
            message,
            path,
            userId,
            details: details || undefined,
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack,
                name: error.name
            } : error,
        };

        // In production, this would send to Datadog/Sentry/CloudWatch
        console[level](JSON.stringify(logEntry));
    }

    info(message: string, details?: any) {
        this.log('info', { message, details });
    }

    warn(message: string, details?: any) {
        this.log('warn', { message, details });
    }

    error(message: string, error?: unknown, details?: any) {
        this.log('error', { message, error, details });
    }

    // For specific contexts
    action(actionName: string, userId: string, details?: any) {
        this.log('info', { message: `Action: ${actionName}`, userId, details });
    }
}

export const logger = new Logger();
