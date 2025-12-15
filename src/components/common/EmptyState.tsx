import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileQuestion } from "lucide-react"

interface EmptyStateProps {
    title: string
    description: string
    actionLabel?: string
    actionHref?: string
}

export function EmptyState({
    title,
    description,
    actionLabel,
    actionHref,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted rounded-full p-4 mb-4">
                <FileQuestion className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
            {actionLabel && actionHref && (
                <Link href={actionHref}>
                    <Button>{actionLabel}</Button>
                </Link>
            )}
        </div>
    )
}
