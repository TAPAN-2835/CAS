import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(request: Request) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        })

        const body = await request.json()
        const { amount, currency = 'INR', type, organizerId, userId, eventId } = body

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
