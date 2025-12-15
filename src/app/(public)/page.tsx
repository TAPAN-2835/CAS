import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/common/SearchBar'
import { EventCard } from '@/components/common/EventCard'
import { CommunityCard } from '@/components/common/CommunityCard'
import { SectionHeader } from '@/components/common/SectionHeader'
import { CategoryBadge } from '@/components/common/CategoryBadge'
import { ArrowRight, Calendar, Users, Trophy } from 'lucide-react'

export default function Home() {
    // Mock data for landing page
    const featuredEvents = [
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
        {
            id: '2',
            title: 'City Marathon 2024',
            date: '2024-12-20',
            time: '06:00 AM',
            location: 'Central Park',
            price: 25,
            image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&q=80&w=2000',
            category: 'Sports',
            organizerName: 'City Runners'
        },
        {
            id: '3',
            title: 'Jazz Night Under the Stars',
            date: '2024-12-18',
            time: '08:00 PM',
            location: 'Blue Note Club',
            price: 15,
            image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=2000',
            category: 'Music',
            organizerName: 'Jazz Collective'
        }
    ]

    const featuredCommunities = [
        {
            id: '1',
            name: 'Urban Gardeners',
            description: 'A community for those who love to grow food and flowers in the city.',
            membersCount: 1250,
            location: 'Metro Area',
            image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=2000',
            category: 'Lifestyle'
        },
        {
            id: '2',
            name: 'Code & Coffee',
            description: 'Weekly meetups for developers to work on projects and network.',
            membersCount: 3400,
            location: 'Downtown',
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000',
            category: 'Tech'
        },
        {
            id: '3',
            name: 'Mountain Hikers',
            description: 'Weekend hiking trips for all skill levels.',
            membersCount: 890,
            location: 'North Hills',
            image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=2000',
            category: 'Sports'
        }
    ]

    const categories = ['Tech', 'Sports', 'Music', 'Art', 'Business', 'Food', 'Lifestyle', 'Education']

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
                    <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px]" />
                </div>

                <div className="container relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        Discover Your <span className="text-primary">Community</span>.<br />
                        Experience the <span className="text-secondary">Extraordinary</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        Join local groups, attend exclusive events, and connect with people who share your passions.
                    </p>

                    <div className="flex justify-center mb-12">
                        <Suspense fallback={<div className="w-full max-w-2xl h-12 bg-muted/50 rounded-full animate-pulse" />}>
                            <SearchBar />
                        </Suspense>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((cat) => (
                            <CategoryBadge key={cat} category={cat} className="text-sm px-4 py-2 cursor-pointer" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-muted/30 border-y">
                <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="bg-primary/10 p-3 rounded-full mb-4">
                            <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">500+</h3>
                        <p className="text-muted-foreground">Events Weekly</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-secondary/10 p-3 rounded-full mb-4">
                            <Users className="h-6 w-6 text-secondary" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">50k+</h3>
                        <p className="text-muted-foreground">Active Members</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-accent p-3 rounded-full mb-4">
                            <Trophy className="h-6 w-6 text-foreground" />
                        </div>
                        <h3 className="text-3xl font-bold mb-1">1000+</h3>
                        <p className="text-muted-foreground">Communities</p>
                    </div>
                </div>
            </section>

            {/* Featured Events */}
            <section className="py-20">
                <div className="container">
                    <SectionHeader
                        title="Trending Events"
                        description="Don't miss out on the most popular events happening near you."
                        actionLabel="View all events"
                        actionHref="/search?type=events"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredEvents.map((event) => (
                            <EventCard key={event.id} {...event} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Communities */}
            <section className="py-20 bg-muted/30">
                <div className="container">
                    <SectionHeader
                        title="Popular Communities"
                        description="Find your tribe and connect with like-minded people."
                        actionLabel="View all communities"
                        actionHref="/search?type=communities"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredCommunities.map((community) => (
                            <CommunityCard key={community.id} {...community} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="container">
                    <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-center text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Create Your Own Community</h2>
                            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                                Have a passion to share? Start your own community, host events, and grow your audience with our powerful tools.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link href="/organizer">
                                    <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold">
                                        Become an Organizer
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10 hover:text-white">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Decorative circles */}
                        <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
                    </div>
                </div>
            </section>
        </div>
    )
}
