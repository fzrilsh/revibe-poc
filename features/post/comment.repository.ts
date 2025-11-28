import prisma from '@/lib/prisma'

export async function createComment(userId: string, targetType: string, targetId: number, content: string) {
    return prisma.comment.create({ data: { userId, targetType, targetId, content } })
}

export async function listComments(targetType: string, targetId: number) {
    return prisma.comment.findMany({ where: { targetType, targetId }, orderBy: { createdAt: 'asc' } })
}

export async function findCommentById(id: number) {
    return prisma.comment.findUnique({ where: { id } })
}

export async function updateComment(id: number, userId: string, content: string) {
    const c = await prisma.comment.findUnique({ where: { id } })
    if (!c || c.userId !== userId) return null
    return prisma.comment.update({ where: { id }, data: { content } })
}

export async function deleteComment(id: number, userId: string) {
    const c = await prisma.comment.findUnique({ where: { id } })
    if (!c || c.userId !== userId) return null
    await prisma.like.deleteMany({ where: { targetType: c.targetType, targetId: c.targetId } })
    return prisma.comment.delete({ where: { id } })
}
