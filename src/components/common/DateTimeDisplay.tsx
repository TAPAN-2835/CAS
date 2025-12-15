import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateTimeDisplayProps {
    date?: string | Date; // ISO string or Date object
    className?: string;
    showTime?: boolean;
    showIcon?: boolean;
}

export function DateTimeDisplay({ date, className, showTime = true, showIcon = true }: DateTimeDisplayProps) {
    if (!date) return null;

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Format options
    const dateOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: showTime ? undefined : 'numeric'
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit'
    };

    const dateStr = dateObj.toLocaleDateString('en-IN', dateOptions);
    const timeStr = dateObj.toLocaleTimeString('en-IN', timeOptions);

    return (
        <div className={cn("inline-flex items-center text-muted-foreground text-sm gap-2", className)}>
            {showIcon && <Calendar size={16} />}
            <span>{dateStr}</span>
            {showTime && (
                <>
                    {showIcon && <Clock size={16} className="ml-2" />}
                    <span className={cn(!showIcon && "ml-1 border-l pl-2 border-border")}>{timeStr}</span>
                </>
            )}
        </div>
    );
}
