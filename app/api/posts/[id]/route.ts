import { NextResponse } from 'next/server'
import { findPostById, updatePost, deletePost } from '@/features/post/post.repo'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'
import { buildPublicPost } from '@/features/post/buildPublicPost'

export async function GET(req: Request) {
    const id = Number(req.url.split('/').pop())
    const post = await findPostById(id)
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: { post: buildPublicPost(post) } })
}

export async function PATCH(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    const id = Number(req.url.split('/').pop())
    const body = await req.json()
    const updated = await updatePost(id, user.id, { content: body.content ?? null, imageUrl: body.image_url ?? body.imageUrl ?? null })
    if (!updated) return NextResponse.json({ error: 'Not found or not allowed' }, { status: 404 })
    return NextResponse.json({ data: { post: buildPublicPost(updated) } })
}

export async function DELETE(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    const id = Number(req.url.split('/').pop())
    const deleted = await deletePost(id, user.id)
    if (!deleted) return NextResponse.json({ error: 'Not found or not allowed' }, { status: 404 })
    return NextResponse.json({ data: { post: buildPublicPost(deleted) } })
}
