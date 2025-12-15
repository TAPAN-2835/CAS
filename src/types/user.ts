export interface User {
    id: string
    name: string
    email: string
    phone?: string
    role: 'user' | 'organizer' | 'admin'
    interests?: string[]
    created_at: string
}

export interface Organizer {
    id: string
    org_name: string
    bio?: string
    verified: boolean
    phone?: string
    logo_url?: string
    created_at: string
}
