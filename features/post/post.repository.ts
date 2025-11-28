import { prisma } from '@/lib/prisma'
import { countLikes } from './like.repository'

export async function createPost(userId: string, data: { content?: string | null; imageUrl?: string | null }) {
  return prisma.post.create({
    data: {
      userId,
      content: data.content ?? null,
      imageUrl: data.imageUrl ?? null,
    },
  })
}

export async function findPostById(id: number) {
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return null
  const c = await countLikes('Post', post.id)
  ;(post as any)._likesCount = c
  return post
}

export async function listPosts(take = 20, skip = 0) {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take, skip })
  // attach likes count for each post
  await Promise.all(
    posts.map(async (p) => {
      const c = await countLikes('Post', p.id)
      ;(p as any)._likesCount = c
    })
  )
  return posts
}

export async function updatePost(id: number, userId: string, data: { content?: string | null; imageUrl?: string | null }) {
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post || post.userId !== userId) return null
  return prisma.post.update({ where: { id }, data: { content: data.content ?? post.content, imageUrl: data.imageUrl ?? post.imageUrl } })
}

export async function deletePost(id: number, userId: string) {
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post || post.userId !== userId) return null
  await prisma.comment.deleteMany({ where: { targetType: 'Post', targetId: id } })
  await prisma.like.deleteMany({ where: { targetType: 'Post', targetId: id } })
  return prisma.post.delete({ where: { id } })
}
import { prisma } from '@/lib/prisma'
import { countLikes } from './like.repository'

export async function createPost(userId: string, data: { content?: string | null; imageUrl?: string | null }) {
    return prisma.post.create({
        data: {
            userId,
            content: data.content ?? null,
            imageUrl: data.imageUrl ?? null,
        },
    })
}

export async function findPostById(id: number) {
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post) return null
    const c = await countLikes('Post', post.id)
    ;(post as any)._likesCount = c
    return post
}

export async function listPosts(take = 20, skip = 0) {
    const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take, skip })
    // attach likes count for each post
    await Promise.all(
        posts.map(async (p) => {
            const c = await countLikes('Post', p.id)
            ;(p as any)._likesCount = c
        })
    )
    return posts
}

export async function updatePost(id: number, userId: string, data: { content?: string | null; imageUrl?: string | null }) {
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post || post.userId !== userId) return null
    return prisma.post.update({ where: { id }, data: { content: data.content ?? post.content, imageUrl: data.imageUrl ?? post.imageUrl } })
}

export async function deletePost(id: number, userId: string) {
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post || post.userId !== userId) return null
    await prisma.comment.deleteMany({ where: { targetType: 'Post', targetId: id } })
    await prisma.like.deleteMany({ where: { targetType: 'Post', targetId: id } })
    return prisma.post.delete({ where: { id } })
}
import { prisma } from '@/lib/prisma'

export async function createPost(userId: string, data: { content?: string | null; imageUrl?: string | null }) {
    return prisma.post.create({
        data: {
            userId,
            content: data.content ?? null,
            imageUrl: data.imageUrl ?? null,
        }
    })
}

export async function findPostById(id: number) {
    return prisma.post.findUnique({ where: { id } })
        const post = await prisma.post.findUnique({ where: { id } })
        if (!post) return null
        const c = await countLikes('Post', post.id)
        ;(post as any)._likesCount = c
        return post
}

export async function listPosts(take = 20, skip = 0) {
    return prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take, skip })
        const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' }, take, skip })
        // attach likes count for each post
        await Promise.all(posts.map(async (p) => {
            const c = await countLikes('Post', p.id)
            ;(p as any)._likesCount = c
        }))
        return posts
}

    export async function updatePost(id: number, userId: string, data: { content?: string | null; imageUrl?: string | null }) {
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post || post.userId !== userId) return null
    return prisma.post.update({ where: { id }, data: { content: data.content ?? post.content, imageUrl: data.imageUrl ?? post.imageUrl } })
}

    export async function deletePost(id: number, userId: string) {
    const post = await prisma.post.findUnique({ where: { id } })
    if (!post || post.userId !== userId) return null
    await prisma.comment.deleteMany({ where: { targetType: 'Post', targetId: id } })
    await prisma.like.deleteMany({ where: { targetType: 'Post', targetId: id } })
    return prisma.post.delete({ where: { id } })
}

    // The second block of code has been removed.
