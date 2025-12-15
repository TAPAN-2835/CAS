"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'

export default function AdminListingsPage() {
    // Mock data
    const pendingListings = [
        { id: 1, title: 'Summer Music Festival', organizer: 'City Events', type: 'Event', date: '2024-07-15' },
        { id: 2, title: 'Local Artists Collective', organizer: 'Art Hub', type: 'Community', date: '2024-06-20' },
    ]

    return (
        <div className="container py-8 lg:py-12">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Manage Listings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Pending Approvals</CardTitle>
                    <CardDescription>Review and approve new events and communities.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {pendingListings.map((listing) => (
                            <div key={listing.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold">{listing.title}</h3>
                                        <Badge variant="outline">{listing.type}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">by {listing.organizer} • Submitted on {listing.date}</p>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <Button size="sm" variant="outline" className="flex-1 md:flex-none text-destructive hover:text-destructive">
                                        <X className="h-4 w-4 mr-1" /> Reject
                                    </Button>
                                    <Button size="sm" className="flex-1 md:flex-none bg-green-600 hover:bg-green-700">
                                        <Check className="h-4 w-4 mr-1" /> Approve
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {pendingListings.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">No pending listings.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
