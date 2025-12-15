import { supabase } from './supabase'

export const CommunitiesService = {
    async getAll(params: any = {}) {
        let query = supabase.from('communities').select('*, organizers(org_name, logo_url)')

        if (params.category && params.category !== 'all') {
            query = query.eq('category', params.category)
        }

        if (params.search) {
            query = query.ilike('name', `%${params.search}%`)
        }

        const { data, error } = await query
        if (error) throw error
        return data
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('communities')
            .select('*, organizers(*)')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    async create(community: any) {
        const { data, error } = await supabase
            .from('communities')
            .insert(community)
            .select()
            .single()

        if (error) throw error
        return data
    }
}
