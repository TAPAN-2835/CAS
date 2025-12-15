import { create } from 'zustand'

interface SearchState {
    query: string
    filters: Record<string, string>
    results: any[] // Replace with proper type
    loading: boolean
    setQuery: (query: string) => void
    setFilters: (filters: Record<string, string>) => void
    setResults: (results: any[]) => void
    setLoading: (loading: boolean) => void
}

export const useSearchStore = create<SearchState>((set) => ({
    query: '',
    filters: {},
    results: [],
    loading: false,
    setQuery: (query) => set({ query }),
    setFilters: (filters) => set({ filters }),
    setResults: (results) => set({ results }),
    setLoading: (loading) => set({ loading }),
}))
