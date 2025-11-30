import { NextResponse } from 'next/server'
import { toggleLike, countLikes, userLiked } from '@/features/post/like.repository'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'
import { isSupportedTargetType } from '@/lib/polymorph'

export async function POST(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json()
    const targetType = body.target_type ?? body.targetType
    const targetId = Number(body.target_id ?? body.targetId)

    if (!isSupportedTargetType(targetType)) return NextResponse.json({ error: `unsupported target_type: ${targetType}` }, { status: 400 })

    if (!targetType || !targetId) return NextResponse.json({ error: 'target_type and target_id required' }, { status: 400 })
    const result = await toggleLike(user.id, targetType, targetId)
    const total = await countLikes(targetType, targetId)

    return NextResponse.json({
        status: 'success',
        message: targetType + ' liked successfully',
        data: { liked: result.liked, total },
    })
}

