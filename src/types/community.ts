export type CommunityStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface Community {
    id: string
    organizer_id: string
    name: string
    description: string
    category: string
    cover_image?: string
    location: string
    members_count: number
    created_at: string
    status: CommunityStatus
    rejection_reason?: string
}
