import { create } from 'zustand'

interface OrganizerState {
    events: any[] // Replace with proper type
    communities: any[] // Replace with proper type
    loading: boolean
    setEvents: (events: any[]) => void
    setCommunities: (communities: any[]) => void
    setLoading: (loading: boolean) => void
}

export const useOrganizerStore = create<OrganizerState>((set) => ({
    events: [],
    communities: [],
    loading: false,
    setEvents: (events) => set({ events }),
    setCommunities: (communities) => set({ communities }),
    setLoading: (loading) => set({ loading }),
}))
