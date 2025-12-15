import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all'
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'relevance'

    const results: any = {
        events: [],
        communities: [],
    }

    if (type === 'all' || type === 'events') {
        let query = supabase
            .from('events')
            .select('*, organizers(org_name)')
            .eq('status', 'approved') // Enforce Approved

        if (q) {
            query = query.ilike('title', `%${q}%`)
        }

        if (category && category !== 'all') {
            query = query.eq('category', category)
        }

        // RANKING / SORTING
        if (sort === 'popular') {
            // If we had ticket counts or views, we'd use them.
            // Using views (added in migration)
            query = query.order('views', { ascending: false })
        } else if (sort === 'newest') {
            query = query.order('created_at', { ascending: false })
        } else if (sort === 'upcoming') {
            query = query.order('date', { ascending: true })
        } else {
            // Default ranking: 1. Featured (if column exists) 2. Date 
            // For now, Date ascending (find upcoming events)
            query = query.order('date', { ascending: true })
        }

        const { data: events } = await query.limit(20)
        results.events = events || []
    }

    if (type === 'all' || type === 'communities') {
        let query = supabase
            .from('communities')
            .select('*')
            .eq('status', 'approved') // Enforce Approved

        if (q) {
            query = query.ilike('name', `%${q}%`)
        }

        if (category && category !== 'all') {
            query = query.eq('category', category)
        }

        if (sort === 'popular') {
            query = query.order('members_count', { ascending: false })
        } else {
            query = query.order('created_at', { ascending: false })
        }

        const { data: communities } = await query.limit(20)
        results.communities = communities || []
    }

    return NextResponse.json(results)
}
