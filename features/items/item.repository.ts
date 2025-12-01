import { prisma } from '@/lib/prisma'
import { createSupabaseClient } from '@/lib/config'

function isPrismaTableMissingError(err: any) {
  return err && typeof err === 'object' && err.code === 'P2021'
}

function toSnakeCasePayload(data: any) {
  if (!data || typeof data !== 'object') return data
  const out: any = {}
  if (data.brand !== undefined) out.brand = data.brand
  if (data.name !== undefined) out.name = data.name
  if (data.category !== undefined) out.category = data.category
  if (data.price !== undefined) out.price = data.price
  if (data.expirationDate !== undefined) out.expiration_date = data.expirationDate instanceof Date ? data.expirationDate.toISOString() : data.expirationDate
  if (data.openingDate !== undefined) out.opening_date = data.openingDate instanceof Date ? data.openingDate.toISOString() : data.openingDate
  if (data.paoMonths !== undefined) out.pao_months = data.paoMonths
  if (data.status !== undefined) out.status = data.status
  if (data.isCurrentlyInUse !== undefined) out.is_currently_in_use = data.isCurrentlyInUse
  if (data.usagePercentage !== undefined) out.usage_percentage = data.usagePercentage
  if (data.colorVariation !== undefined) out.color_variation = data.colorVariation
  if (data.reminderEnabled !== undefined) out.reminder_enabled = data.reminderEnabled
  if (data.reminderDate !== undefined) out.reminder_date = data.reminderDate instanceof Date ? data.reminderDate.toISOString() : data.reminderDate
  if (data.imageUrl !== undefined) out.image_url = data.imageUrl
  return out
}

function sanitizeItemPayloadForPrisma(input: any) {
  if (!input || typeof input !== 'object') return {}
  const out: any = {}
  if (input.brand !== undefined) out.brand = input.brand === '' ? null : String(input.brand)
  if (input.name !== undefined) out.name = input.name === '' ? null : String(input.name)
  if (input.category !== undefined) out.category = input.category === '' ? null : String(input.category)
  if (input.imageUrl !== undefined) out.imageUrl = input.imageUrl === '' ? null : String(input.imageUrl)

  if (input.price !== undefined) {
    const v = input.price
    const n = typeof v === 'number' ? Math.round(v) : Number(String(v))
    if (!Number.isNaN(n)) out.price = Math.round(n)
  }

  if (input.expirationDate !== undefined) {
    const v = input.expirationDate
    out.expirationDate = v instanceof Date ? v : v ? new Date(v) : null
  }
  if (input.openingDate !== undefined) {
    const v = input.openingDate
    out.openingDate = v instanceof Date ? v : v ? new Date(v) : null
  }
  if (input.paoMonths !== undefined) out.paoMonths = input.paoMonths === null || input.paoMonths === '' ? null : parseInt(String(input.paoMonths), 10)
  if (input.status !== undefined) out.status = input.status === '' ? null : String(input.status)
  if (input.isCurrentlyInUse !== undefined) out.isCurrentlyInUse = Boolean(input.isCurrentlyInUse)
  if (input.usagePercentage !== undefined) out.usagePercentage = input.usagePercentage === null || input.usagePercentage === '' ? null : parseInt(String(input.usagePercentage), 10)
  if (input.colorVariation !== undefined) out.colorVariation = input.colorVariation === '' ? null : String(input.colorVariation)
  if (input.reminderEnabled !== undefined) out.reminderEnabled = Boolean(input.reminderEnabled)
  if (input.reminderDate !== undefined) {
    const v = input.reminderDate
    out.reminderDate = v instanceof Date ? v : v ? new Date(v) : null
  }

  return out
}

export async function createItem(userId: string, data: any) {
  // If Prisma client doesn't have the `item` model (client not generated), fallback to Supabase
  const prismaItem = (prisma as any).item
  if (!prismaItem || typeof prismaItem.create !== 'function') {
    const supabase = createSupabaseClient()
    const payload = { user_id: userId, ...toSnakeCasePayload(data) }
    const { data: inserted } = await supabase.from('items').insert([payload]).select('*').single()
    return inserted ?? null
  }

  try {
    return await prismaItem.create({ data: { userId, ...data } })
  } catch (err: any) {
    if (isPrismaTableMissingError(err)) {
      const supabase = createSupabaseClient()
      const payload = { user_id: userId, ...toSnakeCasePayload(data) }
      const { data: inserted } = await supabase.from('items').insert([payload]).select('*').single()
      return inserted ?? null
    }
    throw err
  }
}

export async function findItemById(id: number) {
  const prismaItem = (prisma as any).item
  if (!prismaItem || typeof prismaItem.findUnique !== 'function') {
    const supabase = createSupabaseClient()
    const { data } = await supabase.from('items').select('*').eq('id', id).limit(1)
    if (!data || (data as any).length === 0) return null
    return (data as any)[0]
  }

  try {
    return await prismaItem.findUnique({ where: { id } })
  } catch (err: any) {
    if (isPrismaTableMissingError(err)) return null
    throw err
  }
}

export async function listItemsByUser(userId: string, take = 50, skip = 0) {
  const prismaItem = (prisma as any).item
  if (!prismaItem || typeof prismaItem.findMany !== 'function') {
    const supabase = createSupabaseClient()
    const { data } = await supabase.from('items').select('*').eq('user_id', userId).order('created_at', { ascending: false }).range(skip, skip + take - 1)
    return data ?? []
  }

  try {
    return await prismaItem.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take, skip })
  } catch (err: any) {
    if (isPrismaTableMissingError(err)) {
      const supabase = createSupabaseClient()
      const { data } = await supabase.from('items').select('*').eq('user_id', userId).order('created_at', { ascending: false }).range(skip, skip + take - 1)
      return data ?? []
    }
    throw err
  }
}

export async function updateItem(id: number, userId: string, data: any) {
  const prismaItem = (prisma as any).item
  if (!prismaItem || typeof prismaItem.findUnique !== 'function' || typeof prismaItem.update !== 'function') {
    const supabase = createSupabaseClient()
    const { data: existing } = await supabase.from('items').select('*').eq('id', id).limit(1)
    if (!existing || (existing as any).length === 0 || (existing as any)[0].user_id !== userId) return null
    const { data: updated } = await supabase.from('items').update(toSnakeCasePayload(data)).eq('id', id).select('*').single()
    return updated ?? null
  }

  try {
    const existing = await prismaItem.findUnique({ where: { id } })
    if (!existing || existing.userId !== userId) return null
    const sanitized = sanitizeItemPayloadForPrisma(data)
    return await prismaItem.update({ where: { id }, data: sanitized })
  } catch (err: any) {
    if (isPrismaTableMissingError(err)) {
      const supabase = createSupabaseClient()
      const { data: existing } = await supabase.from('items').select('*').eq('id', id).limit(1)
      if (!existing || (existing as any).length === 0 || (existing as any)[0].user_id !== userId) return null
      const { data: updated } = await supabase.from('items').update(toSnakeCasePayload(data)).eq('id', id).select('*').single()
      return updated ?? null
    }
    throw err
  }
}

export async function deleteItem(id: number, userId: string) {
  const prismaItem = (prisma as any).item
  if (!prismaItem || typeof prismaItem.findUnique !== 'function' || typeof prismaItem.delete !== 'function') {
    const supabase = createSupabaseClient()
    const { data: existing } = await supabase.from('items').select('*').eq('id', id).limit(1)
    if (!existing || (existing as any).length === 0 || (existing as any)[0].user_id !== userId) return null
    const { data: deleted } = await supabase.from('items').delete().eq('id', id).select('*').single()
    return deleted ?? null
  }

  try {
    const existing = await prismaItem.findUnique({ where: { id } })
    if (!existing || existing.userId !== userId) return null
    return await prismaItem.delete({ where: { id } })
  } catch (err: any) {
    if (isPrismaTableMissingError(err)) {
      const supabase = createSupabaseClient()
      const { data: existing } = await supabase.from('items').select('*').eq('id', id).limit(1)
      if (!existing || (existing as any).length === 0 || (existing as any)[0].user_id !== userId) return null
      const { data: deleted } = await supabase.from('items').delete().eq('id', id).select('*').single()
      return deleted ?? null
    }
    throw err
  }
}
