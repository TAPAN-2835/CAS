export const SearchService = {
    async search(query: string, type: 'all' | 'events' | 'communities' = 'all') {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${type}`)
        if (!res.ok) throw new Error('Search failed')
        return res.json()
    }
}
