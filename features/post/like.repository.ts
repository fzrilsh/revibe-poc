import prisma from '@/lib/prisma'

export async function toggleLike(userId: string, targetType: string, targetId: number) {
    const existing = await prisma.like.findUnique({ where: { userId_targetType_targetId: { userId, targetType, targetId } } }).catch(() => null)
    if (existing) {
        await prisma.like.delete({ where: { id: existing.id } })
        return { liked: false }
    }
    await prisma.like.create({ data: { userId, targetType, targetId } })
    return { liked: true }
}

export async function countLikes(targetType: string, targetId: number) {
    return prisma.like.count({ where: { targetType, targetId } })
}

export async function userLiked(userId: string, targetType: string, targetId: number) {
    const l = await prisma.like.findUnique({ where: { userId_targetType_targetId: { userId, targetType, targetId } } }).catch(() => null)
    return !!l
}
