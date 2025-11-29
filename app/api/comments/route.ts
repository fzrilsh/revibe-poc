import { NextResponse } from 'next/server'
import { createComment, listComments } from '@/features/post/comment.repository'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'
import { buildPublicUser } from '@/features/auth/buildPublicUser'

export async function GET(req: Request) {
    const url = new URL(req.url)
    const targetType = url.searchParams.get('target_type')
    const targetId = Number(url.searchParams.get('target_id') ?? '0')
    if (!targetType || !targetId) return NextResponse.json({ error: 'target_type and target_id required' }, { status: 400 })
    const comments = await listComments(targetType, targetId)
    const transformed = comments.map((c: any) => ({
        id: c.id,
        content: c.content,
        created_at: c.createdAt?.toISOString?.() ?? new Date().toISOString(),
        user: c.user ? buildPublicUser(c.user) : null,
    }))
    return NextResponse.json({ data: { comments: transformed } })
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
    const transformed = {
        id: comment.id,
        content: comment.content,
        created_at: (comment as any).createdAt?.toISOString?.() ?? new Date().toISOString(),
        user: (comment as any).user ? buildPublicUser((comment as any).user) : null,
    }
    return NextResponse.json({ data: { comment: transformed } }, { status: 201 })
}
