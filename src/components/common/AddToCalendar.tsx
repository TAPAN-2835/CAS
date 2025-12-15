import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCalendarProps {
    title: string;
    description?: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    className?: string;
}

export function AddToCalendar({ title, description, location, startDate, endDate, className }: AddToCalendarProps) {

    const googleCalendarUrl = () => {
        const start = startDate.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const end = (endDate || new Date(startDate.getTime() + 60 * 60 * 1000)).toISOString().replace(/-|:|\.\d\d\d/g, "");

        const params = new URLSearchParams({
            action: "TEMPLATE",
            text: title,
            details: description || "",
            location: location || "",
            dates: `${start}/${end}`,
        });

        return `https://www.google.com/calendar/render?${params.toString()}`;
    };

    return (
        <Button variant="outline" size="sm" className={cn("gap-2", className)} asChild>
            <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer">
                <CalendarPlus size={16} />
                Add to Calendar
            </a>
        </Button>
    );
}
