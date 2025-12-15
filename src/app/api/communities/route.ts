import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const organizerId = searchParams.get('organizerId')

    let query = supabase.from('communities').select('*, organizers(org_name, logo_url)')

    // 1. APPROVAL LOGIC
    if (organizerId) {
        query = query.eq('organizer_id', organizerId)
    } else {
        query = query.eq('status', 'approved')
    }

    if (category && category !== 'all') {
        query = query.eq('category', category)
    }

    if (search) {
        query = query.ilike('name', `%${search}%`)
    }

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

        const communityData = {
            ...body,
            status: 'pending' // Communities default to pending
        }

        const { data, error } = await supabase
            .from('communities')
            .insert(communityData)
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
