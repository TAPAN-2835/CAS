import { makePayment } from '@/lib/razorpay'
import { supabase } from './supabase'

export const PaymentsService = {
    async initiatePayment(amount: number, organizerId: string, type: 'listing_fee' | 'ticket_purchase', metadata: any = {}) {
        return makePayment(amount, organizerId, type, metadata)
    },

    async getHistory() {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    async getTicketStatus(ticketId: string) {
        const { data, error } = await supabase
            .from('tickets')
            .select('*, events(*)')
            .eq('id', ticketId)
            .single()

        if (error) throw error
        return data
    }
}
