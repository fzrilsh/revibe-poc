import { NextResponse } from 'next/server'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'
import { findItemById } from '@/features/items/item.repository'
import { createSupabaseClient } from '@/lib/config'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ status: 'error', message: 'Not authenticated' }, { status: 401 })

    let body: any
    try {
        body = await req.json()
    } catch (err) {
        return NextResponse.json({ status: 'error', message: 'Invalid JSON' }, { status: 400 })
    }

    const itemId = Number(body.item_id ?? body.itemId)
    const rating = Number(body.rating)
    const repurchase = body.repurchase === undefined ? null : Boolean(body.repurchase)
    const usagePeriod = body.usage_period ?? body.usagePeriod ?? null
    const content = body.content ?? null

    if (!itemId || Number.isNaN(itemId)) return NextResponse.json({ status: 'error', message: 'item_id is required' }, { status: 400 })
    if (!Number.isInteger(rating)) return NextResponse.json({ status: 'error', message: 'rating must be integer' }, { status: 400 })

    // ensure item exists and belongs to user
    const item = await findItemById(itemId)
    if (!item) return NextResponse.json({ status: 'error', message: 'Item not found' }, { status: 404 })
    const ownerId = item.userId ?? (item as any).user_id
    if (ownerId !== user.id) return NextResponse.json({ status: 'error', message: 'Not allowed: you must own the item to add a review' }, { status: 403 })

    // Try Prisma first, fallback to Supabase if review model/table missing
    const prismaReview = (prisma as any).review
    if (prismaReview && typeof prismaReview.create === 'function') {
        const created = await prismaReview.create({ data: { itemId, rating, repurchase, usagePeriod, content } })
        return NextResponse.json({ status: 'success', message: 'Review created', data: { review: created } }, { status: 201 })
    }

    const supabase = createSupabaseClient()
    const payload: any = { item_id: itemId, rating, repurchase, usage_period: usagePeriod, content }
    const { data: inserted, error } = await supabase.from('reviews').insert([payload]).select('*').single()
    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
    return NextResponse.json({ status: 'success', message: 'Review created', data: { review: inserted } }, { status: 201 })
}
