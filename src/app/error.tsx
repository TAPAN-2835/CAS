"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { AlertCircle } from "lucide-react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4">
            <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <p className="text-muted-foreground max-w-sm text-center">
                We encountered an unexpected error. Please try again later.
            </p>
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Go Home
                </Button>
                <Button onClick={() => reset()}>Try again</Button>
            </div>
        </div>
    )
}
