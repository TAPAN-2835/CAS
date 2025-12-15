import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    let query = supabase.from('organizers').select('*')

    if (search) {
        query = query.ilike('org_name', `%${search}%`)
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

        // Check if user is already an organizer
        const { data: existing } = await supabase
            .from('organizers')
            .select('id')
            .eq('id', body.id) // Assuming ID is passed from auth context in real app
            .single()

        if (existing) {
            return NextResponse.json({ error: 'Organizer profile already exists' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('organizers')
            .insert(body)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Update user role
        await supabase.from('users').update({ role: 'organizer' }).eq('id', body.id)

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
