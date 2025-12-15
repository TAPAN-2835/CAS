"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Calendar, Users, DollarSign, MoreHorizontal, Edit, Trash } from 'lucide-react'
import Link from 'next/link'
import { useOrganizerStore } from '@/store/organizerStore'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/common/StatusBadge"
import { DateTimeDisplay } from "@/components/common/DateTimeDisplay"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function OrganizerDashboard() {
    const { events: storeEvents, communities, loading } = useOrganizerStore()

    // Enhanced Mock Data including status
    const events = [
        {
            id: '1',
            title: 'Tech Startup Summit 2024',
            date: '2024-12-15T09:00:00',
            location: 'Innovation Hub',
            status: 'APPROVED',
            attendees: 150,
            revenue: 7350
        },
        {
            id: '2',
            title: 'Music Festival Planning',
            date: '2024-12-20T18:00:00',
            location: 'City Park',
            status: 'PENDING',
            attendees: 0,
            revenue: 0
        },
        {
            id: '3',
            title: 'Community Meetup',
            date: '2024-11-10T10:00:00',
            location: 'Online',
            status: 'DRAFT',
            attendees: 0,
            revenue: 0
        },
        {
            id: '4',
            title: 'Rejected Event Demo',
            date: '2025-01-01T10:00:00',
            location: 'Unknown',
            status: 'REJECTED',
            attendees: 0,
            revenue: 0,
            rejectionReason: "Incomplete details provided."
        }
    ]

    const stats = [
        { label: 'Total Events', value: events.length.toString(), icon: Calendar },
        { label: 'Total Attendees', value: events.reduce((acc, e) => acc + e.attendees, 0).toLocaleString(), icon: Users },
        { label: 'Revenue', value: `$${events.reduce((acc, e) => acc + e.revenue, 0).toLocaleString()}`, icon: DollarSign },
    ]

    return (
        <div className="container py-8 lg:py-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Organizer Dashboard</h1>
                    <p className="text-muted-foreground">Manage your events and communities.</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <Link href="/organizer/communities/new" className="flex-1 sm:flex-initial">
                        <Button variant="outline" className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            New Community
                        </Button>
                    </Link>
                    <Link href="/organizer/events/new" className="flex-1 sm:flex-initial">
                        <Button className="w-full">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Event
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-8">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.label}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="events" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="events">My Events</TabsTrigger>
                    <TabsTrigger value="communities">My Communities</TabsTrigger>
                </TabsList>
                <TabsContent value="events" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Events</CardTitle>
                            <CardDescription>
                                Manage your upcoming and past events.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Attendees</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {events.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell className="font-medium">{event.title}</TableCell>
                                                <TableCell><DateTimeDisplay date={event.date} showIcon={false} /></TableCell>
                                                <TableCell>{event.location}</TableCell>
                                                <TableCell>
                                                    <StatusBadge status={event.status} />
                                                    {event.status === 'REJECTED' && (
                                                        <div className="text-xs text-destructive mt-1 max-w-[200px] truncate" title={event.rejectionReason}>
                                                            Reason: {event.rejectionReason}
                                                        </div>
                                                    )}
                                                    {event.status === 'PENDING' && (
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            Review in progress
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">{event.attendees}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive">
                                                                <Trash className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {events.map((event) => (
                                    <div key={event.id} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold">{event.title}</h3>
                                                <DateTimeDisplay date={event.date} className="mt-1" />
                                            </div>
                                            <StatusBadge status={event.status} />
                                        </div>

                                        <div className="text-sm text-muted-foreground">
                                            {event.location}
                                        </div>

                                        {(event.status === 'REJECTED' || event.status === 'PENDING') && (
                                            <div className="bg-muted/50 p-2 rounded text-xs">
                                                {event.status === 'REJECTED' && <span className="text-destructive font-medium">Rejected: {event.rejectionReason}</span>}
                                                {event.status === 'PENDING' && <span>Your event is currently under review by our team.</span>}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pt-2 border-t mt-2">
                                            <div className="text-sm">
                                                <span className="font-medium">{event.attendees}</span> attendees
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline">Edit</Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="communities" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Communities</CardTitle>
                            <CardDescription>
                                Manage your communities and members.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-8 text-muted-foreground">
                                No communities created yet.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
