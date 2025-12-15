"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, CreditCard, Users, Calendar } from 'lucide-react'

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Revenue', value: '$45,231.89', icon: CreditCard, change: '+20.1% from last month' },
        { label: 'Active Users', value: '+2350', icon: Users, change: '+180.1% from last month' },
        { label: 'Events Published', value: '+12,234', icon: Calendar, change: '+19% from last month' },
        { label: 'Active Now', value: '+573', icon: Activity, change: '+201 since last hour' },
    ]

    return (
        <div className="container py-12">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Admin Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                            <p className="text-xs text-muted-foreground">
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
