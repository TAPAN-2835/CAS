import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CategoryBadgeProps {
    category: string
    className?: string
}

const categoryColors: Record<string, string> = {
    tech: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    sports: "bg-green-100 text-green-800 hover:bg-green-200",
    music: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    art: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    business: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    food: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    default: "bg-gray-100 text-gray-800 hover:bg-gray-200",
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
    const colorClass =
        categoryColors[category.toLowerCase()] || categoryColors.default

    return (
        <Badge
            variant="secondary"
            className={cn("capitalize font-medium", colorClass, className)}
        >
            {category}
        </Badge>
    )
}
