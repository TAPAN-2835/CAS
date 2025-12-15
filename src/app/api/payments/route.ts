import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { DUMMY_PAYMENT_MODE } from '@/lib/constants'

export async function POST(request: Request) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const body = await request.json()
        const { amount, currency = 'INR', type, organizerId, userId, eventId } = body

        // ==========================================
        // DUMMY MODE: IDEMPOTENT IMMEDIATE SUCCESS
        // ==========================================
        if (DUMMY_PAYMENT_MODE) {
            console.log('💰 [DUMMY MODE] Processing Payment:', { amount, type, userId })

            // 1. Create Mock Payment Record
            const dummyPaymentId = `dummy_pay_${Date.now()}`
            const dummyOrderId = `dummy_order_${Date.now()}`

            const { data: payment, error: payError } = await supabase
                .from('payments')
                .insert({
                    organizer_id: organizerId,
                    amount,
                    type,
                    status: 'completed', // Immediately completed
                    method: 'dummy',
                    razorpay_payment_id: dummyOrderId,
                })
                .select()
                .single()

            if (payError) {
                return NextResponse.json({ error: payError.message }, { status: 500 })
            }

            // 2. Perform Side Effects (Simulate Webhook)
            if (type === 'ticket_purchase' && userId && eventId) {
                // Check if ticket exists (Idempotency)
                const { data: existingTicket } = await supabase
                    .from('tickets')
                    .select('id')
                    .eq('user_id', userId)
                    .eq('event_id', eventId)
                    .single()

                if (!existingTicket) {
                    await supabase.from('tickets').insert({
                        user_id: userId,
                        event_id: eventId,
                        payment_id: payment.id,
                        status: 'valid'
                    })

                    // Increment attendees
                    await supabase.rpc('increment_attendees', { event_id: eventId })
                }
            }

            // Return success payload structure expected by client
            return NextResponse.json({
                orderId: dummyOrderId,
                amount: amount * 100,
                currency,
                paymentId: payment.id,
                dummySuccess: true // Signal to client
            })
        }

        // ==========================================
        // REAL RAZORPAY FLOW (Bypassed)
        // ==========================================

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        })

        // Create Razorpay Order
        const order = await razorpay.orders.create({
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt: `receipt_${Date.now()}`,
        })

        // Store initial payment record
        const { data: payment, error } = await supabase
            .from('payments')
            .insert({
                organizer_id: organizerId,
                amount,
                type,
                status: 'pending',
                method: 'razorpay',
                razorpay_payment_id: order.id, // Storing order ID initially
            })
            .select()
            .single()

        if (error) {
            console.error('Payment insert error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            paymentId: payment.id, // Internal payment ID
        })
    } catch (error) {
        console.error('Razorpay error:', error)
        return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 })
    }
}
