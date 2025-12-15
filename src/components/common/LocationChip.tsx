import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationChipProps {
    location: string;
    className?: string;
    iconSize?: number;
}

export function LocationChip({ location, className, iconSize = 16 }: LocationChipProps) {
    if (!location) return null;

    return (
        <div className={cn("inline-flex items-center text-muted-foreground text-sm", className)}>
            <MapPin size={iconSize} className="mr-1 shrink-0" />
            <span className="truncate">{location}</span>
        </div>
    );
}
