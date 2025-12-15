import { create } from 'zustand'
import { supabase } from '@/services/supabase'
import { User } from '@supabase/supabase-js'

interface UserState {
    user: User | null
    loading: boolean
    setUser: (user: User | null) => void
    fetchUser: () => Promise<void>
    logout: () => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    fetchUser: async () => {
        set({ loading: true })
        const { data: { user } } = await supabase.auth.getUser()
        set({ user, loading: false })
    },
    logout: async () => {
        await supabase.auth.signOut()
        set({ user: null })
    },
}))
