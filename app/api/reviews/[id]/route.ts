import { NextResponse } from 'next/server'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'
import prisma from '@/lib/prisma'
import { createSupabaseClient } from '@/lib/config'
import { findItemById } from '@/features/items/item.repository'

function mapReviewToSnakeWithCreator(r: any, creator?: any, likeCount = 0, commentCount = 0, comments: any[] = []) {
    if (!r) return null
    return {
        id: r.id,
        item_id: r.itemId ?? r.item_id,
        rating: r.rating,
        repurchase: r.repurchase ?? (r as any).repurchase ?? null,
        usage_period: r.usagePeriod ?? (r as any).usage_period ?? null,
        content: r.content ?? null,
        created_at: r.createdAt?.toISOString?.() ?? (r as any).created_at ?? null,
        like_count: likeCount ?? 0,
        comment_count: commentCount ?? 0,
        comments: comments ?? [],
        user: creator ? {
            username: creator.nickname ?? creator.username ?? null,
            image_url: creator.profileImage ?? (creator as any).profile_image ?? null,
        } : null,
    }
}

export async function GET(req: Request) {
    const id = Number(req.url.split('/').pop())
    if (!id || Number.isNaN(id)) return NextResponse.json({ status: 'error', message: 'invalid id' }, { status: 400 })

    const prismaReview = (prisma as any).review
    if (prismaReview && typeof prismaReview.findUnique === 'function') {
        const r = await prismaReview.findUnique({ where: { id }, include: { item: { include: { user: true } } } })
        if (!r) return NextResponse.json({ status: 'error', message: 'Not found' }, { status: 404 })
        const creator = r?.item?.user ?? null

        // counts
        const likeCount = await (prisma as any).like.count({ where: { targetType: 'review', targetId: id } }).catch(() => 0)
        const commentRows = await (prisma as any).comment.findMany({ where: { targetType: 'review', targetId: id }, orderBy: { createdAt: 'desc' }, include: { user: true } }).catch(() => [])
        const commentCount = (commentRows ?? []).length

        const comments = (commentRows ?? []).map((c: any) => ({
            id: c.id,
            content: c.content,
            created_at: c.createdAt?.toISOString?.() ?? c.created_at ?? null,
            user: c.user ? { username: c.user.nickname ?? c.user.username ?? null, image_url: c.user.profileImage ?? c.user.profile_image ?? null } : null,
        }))

        return NextResponse.json({ status: 'success', message: 'Review retrieved', data: { review: mapReviewToSnakeWithCreator(r, creator, likeCount, commentCount, comments) } })
    }

    const supabase = createSupabaseClient()
    const { data: rows, error } = await supabase.from('reviews').select('*').eq('id', id).limit(1)
    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
    if (!rows || (rows as any).length === 0) return NextResponse.json({ status: 'error', message: 'Not found' }, { status: 404 })
    const r = (rows as any)[0]

    // find item->owner and user
        const { data: items } = await supabase.from('items').select('id, user_id').eq('id', r.item_id).limit(1);
    const item = (items ?? [])[0] ?? null
    let creator: any = null
    if (item && item.user_id) {
            const { data: users } = await supabase.from('users').select('id, nickname, profile_image').eq('id', item.user_id).limit(1);
        creator = (users ?? [])[0] ?? null
    }

    // likes count via supabase
        const { data: likes } = await supabase.from('likes').select('id').eq('target_type', 'review').eq('target_id', id);
    const likeCount = (likes ?? []).length

    // comments via supabase
        const { data: commentsRows } = await supabase.from('comments').select('*').eq('target_type', 'review').eq('target_id', id).order('created_at', { ascending: false });
    const commentsList = commentsRows ?? []
    let comments: any[] = []
    if (commentsList.length) {
        const userIds = Array.from(new Set(commentsList.map((c: any) => c.user_id).filter(Boolean)))
            const { data: users } = await supabase.from('users').select('id, nickname, profile_image').in('id', userIds);
        const usersById: Record<string, any> = {};
        (users ?? []).forEach((u: any) => { usersById[u.id] = u })
        comments = commentsList.map((c: any) => ({ id: c.id, content: c.content, created_at: c.created_at ?? (c.createdAt?.toISOString?.() ?? null), user: usersById[c.user_id] ? { username: usersById[c.user_id].nickname ?? usersById[c.user_id].username ?? null, image_url: usersById[c.user_id].profile_image ?? usersById[c.user_id].profileImage ?? null } : null }))
    }

    const commentCount = comments.length

    return NextResponse.json({ status: 'success', message: 'Review retrieved', data: { review: mapReviewToSnakeWithCreator(r, creator, likeCount, commentCount, comments) } })
}

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
