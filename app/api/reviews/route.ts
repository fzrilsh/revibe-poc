import { NextResponse } from 'next/server'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'
import { findItemById } from '@/features/items/item.repository'
import { buildPublicItem } from '@/features/items/buildPublicItem'
import { createSupabaseClient } from '@/lib/config'
import prisma from '@/lib/prisma'

function mapReviewToSnake(r: any, creator?: any, likeCount = 0, commentCount = 0, item?: any) {
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
        item: item ? buildPublicItem(item) : null,
        user: creator ? {
            nickname: creator.nickname ?? creator.username ?? null,
            image_url: creator.profileImage ?? (creator as any).profile_image ?? null,
        } : null,
    }
}

export async function GET(req: Request) {
    const url = new URL(req.url)
    const take = Number(url.searchParams.get('take') ?? '50')
    const skip = Number(url.searchParams.get('skip') ?? '0')
    const itemIdParam = url.searchParams.get('item_id') ?? url.searchParams.get('itemId')
    const itemId = itemIdParam ? Number(itemIdParam) : undefined

    const prismaReview = (prisma as any).review
    if (prismaReview && typeof prismaReview.findMany === 'function') {
        const where: any = {}
        if (itemId) where.itemId = itemId
        const rows = await prismaReview.findMany({ where, orderBy: { createdAt: 'desc' }, take, skip, include: { item: { include: { user: true } } } })
        const reviewIds = rows.map((r: any) => r.id)

        // batch counts for likes and comments
        const likeCountsArr = await Promise.all(reviewIds.map((rid: number) => prisma.like.count({ where: { targetType: 'review', targetId: rid } }).catch(() => 0)))
        const commentCountsArr = await Promise.all(reviewIds.map((rid: number) => prisma.comment.count({ where: { targetType: 'review', targetId: rid } }).catch(() => 0)))

        const likeById: Record<number, number> = {}
        const commentById: Record<number, number> = {}
        reviewIds.forEach((id: number, idx: number) => { likeById[id] = likeCountsArr[idx] ?? 0; commentById[id] = commentCountsArr[idx] ?? 0 })

        const out = rows.map((r: any) => {
            const creator = r?.item?.user ?? null
            return mapReviewToSnake(r, creator, likeById[r.id] ?? 0, commentById[r.id] ?? 0, r.item)
        })
        return NextResponse.json({ status: 'success', message: 'Reviews retrieved', data: { reviews: out } })
    }

    const supabase = createSupabaseClient()
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false })
    if (itemId) query = query.eq('item_id', itemId)
    const start = Number(skip)
    const end = start + Number(take) - 1
    const { data, error } = await query.range(start, end)
    if (error) return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })

    const rows = data ?? []
    // fetch items to get owner ids
    const itemIds = Array.from(new Set(rows.map((r: any) => r.item_id).filter(Boolean)))
    const { data: items } = await supabase.from('items').select('id, user_id').in('id', itemIds);
    const itemById: Record<number, any> = {};
    (items ?? []).forEach((it: any) => { itemById[it.id] = it })

    // fetch users for those items
    const ownerIds = Array.from(new Set((items ?? []).map((it: any) => it.user_id).filter(Boolean)))
    let usersById: Record<string, any> = {}
    if (ownerIds.length) {
        const { data: users } = await supabase.from('users').select('id, nickname, profile_image').in('id', ownerIds)
        usersById = {};
        (users ?? []).forEach((u: any) => { usersById[u.id] = u })
    }

    // compute like/comment counts in batch via Supabase
    const reviewIds = rows.map((r: any) => r.id)
    let likesById: Record<number, number> = {}
    if (reviewIds.length) {
        const { data: likes } = await supabase.from('likes').select('target_id').in('target_id', reviewIds).eq('target_type', 'review');
        const lmap = {} as Record<number, number>
        (likes ?? []).forEach((l: any) => { lmap[l.target_id] = (lmap[l.target_id] ?? 0) + 1 });
        likesById = lmap
    }

    let commentsById: Record<number, number> = {}
    if (reviewIds.length) {
        const { data: comments } = await supabase.from('comments').select('target_id').in('target_id', reviewIds).eq('target_type', 'review');
        const cmap = {} as Record<number, number>
        (comments ?? []).forEach((c: any) => { cmap[c.target_id] = (cmap[c.target_id] ?? 0) + 1 });
        commentsById = cmap
    }

    const out = rows.map((r: any) => {
        const item = itemById[r.item_id]
        const creator = item ? usersById[item.user_id] ?? null : null
        return mapReviewToSnake(r, creator, likesById[r.id] ?? 0, commentsById[r.id] ?? 0, item)
    })

    return NextResponse.json({ status: 'success', message: 'Reviews retrieved', data: { reviews: out } })
}

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
