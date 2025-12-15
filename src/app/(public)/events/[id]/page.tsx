import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from 'next';
import { DateTimeDisplay } from "@/components/common/DateTimeDisplay";
import { LocationChip } from "@/components/common/LocationChip";
import { PriceTag } from "@/components/common/PriceTag";
import { AddToCalendar } from "@/components/common/AddToCalendar";
import { JoinButton } from "@/components/common/JoinButton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { notFound } from "next/navigation";

// Mock data fetcher
async function getEvent(id: string) {
    // In real app, fetch from DB
    if (id === "not-found") return null;

    return {
        id: id,
        title: "Tech Startup Summit 2024",
        description: "Join us for the biggest tech startup summit of the year. Network with investors, founders, and innovators. This event features keynote speakers from top tech companies, panel discussions on the future of AI, and pitch competitions for early-stage startups.",
        startDate: new Date("2024-12-15T09:00:00"),
        endDate: new Date("2024-12-15T18:00:00"),
        location: "Innovation Hub, Downtown",
        price: 49,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000",
        category: "Tech",
        status: "APPROVED",
        organizer: {
            name: "TechHub City",
            id: "org1",
            verified: true
        },
        community: {
            name: "Tech Innovators",
            id: "comm1"
        },
        attendees: 150,
        capacity: 200
    };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event) {
        return { title: 'Event Not Found' };
    }

    return {
        title: `${event.title} | CAS`,
        description: event.description.substring(0, 160),
        openGraph: {
            title: event.title,
            description: event.description,
            images: [event.image],
        },
    };
}


export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event) {
        return notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
            '@type': 'Place',
            name: event.location,
            address: {
                '@type': 'PostalAddress',
                streetAddress: event.location,
                addressLocality: "City", // Placeholder
                addressCountry: "IN"
            }
        },
        image: [event.image],
        description: event.description,
        organizer: {
            '@type': 'Organization',
            name: event.organizer.name,
            url: `https://cas.com/communities/${event.community.id}`
        },
        offers: {
            '@type': 'Offer',
            price: event.price,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
        }
    }

    return (
        <div className="container py-8 lg:py-12 relative">
            {/* JSON-LD API */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 lg:mb-0">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="relative h-[250px] sm:h-[400px] rounded-xl overflow-hidden w-full group">
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className="text-lg py-1 px-3 shadow-md bg-background/80 text-foreground backdrop-blur-md">
                                {event.category}
                            </Badge>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{event.title}</h1>
                        <div className="flex flex-wrap gap-x-6 gap-y-3 text-muted-foreground mb-6">
                            <DateTimeDisplay date={event.startDate} />
                            <LocationChip location={event.location} />
                        </div>

                        <div className="prose max-w-none text-foreground/90">
                            <h3 className="text-xl font-semibold mb-2">About Event</h3>
                            <p className="leading-relaxed whitespace-pre-line">
                                {event.description}
                            </p>
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 bg-card shadow-sm">
                        <h3 className="font-semibold mb-4">Hosted by</h3>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                                {event.organizer.name[0]}
                            </div>
                            <div>
                                <Link href={`/communities/${event.community.id}`} className="font-medium hover:underline flex items-center gap-1">
                                    {event.community.name}
                                </Link>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    by {event.organizer.name}
                                    {event.organizer.verified && <VerifiedBadge />}
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="ml-auto">
                                View Profile
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Desktop */}
                <div className="hidden lg:block space-y-6">
                    <div className="border rounded-xl p-6 shadow-sm sticky top-24 bg-card">
                        <div className="flex justify-between items-center mb-6">
                            <PriceTag price={event.price} className="text-3xl" />
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Share2 className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Heart className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Client Component for Interactions */}
                        <JoinButton event={event} />

                        <div className="flex gap-2 mt-2 w-full">
                            <AddToCalendar
                                title={event.title}
                                description={event.description}
                                location={event.location}
                                startDate={event.startDate}
                                endDate={event.endDate}
                                className="w-full"
                            />
                        </div>

                        <p className="text-center text-sm text-muted-foreground mb-6 mt-4">
                            {event.capacity - event.attendees} spots remaining
                        </p>

                        <div className="space-y-4 pt-6 border-t">
                            <h4 className="font-semibold">Event Details</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex justify-between">
                                    <span className="text-muted-foreground">Date</span>
                                    <span className="font-medium"><DateTimeDisplay date={event.startDate} showIcon={false} showTime={false} /></span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-muted-foreground">Time</span>
                                    <span className="font-medium"><DateTimeDisplay date={event.startDate} showIcon={false} /></span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-muted-foreground">Venue</span>
                                    <span className="font-medium text-right max-w-[150px] truncate">{event.location}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:hidden z-50 flex items-center justify-between gap-4 safe-area-bottom">
                <div className="flex flex-col">
                    <PriceTag price={event.price} className="text-xl" />
                    <span className="text-xs text-muted-foreground">{event.capacity - event.attendees} left</span>
                </div>
                <div className="flex gap-2 flex-1 justify-end">
                    <JoinButton event={event} className="w-full sm:w-auto mb-0 shadow-none" />
                </div>
            </div>

        </div>
    );
}
