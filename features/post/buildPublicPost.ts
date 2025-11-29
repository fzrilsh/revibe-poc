import { buildPublicUrl, POST_BUCKET } from '@/lib/config'
import { buildPublicUser } from '@/features/auth/buildPublicUser'

type RawPost = {
    id: number
    content?: string | null
    imageUrl?: string | null
    createdAt?: Date
    // extended fields attached in repo/route
    image_url?: string | null
    created_at?: string
    _likesCount?: number
    likes_count?: number
    _commentsCount?: number
    comments_count?: number
    _author?: {
        id: string
        nickname?: string | null
        profileImage?: string | null
        skinType?: string | null
        createdAt?: Date
        profile_image?: string | null
        skin_type?: string | null
        created_at?: string
    } | null
    _liked?: boolean
}

export function buildPublicPost(post: RawPost | null) {
    if (!post) return null
    const imageUrl = post.imageUrl ?? post.image_url ?? null
    const createdAt = post.createdAt?.toISOString?.() ?? post.created_at ?? new Date().toISOString()
    const likesCount = post._likesCount ?? post.likes_count ?? 0
    const commentsCount = post._commentsCount ?? post.comments_count ?? 0
    const authorRaw = post._author ?? null
    const liked = !!post._liked

    return {
        id: post.id,
        content: post.content ?? null,
        image_url: buildPublicUrl(imageUrl, POST_BUCKET),
        created_at: createdAt,
        likes_count: likesCount,
        comments_count: commentsCount,
        author: authorRaw ? buildPublicUser(authorRaw) : undefined,
        liked,
    }
}

export function buildPublicPosts(posts: Array<RawPost>) {
    return posts.map(p => buildPublicPost(p))
}
