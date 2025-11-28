import { NextResponse } from 'next/server'
import { toggleLike, countLikes, userLiked } from '@/features/post/like.repository'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function POST(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json()
    const targetType = body.target_type ?? body.targetType
    const targetId = Number(body.target_id ?? body.targetId)

    if (!targetType || !targetId) return NextResponse.json({ error: 'target_type and target_id required' }, { status: 400 })
    const result = await toggleLike(user.id, targetType, targetId)
    const total = await countLikes(targetType, targetId)

    return NextResponse.json({
        status: 'success',
        message: targetType + ' liked successfully',
        data: { liked: result.liked, total },
    })
}

export async function GET(req: Request) {
    const url = new URL(req.url)
    const targetType = url.searchParams.get('target_type')
    const targetId = Number(url.searchParams.get('target_id') ?? '0')
    if (!targetType || !targetId) return NextResponse.json({ error: 'target_type and target_id required' }, { status: 400 })

    let liked = false
    const total = await countLikes(targetType, targetId)
    const user = await getCurrentUserFromRequest(req)

    if (user) liked = await userLiked(user.id, targetType, targetId)
    return NextResponse.json({
        status: 'success',
        message: targetType + ' liked successfully',
        data: { total, liked },
    })
}
