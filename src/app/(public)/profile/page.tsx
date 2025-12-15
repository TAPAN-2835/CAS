"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUserStore } from '@/store/userStore'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function ProfilePage() {
    const { user, loading } = useUserStore()
    const [isEditing, setIsEditing] = useState(false)

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
                <Button>Log In</Button>
            </div>
        )
    }

    return (
        <div className="container py-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-6">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={user.user_metadata?.avatar_url} />
                                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold">{user.user_metadata?.full_name || 'User'}</h2>
                            <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
                            <Button variant="outline" className="w-full" onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <Tabs defaultValue="tickets" className="w-full">
                        <TabsList className="mb-8">
                            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
                            <TabsTrigger value="communities">My Communities</TabsTrigger>
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                        </TabsList>

                        <TabsContent value="tickets">
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Tickets</CardTitle>
                                    <CardDescription>View and manage your upcoming event tickets.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-muted-foreground">
                                        No tickets found.
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="communities">
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Communities</CardTitle>
                                    <CardDescription>Communities you have joined.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-muted-foreground">
                                        You haven't joined any communities yet.
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Settings</CardTitle>
                                    <CardDescription>Update your personal information.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" defaultValue={user.user_metadata?.full_name} disabled={!isEditing} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" defaultValue={user.email} disabled />
                                    </div>
                                    {isEditing && (
                                        <Button className="mt-4">Save Changes</Button>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
