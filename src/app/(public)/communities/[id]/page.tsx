import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EventCard } from '@/components/common/EventCard'
import { MapPin, Users, Calendar } from 'lucide-react'
import Image from 'next/image'

export default async function CommunityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    // Mock data
    const community = {
        id: id,
        name: 'Urban Gardeners',
        description: 'A community for those who love to grow food and flowers in the city. We organize workshops, seed swaps, and garden tours. Whether you have a balcony, a backyard, or just a windowsill, join us to learn and share.',
        membersCount: 1250,
        location: 'Metro Area',
        image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=2000',
        category: 'Lifestyle',
        organizerName: 'Sarah Green',
        upcomingEvents: [
            {
                id: '1',
                title: 'Spring Planting Workshop',
                date: '2024-03-15',
                time: '10:00 AM',
                location: 'Community Center',
                price: 15,
                image: 'https://images.unsplash.com/photo-1416879115533-19ce329911a4?auto=format&fit=crop&q=80&w=2000',
                category: 'Workshop',
                organizerName: 'Urban Gardeners'
            }
        ]
    }

    return (
        <div>
            {/* Cover Image */}
            <div className="relative h-[300px] md:h-[400px] w-full">
                <Image
                    src={community.image}
                    alt={community.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="container relative h-full flex flex-col justify-end pb-8 text-white">
                    <Badge className="w-fit mb-4 bg-primary text-white border-none">
                        {community.category}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">{community.name}</h1>
                    <div className="flex items-center gap-6 text-sm md:text-base">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            <span>{community.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            <span>{community.membersCount} members</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="about" className="w-full">
                            <TabsList className="w-full justify-start mb-8 bg-transparent border-b rounded-none h-auto p-0">
                                <TabsTrigger
                                    value="about"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                                >
                                    About
                                </TabsTrigger>
                                <TabsTrigger
                                    value="events"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                                >
                                    Events
                                </TabsTrigger>
                                <TabsTrigger
                                    value="members"
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                                >
                                    Members
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="about" className="space-y-6">
                                <div className="prose max-w-none">
                                    <h3 className="text-xl font-semibold mb-4">Description</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {community.description}
                                    </p>
                                </div>
                            </TabsContent>

                            <TabsContent value="events">
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {community.upcomingEvents.map((event) => (
                                            <EventCard key={event.id} {...event} />
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-6">
                        <div className="border rounded-xl p-6 shadow-sm sticky top-24">
                            <Button size="lg" className="w-full mb-4">
                                Join Community
                            </Button>
                            <p className="text-center text-sm text-muted-foreground mb-6">
                                Join to get updates on new events and connect with members.
                            </p>

                            <div className="pt-6 border-t">
                                <h4 className="font-semibold mb-4">Organizer</h4>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                        {community.organizerName[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium">{community.organizerName}</p>
                                        <p className="text-xs text-muted-foreground">Community Lead</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
