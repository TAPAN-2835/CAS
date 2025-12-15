'use server'

import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

export async function joinEvent(eventId: string, userId: string) {
    if (!eventId || !userId) {
        return { success: false, message: "Missing required fields" };
    }

    logger.info("Attempting to join event", { eventId, userId });

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        // 1. Check if event exists and is approved
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('id, title, capacity, attendees, status')
            .eq('id', eventId)
            .single();

        if (eventError || !event) {
            logger.error("Join failed: Event not found or fetch error", eventError, { eventId });
            return { success: false, message: "Event not found" };
        }

        if (event.status !== 'approved') {
            logger.warn("Join failed: Event not approved", { eventId, status: event.status });
            return { success: false, message: "Cannot join unapproved event" };
        }

        // 2. Check Capacity
        if (event.attendees >= event.capacity) {
            logger.warn("Join failed: Event full", { eventId });
            return { success: false, message: "Event is full" };
        }

        // 3. Check if already joined
        const { data: existingTicket } = await supabase
            .from('tickets')
            .select('id')
            .eq('event_id', eventId)
            .eq('user_id', userId)
            .single();

        if (existingTicket) {
            logger.info("User already joined", { eventId, userId });
            return { success: true, message: "Already joined", alreadyJoined: true };
        }

        // 4. Create Ticket (Optimistic - assuming free event for this action flow, 
        // payments handled via webhook mostly, but this is for 'RSVP/Join')
        const { error: ticketError } = await supabase
            .from('tickets')
            .insert({
                event_id: eventId,
                user_id: userId,
                status: 'valid'
            });

        if (ticketError) {
            logger.error("Ticket creation failed", ticketError, { eventId, userId });
            return { success: false, message: "Failed to join event" };
        }

        // 5. Update attendees count (Atomic increment better but doing read-write for now or RPC)
        await supabase.rpc('increment_attendees', { event_id: eventId });
        // NOTE: Need to ensure this RPC exists or use update provided below:
        /*
        await supabase
            .from('events')
            .update({ attendees: event.attendees + 1 })
            .eq('id', eventId)
        */

        logger.action("join_event_success", userId, { eventId, eventTitle: event.title });
        return { success: true, message: "Successfully joined!" };

    } catch (err) {
        logger.error("Unexpected error in joinEvent", err, { eventId, userId });
        return { success: false, message: "Internal server error" };
    }
}
