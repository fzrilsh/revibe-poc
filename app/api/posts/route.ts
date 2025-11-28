import { NextResponse } from 'next/server'
import { createPost, listPosts } from '@/features/post/post.repo'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'
import { createSupabaseClient, POST_BUCKET, buildPublicUrl } from '@/lib/config'
import { buildPublicPost, buildPublicPosts } from '@/features/post/buildPublicPost'

export async function GET(req: Request) {
    const url = new URL(req.url)
    const take = Number(url.searchParams.get('take') ?? '20')
    const skip = Number(url.searchParams.get('skip') ?? '0')
    const posts = await listPosts(take, skip)
    return NextResponse.json({
        status: 'success',
        message: 'Posts retrieved successfully',
        data: { posts: buildPublicPosts(posts) },
    })
}

export async function POST(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const contentType = req.headers.get('content-type') || ''

    // If multipart/form-data, accept `image` file upload
    if (contentType.startsWith('multipart/form-data')) {
        const form = await req.formData()
        const content = (form.get('content') as string) ?? null
        const file = form.get('image') as File | null

        let imagePath: string | null = null
        if (file && file.size > 0) {
            const supabase = createSupabaseClient()
            const filename = file.name || `post-${Date.now()}`
            const buffer = Buffer.from(await file.arrayBuffer())
            const path = `${Date.now()}_${filename}`

            const { error } = await supabase.storage.from(POST_BUCKET).upload(path, buffer, {
                contentType: file.type || 'application/octet-stream',
                upsert: false,
            })

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            imagePath = path
        }

        const post = await createPost(user.id, { content, imageUrl: imagePath })
        return NextResponse.json({
            status: 'success',
            message: 'Post created successfully',
            data: { post: buildPublicPost(post) },
        }, { status: 201 })
    }

    // fallback: accept JSON
    let body: any
    try {
        body = await req.json()
    } catch (err: any) {
        const raw = await req.text().catch(() => null)
        return NextResponse.json({ error: 'Invalid JSON body', details: err?.message ?? String(err), raw }, { status: 400 })
    }

    const content = body?.content ?? null
    const imageUrl = body?.image_url ?? body?.imageUrl ?? null

    const post = await createPost(user.id, { content, imageUrl })
    return NextResponse.json({
        status: 'success',
        message: 'Post created successfully',
        data: { post: buildPublicPost(post) },
    }, { status: 201 })
}
