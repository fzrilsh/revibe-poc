import { buildPublicUrl, POST_BUCKET } from '@/lib/config'

export function buildPublicPost(post: any) {
    if (!post) return null
    return {
        id: post.id,
        content: post.content ?? null,
        image_url: buildPublicUrl(post.imageUrl ?? (post as any).image_url ?? null, POST_BUCKET),
        created_at: post.createdAt?.toISOString?.() ?? (post as any).created_at ?? new Date().toISOString(),
        likes_count: (post as any)._likesCount ?? (post as any).likes_count ?? 0,
    }
}

export function buildPublicPosts(posts: any[]) {
    return posts.map(p => buildPublicPost(p))
}
