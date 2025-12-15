import { EventCardSkeleton } from "@/components/common/Skeletons"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="container py-12">
            <div className="flex flex-col gap-8">
                <div>
                    <Skeleton className="h-10 w-[300px] mb-6" />
                    <div className="flex flex-col gap-6">
                        <Skeleton className="h-12 w-full rounded-full" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                    </div>
                </div>

                <div className="space-y-6">
                    <Skeleton className="h-8 w-[150px]" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <EventCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
