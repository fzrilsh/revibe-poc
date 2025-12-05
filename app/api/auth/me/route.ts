import { NextResponse } from 'next/server'
import { parse as parseCookie } from 'cookie'
import jwt from 'jsonwebtoken'
import { findUserById, updateUser } from '../../../../features/auth/auth.repository'
import { buildPublicUser } from '@/features/auth/buildPublicUser'
import { COOKIE_NAME, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, BUCKET, JWT_SECRET, buildPublicUrl, createSupabaseClient } from '@/lib/config'

async function getCurrentUser(req: Request) {
    const cookieHeader = req.headers.get('cookie') ?? ''
    const cookies = parseCookie(cookieHeader || '')
    const token = cookies[COOKIE_NAME]
    if (!token) return null

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any
        const userId = decoded?.sub
        if (!userId) return null

        return await findUserById(userId)
    } catch (err) {
        return null
    }
}

export async function GET(req: Request) {
    const user = await getCurrentUser(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const publicUser = buildPublicUser(user)

    return NextResponse.json({
        status: 'success',
        message: 'User retrieved successfully.',
        data: { user: publicUser },
    })
}

export async function PATCH(req: Request) {
    const user = await getCurrentUser(req)
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    try {
        const contentType = req.headers.get('content-type') || ''
        if (!contentType.startsWith('multipart/form-data')) {
            return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 })
        }

        const form = await req.formData()
        const updates: any = {}

        const birthYearRaw = form.get('birth_year')
        if (birthYearRaw !== null) {
            const by = Number(birthYearRaw)
            const currentYear = new Date().getFullYear()
            if (!Number.isInteger(by) || by >= currentYear || by < 1798) {
                return NextResponse.json({
                    error: `birth_year must be an integer between 1798 and ${currentYear - 1}`
                }, { status: 400 })
            }
            updates.birthYear = by
        }

        const skinTypeVal = form.get('skin_type')
        if (typeof skinTypeVal === 'string' && skinTypeVal.length > 0) {
            const allowed = ['OILY', 'DRY', 'COMBINATION', 'SENSITIVE', 'NORMAL']
            if (!allowed.includes(skinTypeVal)) {
                return NextResponse.json({
                    error: `skin_type must be one of: ${allowed.join(', ')}`
                }, { status: 400 })
            }
            updates.skinType = skinTypeVal
        }

        const file = form.get('profile_image')
        const isFile = file instanceof File && file.size > 0

        let newPath: string | null = null
        const oldPath = user.profileImage

        if (isFile && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
            const supabase = createSupabaseClient()

            const filename = file.name || `profile-${Date.now()}`
            const buffer = Buffer.from(await file.arrayBuffer())
            const path = `${Date.now()}_${filename}`

            const { error: uploadError } = await supabase.storage
                .from(BUCKET)
                .upload(path, buffer, {
                    contentType: file.type || 'application/octet-stream',
                    upsert: false,
                })

            if (uploadError) {
                return NextResponse.json({ error: uploadError.message }, { status: 500 })
            }

            newPath = path
            updates.profileImage = newPath
        }

        const updated = await updateUser(user.id, updates)

        if (newPath && oldPath) {
            const supabase = createSupabaseClient()
            supabase.storage.from(BUCKET).remove([oldPath]).catch(() => { })
        }

        const publicUser = buildPublicUser(updated)

        return NextResponse.json({ user: publicUser })
    } catch (err: any) {
        return NextResponse.json({ error: err?.message ?? 'Update failed' }, { status: 400 })
    }
}
