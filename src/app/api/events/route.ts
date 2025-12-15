import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase client with service role for API routes
export async function GET(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const organizerId = searchParams.get('organizerId')

    let query = supabase.from('events').select('*, organizers(org_name, logo_url)')

    // 1. APPROVAL LOGIC
    // If filtering by organizer, we assume the organizer (dashboard) needs to see all statuses
    // For public feed (no organizerId), ONLY show approved.
    if (organizerId) {
        query = query.eq('organizer_id', organizerId)
    } else {
        query = query.eq('status', 'approved')
    }

    if (category && category !== 'all') {
        query = query.eq('category', category)
    }

    if (search) {
        query = query.ilike('title', `%${search}%`)
    }

    // Sort by date upcoming
    query = query.order('date', { ascending: true })

    const { data, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function POST(request: Request) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        const body = await request.json()

        // Default status is draft or pending
        // Ideally handled by DB default, but explicit here is safer if using service role
        const eventData = {
            ...body,
            status: 'draft', // Force draft on creation via API
            views: 0
        }

        const { data, error } = await supabase
            .from('events')
            .insert(eventData)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
