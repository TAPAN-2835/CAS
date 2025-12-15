"use client"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { FilterX, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export function Filters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isOpen, setIsOpen] = useState(false)

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== "all") {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`?${params.toString()}`)
    }

    const hasActiveFilters = searchParams.toString().length > 0;

    return (
        <div className="w-full">
            <div className="md:hidden mb-4">
                <Button
                    variant="outline"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full justify-between"
                >
                    <span className="flex items-center gap-2">
                        <SlidersHorizontal size={16} />
                        Filters
                    </span>
                    {hasActiveFilters && <span className="bg-primary h-2 w-2 rounded-full" />}
                </Button>
            </div>

            <div className={cn(
                "flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg border",
                isOpen ? "flex" : "hidden md:flex"
            )}>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-sm font-medium whitespace-nowrap hidden md:inline">Category:</span>
                    <Select
                        defaultValue={searchParams.get("category") || "all"}
                        onValueChange={(val) => updateFilter("category", val)}
                    >
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="tech">Technology</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="music">Music</SelectItem>
                            <SelectItem value="art">Art & Culture</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="food">Food & Drink</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-sm font-medium whitespace-nowrap hidden md:inline">Sort by:</span>
                    <Select
                        defaultValue={searchParams.get("sort") || "newest"}
                        onValueChange={(val) => updateFilter("sort", val)}
                    >
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Newest" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="popular">Most Popular</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto w-full md:w-auto"
                    onClick={() => router.push("?")}
                    disabled={!hasActiveFilters}
                >
                    <FilterX size={16} className="mr-2" />
                    Reset Filters
                </Button>
            </div>
        </div>
    )
}
