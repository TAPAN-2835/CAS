"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AdminPaymentsPage() {
    // Mock data
    const payments = [
        { id: 'pay_123', amount: 49.00, type: 'Ticket', user: 'john@example.com', status: 'completed', date: '2024-05-01' },
        { id: 'pay_124', amount: 15.00, type: 'Listing Fee', user: 'org@example.com', status: 'completed', date: '2024-05-02' },
        { id: 'pay_125', amount: 25.00, type: 'Ticket', user: 'jane@example.com', status: 'failed', date: '2024-05-02' },
    ]

    return (
        <div className="container py-12">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Payments Overview</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>View all payment activities.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {payments.map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm">{payment.id}</span>
                                        <Badge variant={payment.status === 'completed' ? 'default' : 'destructive'}>
                                            {payment.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{payment.type} • {payment.user}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold">${payment.amount.toFixed(2)}</div>
                                    <div className="text-xs text-muted-foreground">{payment.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
