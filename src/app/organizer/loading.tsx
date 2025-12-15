import { TableSkeleton } from "@/components/common/Skeletons"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="container py-12">
            <div className="flex justify-between items-center mb-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="h-4 w-[350px]" />
                </div>
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-[150px]" />
                    <Skeleton className="h-10 w-[150px]" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-8">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-[120px] rounded-xl" />
                ))}
            </div>

            <TableSkeleton />
        </div>
    )
}
