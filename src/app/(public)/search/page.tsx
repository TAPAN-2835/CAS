import { Suspense } from 'react'
import { SearchBar } from '@/components/common/SearchBar'
import { Filters } from '@/components/common/Filters'
import { EventCard } from '@/components/common/EventCard'
import { CommunityCard } from '@/components/common/CommunityCard'
import { EmptyState } from '@/components/common/EmptyState'

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; type?: string; category?: string }>
}) {
    const resolvedParams = await searchParams
    const query = resolvedParams.q || ''
    const type = resolvedParams.type || 'all'
    const category = resolvedParams.category

    // Mock data - in real app would fetch based on searchParams
    const events = [
        {
            id: '1',
            title: 'Tech Startup Summit 2024',
            date: '2024-12-15',
            time: '09:00 AM',
            location: 'Innovation Hub, Downtown',
            price: 49,
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000',
            category: 'Tech',
            organizerName: 'TechHub City'
        },
        // Add more mock events to demonstrate grid
        {
            id: '2',
            title: 'Music Festival 2024',
            date: '2024-12-20',
            time: '18:00 PM',
            location: 'City Park',
            price: 150,
            image: 'https://images.unsplash.com/photo-1459749411177-d4a42b9ee067?auto=format&fit=crop&q=80&w=2000',
            category: 'Music',
            organizerName: 'Vibe Events'
        },
    ]

    const communities = [
        {
            id: '1',
            name: 'Urban Gardeners',
            description: 'A community for those who love to grow food and flowers in the city.',
            membersCount: 1250,
            location: 'Metro Area',
            image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=2000',
            category: 'Lifestyle'
        },
        // Add more mock communities
    ]

    // Simulate Filtering for Mock
    const filteredEvents = category && category !== 'all'
        ? events.filter(e => e.category.toLowerCase().includes(category.toLowerCase()))
        : events;

    const showEvents = type === 'all' || type === 'events'
    const showCommunities = type === 'all' || type === 'communities'

    const totalResults = (showEvents ? filteredEvents.length : 0) + (showCommunities ? communities.length : 0)

    const getContextText = () => {
        if (query) return `Search results for "${query}"`
        if (category && category !== 'all') return `${category} Events`
        return 'Explore'
    }

    return (
        <div className="container py-8 lg:py-12">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        {getContextText()}
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        Found {totalResults} results near you
                    </p>

                    <div className="flex flex-col gap-6">
                        <Suspense fallback={<div className="h-12 bg-muted/50 rounded-full animate-pulse" />}>
                            <SearchBar />
                        </Suspense>
                        <Suspense fallback={<div className="h-12 bg-muted/50 rounded-lg animate-pulse" />}>
                            <Filters />
                        </Suspense>
                    </div>
                </div>

                {showEvents && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Events</h2>
                            <span className="text-muted-foreground text-sm">{filteredEvents.length} found</span>
                        </div>
                        {filteredEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredEvents.map((event) => (
                                    <EventCard key={event.id} {...event} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="No events found"
                                description={query ? `We couldn't find any events matching "${query}"` : "Try adjusting your filters to see more results."}
                                actionLabel="Clear Filters"
                                actionHref="/search"
                            />
                        )}
                    </div>
                )}

                {showCommunities && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Communities</h2>
                            <span className="text-muted-foreground text-sm">{communities.length} found</span>
                        </div>
                        {communities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {communities.map((community) => (
                                    <CommunityCard key={community.id} {...community} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="No communities found"
                                description="Try adjusting your search or filters."
                                actionLabel="Clear Filters"
                                actionHref="/search"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
