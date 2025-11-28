import { prisma } from '@/lib/prisma'
import { countLikes } from './like.repository'
import { createSupabaseClient } from '@/lib/config'

function isPrismaTableMissingError(err: any) {
  return err && typeof err === 'object' && err.code === 'P2021'
}

export async function createPost(userId: string, data: { content?: string | null; imageUrl?: string | null }) {
  try {
    return await prisma.post.create({
      data: {
        userId,
        content: data.content ?? null,
        imageUrl: data.imageUrl ?? null,
      },
    })
  } catch (err: any) {
    if (isPrismaTableMissingError(err)) {
      console.warn('Prisma table posts missing, createPost returning null')
      return null
    }
    throw err
  }
}

export async function findPostById(id: number) {
  try {
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return null
    const c = await countLikes('Post', post.id)
    ;(post as any)._likesCount = c
    return post
  } catch (err: any) {
    if (isPrismaTableMissingError(err)) {
      console.warn('Prisma table posts missing, findPostById returning null')
      return null
    }
    throw err
  }
}

export async function listPosts(take = 20, skip = 0) {
  try {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take, skip })
    // attach likes count for each post
    await Promise.all(
      posts.map(async (p) => {
        const c = await countLikes('Post', p.id)
        ;(p as any)._likesCount = c
      })
    )
    return posts
  } catch (err: any) {
    if (isPrismaTableMissingError(err)) {
      console.warn('Prisma table posts missing, trying Supabase fallback for listPosts')
      const supabase = createSupabaseClient()
      const rangeStart = skip
      const rangeEnd = skip + take - 1
      const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).range(rangeStart, rangeEnd)
      if (error) {
        console.warn('Supabase fallback failed', error.message)
        return []
      }
      // map supabase rows to shape similar to prisma post
      const posts = (data ?? []).map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        content: r.content,
        imageUrl: r.image_url,
        createdAt: new Date(r.created_at),
        _likesCount: 0,
      }))
      // attach likes count
      await Promise.all(posts.map(async (p: any) => {
        const c = await countLikes('Post', p.id)
        ;(p as any)._likesCount = c
      }))
      return posts
    }
    throw err
  }
}

export async function updatePost(id: number, userId: string, data: { content?: string | null; imageUrl?: string | null }) {
  try {
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post || post.userId !== userId) return null
    return prisma.post.update({ where: { id }, data: { content: data.content ?? post.content, imageUrl: data.imageUrl ?? post.imageUrl } })
  } catch (err: any) {
    if (isPrismaTableMissingError(err)) {
      console.warn('Prisma table posts missing, updatePost returning null')
      return null
    }
    throw err
  }
}

export async function deletePost(id: number, userId: string) {
  try {
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post || post.userId !== userId) return null
    await prisma.comment.deleteMany({ where: { targetType: 'Post', targetId: id } })
    await prisma.like.deleteMany({ where: { targetType: 'Post', targetId: id } })
    return prisma.post.delete({ where: { id } })
  } catch (err: any) {
    if (isPrismaTableMissingError(err)) {
      console.warn('Prisma table posts missing, deletePost returning null')
      return null
    }
    throw err
  }
}
