import { supabase } from './supabase'

export const OrganizersService = {
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('organizers')
            .select('*')
            .eq('id', userId)
            .single()

        if (error) throw error
        return data
    },

    async createProfile(profile: any) {
        const { data, error } = await supabase
            .from('organizers')
            .insert(profile)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async updateProfile(userId: string, updates: any) {
        const { data, error } = await supabase
            .from('organizers')
            .update(updates)
            .eq('id', userId)
            .select()
            .single()

        if (error) throw error
        return data
    }
}
