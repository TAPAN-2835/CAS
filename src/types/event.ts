export type EventStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface Event {
    id: string
    organizer_id: string
    community_id?: string
    title: string
    description: string
    category: string
    date: string
    time: string
    price: number
    location: string
    latitude?: number
    longitude?: number
    images?: string[]
    created_at: string
    status: EventStatus
    rejection_reason?: string
    views: number
    organizers?: {
        org_name: string
        logo_url?: string
    }
}
