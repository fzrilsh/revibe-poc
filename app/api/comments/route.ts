import { NextResponse } from 'next/server'
import { createComment, listComments } from '@/features/post/comment.repository'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function GET(req: Request) {
    const url = new URL(req.url)
    const targetType = url.searchParams.get('target_type')
    const targetId = Number(url.searchParams.get('target_id') ?? '0')
    if (!targetType || !targetId) return NextResponse.json({ error: 'target_type and target_id required' }, { status: 400 })
    const comments = await listComments(targetType, targetId)
    return NextResponse.json({ data: { comments } })
}

export async function POST(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    const body = await req.json()
    const targetType = body.target_type ?? body.targetType
    const targetId = Number(body.target_id ?? body.targetId)
    const content = body.content
    if (!targetType || !targetId || !content) return NextResponse.json({ error: 'target_type, target_id and content required' }, { status: 400 })
    const comment = await createComment(user.id, targetType, targetId, content)
    return NextResponse.json({ data: { comment } }, { status: 201 })
}
