import { supabase } from './supabase'

export const EventsService = {
    async getAll(params: any = {}) {
        let query = supabase.from('events').select('*, organizers(org_name, logo_url)')

        if (params.category && params.category !== 'all') {
            query = query.eq('category', params.category)
        }

        if (params.search) {
            query = query.ilike('title', `%${params.search}%`)
        }

        const { data, error } = await query
        if (error) throw error
        return data
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('events')
            .select('*, organizers(*), communities(*)')
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    },

    async create(event: any) {
        const { data, error } = await supabase
            .from('events')
            .insert(event)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async update(id: string, updates: any) {
        const { data, error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async delete(id: string) {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}
