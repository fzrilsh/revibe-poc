import { NextResponse } from 'next/server'
import { findCommentById, updateComment, deleteComment } from '@/features/post/comment.repository'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function PATCH(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    const id = Number(req.url.split('/').pop())
    const body = await req.json()
    const updated = await updateComment(id, user.id, body.content)
    if (!updated) return NextResponse.json({ error: 'Not found or not allowed' }, { status: 404 })
    return NextResponse.json({ data: { comment: updated } })
}

export async function DELETE(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    const id = Number(req.url.split('/').pop())
    const deleted = await deleteComment(id, user.id)
    if (!deleted) return NextResponse.json({ error: 'Not found or not allowed' }, { status: 404 })
    return NextResponse.json({ data: { comment: deleted } })
}
