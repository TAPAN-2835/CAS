import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Assuming we might want tooltip, if not present I'll remove

interface VerifiedBadgeProps {
    className?: string;
    size?: number;
}

export function VerifiedBadge({ className, size = 16 }: VerifiedBadgeProps) {
    return (
        <div className={cn("inline-flex items-center justify-center text-blue-500", className)} title="Verified">
            <BadgeCheck size={size} fill="currentColor" className="text-white" />
            {/* Usually filled check: Blue circle, white check, or Blue check. 
           Bootstrap icons BadgeCheck is outline. Lucide BadgeCheck is badge outline with check inside.
           Let's style it to look 'premium'.
       */}
        </div>
    );
}

// Improved version for "Premium" look
export function PremiumVerifiedBadge({ className, size = 20 }: VerifiedBadgeProps) {
    return (
        <span className={cn("inline-flex items-center text-blue-600 ml-1", className)} aria-label="Verified">
            <BadgeCheck size={size} className="fill-blue-100" />
        </span>
    );
}
