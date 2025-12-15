import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(body)
        .digest('hex')

    if (signature !== expectedSignature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const eventId = event.event_id // Razorpay Event ID for Idempotency

    // Check if we already processed this webhook event
    // Ideally we should have a `webhook_logs` table, but for now we'll check if payment status is already completed
    // and if tickets exist if it's a payment.captured event.

    if (event.event === 'payment.captured') {
        const paymentPayload = event.payload.payment.entity
        const orderId = paymentPayload.order_id

        // IDEMPOTENCY CHECK 1: Is payment already completed?
        const { data: existingPayment } = await supabase
            .from('payments')
            .select('*')
            .eq('razorpay_payment_id', paymentPayload.id)
            .single()

        if (existingPayment && existingPayment.status === 'completed') {
            return NextResponse.json({ status: 'ignored', message: 'Payment already processed' })
        }

        // Update payment status
        // We match by order_id because that's what we stored when initiating payment
        const { data: paymentRecord, error } = await supabase
            .from('payments')
            .update({
                status: 'completed',
                razorpay_payment_id: paymentPayload.id,
                method: paymentPayload.method,
            })
            .eq('razorpay_payment_id', orderId) // If using order_id as key initially
            .select()
            .single()

        if (error) {
            console.error('Error updating payment:', error)
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
        }

        if (!paymentRecord) {
            // Case: Payment arrived but we don't have a record? Maybe created directly on Razorpay?
            // Log error
            return NextResponse.json({ error: 'Payment record not found' }, { status: 404 })
        }

        // If ticket purchase, create ticket
        if (paymentRecord.type === 'ticket_purchase') {
            // IDEMPOTENCY CHECK 2: Do we already have a ticket for this payment?
            const { data: existingTicket } = await supabase
                .from('tickets')
                .select('id')
                .eq('payment_id', paymentRecord.id)
                .single()

            if (!existingTicket) {
                // Create Ticket
                // We assume paymentRecord stores metadata about user_id and event_id? 
                // Or we fetch it from a metadata column if we added one. 
                // Assuming `organizer_id` was repurposed or we need to look up the 'intent'.
                // For MVP, let's assume the payment record has these or we can't create it reliably without them.
                // Since schema has `organizer_id` in payments, but not `user_id`, we might have a gap here unless we added `user_id` to payments.
                // Recommendation: Add `user_id` and `event_id` to payments table in future.

                // For now, attempting to proceed if we had the info. 
                // If we can't create ticket here, the client success callback must do it (less secure).
                // Let's stub the creation logic assuming we can derive data.
                console.log(`Payment captured for ${paymentRecord.id}. Ticket creation logic pending metadata availability.`)
            }
        }

        // If listing fee, mark organizer/community as verified/paid
        if (paymentRecord.type === 'listing_fee') {
            // Logic: Approve event or Community
            // const { data } = await supabase.from('communities').update({ status: 'approved' }).eq('organizer_id', paymentRecord.organizer_id)
        }
    }

    // Handle payment failed
    if (event.event === 'payment.failed') {
        const paymentPayload = event.payload.payment.entity
        await supabase
            .from('payments')
            .update({
                status: 'failed',
                razorpay_payment_id: paymentPayload.id
            })
            .eq('razorpay_payment_id', paymentPayload.order_id)
    }

    return NextResponse.json({ status: 'ok' })
}
