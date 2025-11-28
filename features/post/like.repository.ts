import prisma from '@/lib/prisma'
import { createSupabaseClient } from '@/lib/config'

function isPrismaTableMissingError(err: any) {
    return err && typeof err === 'object' && err.code === 'P2021'
}

export async function toggleLike(userId: string, targetType: string, targetId: number) {
    try {
        const existing = await prisma.like.findUnique({ where: { userId_targetType_targetId: { userId, targetType, targetId } } }).catch(() => null)
        if (existing) {
            await prisma.like.delete({ where: { id: existing.id } })
            return { liked: false }
        }
        await prisma.like.create({ data: { userId, targetType, targetId } })
        return { liked: true }
    } catch (err: any) {
        if (isPrismaTableMissingError(err)) {
            const supabase = createSupabaseClient()
            const { data: existing } = await supabase
                .from('likes')
                .select('id')
                .eq('user_id', userId)
                .eq('target_type', targetType)
                .eq('target_id', targetId)
                .limit(1)
            if (existing && existing.length) {
                await supabase.from('likes').delete().eq('id', existing[0].id)
                return { liked: false }
            }
            await supabase.from('likes').insert([{ user_id: userId, target_type: targetType, target_id: targetId }])
            return { liked: true }
        }
        throw err
    }
}

export async function countLikes(targetType: string, targetId: number) {
    try {
        return await prisma.like.count({ where: { targetType, targetId } })
    } catch (err: any) {
        if (isPrismaTableMissingError(err)) {
            const supabase = createSupabaseClient()
            const { count } = await supabase.from('likes').select('id', { count: 'exact', head: false }).eq('target_type', targetType).eq('target_id', targetId)
            // supabase returns count in `count` property when exact
            return (count as number) ?? 0
        }
        throw err
    }
}

export async function userLiked(userId: string, targetType: string, targetId: number) {
    try {
        const l = await prisma.like.findUnique({ where: { userId_targetType_targetId: { userId, targetType, targetId } } }).catch(() => null)
        return !!l
    } catch (err: any) {
        if (isPrismaTableMissingError(err)) {
            const supabase = createSupabaseClient()
            const { data } = await supabase.from('likes').select('id').eq('user_id', userId).eq('target_type', targetType).eq('target_id', targetId).limit(1)
            return !!(data && data.length)
        }
        throw err
    }
}
