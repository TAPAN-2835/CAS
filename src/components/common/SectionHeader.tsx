import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface SectionHeaderProps {
    title: string
    description?: string
    actionLabel?: string
    actionHref?: string
}

export function SectionHeader({
    title,
    description,
    actionLabel,
    actionHref,
}: SectionHeaderProps) {
    return (
        <div className="flex items-end justify-between mb-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                {description && (
                    <p className="text-muted-foreground mt-2">{description}</p>
                )}
            </div>
            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="group flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
                >
                    {actionLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            )}
        </div>
    )
}
