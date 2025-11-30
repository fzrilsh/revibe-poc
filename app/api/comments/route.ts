import { NextResponse } from 'next/server'
import { createComment } from '@/features/post/comment.repository'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function POST(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json()
    const targetType = body.target_type ?? body.targetType
    const targetId = Number(body.target_id ?? body.targetId)
    const content = body.content

    if (!targetType || !targetId || !content) return NextResponse.json({ error: 'target_type, target_id and content required' }, { status: 400 })
    const comment = await createComment(user.id, targetType, targetId, content)

    return NextResponse.json({
        status: 'success',
        message: 'Comment posted successfully',
        data: { comment: { id: comment?.id ?? null, content: comment?.content ?? content } }
    }, { status: 201 })
}
