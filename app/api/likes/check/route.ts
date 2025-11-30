import { NextResponse } from 'next/server'
import { countLikes, userLiked } from '@/features/post/like.repository'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function POST(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json()
    const targetType = body.target_type ?? body.targetType
    const targetId = Number(body.target_id ?? body.targetId)

    if (!targetType || !targetId) return NextResponse.json({ error: 'target_type and target_id required' }, { status: 400 })

    const liked = await userLiked(user.id, targetType, targetId)
    const total = await countLikes(targetType, targetId)

    return NextResponse.json({
        status: 'success',
        message: 'Like status retrieved',
        data: { liked, total },
    })
}
