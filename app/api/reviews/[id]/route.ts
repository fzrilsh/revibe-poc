import { NextResponse } from 'next/server'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'
import prisma from '@/lib/prisma'
import { createSupabaseClient } from '@/lib/config'
import { findItemById } from '@/features/items/item.repository'

export async function DELETE(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ status: 'error', message: 'Not authenticated' }, { status: 401 })

    const id = Number(req.url.split('/').pop())
    if (!id || Number.isNaN(id)) return NextResponse.json({ status: 'error', message: 'invalid id' }, { status: 400 })

    const prismaReview = (prisma as any).review
    if (prismaReview && typeof prismaReview.findUnique === 'function') {
        const r = await prismaReview.findUnique({ where: { id } })
        if (!r) return NextResponse.json({ status: 'error', message: 'Not found' }, { status: 404 })
        const item = await findItemById(r.itemId ?? (r as any).item_id)
        if (!item) return NextResponse.json({ status: 'error', message: 'Item not found' }, { status: 404 })
        const ownerId = item.userId ?? (item as any).user_id
        if (ownerId !== user.id) return NextResponse.json({ status: 'error', message: 'Not allowed' }, { status: 403 })
        const deleted = await prismaReview.delete({ where: { id } })
        return NextResponse.json({ status: 'success', message: 'Review deleted', data: { review: deleted } })
    }

    const supabase = createSupabaseClient()
    const { data: rows } = await supabase.from('reviews').select('*').eq('id', id).limit(1)
    if (!rows || (rows as any).length === 0) return NextResponse.json({ status: 'error', message: 'Not found' }, { status: 404 })
    const r = (rows as any)[0]
    const item = await findItemById(r.item_id)
    if (!item) return NextResponse.json({ status: 'error', message: 'Item not found' }, { status: 404 })
    const ownerId = item.userId ?? (item as any).user_id
    if (ownerId !== user.id) return NextResponse.json({ status: 'error', message: 'Not allowed' }, { status: 403 })
    const { data: deleted, error } = await supabase.from('reviews').delete().eq('id', id).select('*').single()
    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
    return NextResponse.json({ status: 'success', message: 'Review deleted', data: { review: deleted } })
}
