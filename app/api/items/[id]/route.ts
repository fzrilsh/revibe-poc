import { NextResponse } from 'next/server'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'
import { findItemById, updateItem, deleteItem } from '@/features/items/item.repository'
import { buildPublicItem } from '@/features/items/buildPublicItem'
import { findUserById } from '@/features/auth/auth.repository'
import { createSupabaseClient, PRODUCT_BUCKET } from '@/lib/config'

async function uploadImageToProductBucket(file: File) {
    const supabase = createSupabaseClient()
    const filename = file.name || `product-${Date.now()}`
    const buffer = Buffer.from(await file.arrayBuffer())
    const path = `${Date.now()}_${filename}`
    const { error } = await supabase.storage.from(PRODUCT_BUCKET).upload(path, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
    })
    if (error) throw new Error(error.message)
    return path
}

function parseIntegerPrice(v: any): number | null {
    if (v == null) return null
    if (typeof v === 'number') return Math.round(v)
    const s = String(v).trim()
    if (!s) return null
    const n = Number(s)
    if (Number.isNaN(n)) return null
    return Math.round(n)
}

export async function GET(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ status: 'error', message: 'Not authenticated' }, { status: 401 })

    const id = Number(req.url.split('/').pop())
    const item = await findItemById(id)
    if (!item) return NextResponse.json({ status: 'error', message: 'Not found' }, { status: 404 })
    if (item.userId !== user.id && item.user_id && item.user_id !== user.id) {
        return NextResponse.json({ status: 'error', message: 'Not allowed' }, { status: 403 })
    }
    // fetch minimal user info for the item's creator (username + image_url)
    const creatorId = item.userId ?? (item as any).user_id
    let creator: any = null
    if (creatorId) {
        try {
            const u = await findUserById(creatorId)
            creator = {
                username: u?.nickname ?? null,
                image_url: u?.profileImage ?? (u as any)?.profile_image ?? null,
            }
        } catch (err) {
            // ignore failures to fetch creator info; return item without user details
            creator = null
        }
    }

    return NextResponse.json({ status: 'success', message: 'Item retrieved successfully', data: { item: buildPublicItem(item), user: creator } })
}

export async function PATCH(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ status: 'error', message: 'Not authenticated' }, { status: 401 })

    const id = Number(req.url.split('/').pop())
    const contentType = req.headers.get('content-type') ?? ''
    let data: any = {}

    if (contentType.includes('multipart/form-data')) {
        const form = await req.formData()
        const getString = (k: string) => {
            const v = form.get(k)
            return v == null ? null : String(v)
        }

        const brand = getString('brand') ?? getString('custom_brand_name') ?? getString('customBrandName')
        const name = getString('name') ?? getString('custom_product_name') ?? getString('customProductName')
        if (brand) data.brand = brand
        if (name) data.name = name

        const category = getString('category')
        const price = parseIntegerPrice(getString('price'))
        const expirationDate = getString('expirationDate') ?? getString('expiration_date')
        const openingDate = getString('openingDate') ?? getString('opening_date')
        const paoMonths = getString('paoMonths') ?? getString('pao_months')
        const status = getString('status')
        const isCurrentlyInUse = (getString('isCurrentlyInUse') ?? getString('is_currently_in_use'))
        const usagePercentage = getString('usagePercentage') ?? getString('usage_percentage')
        const colorVariation = getString('colorVariation') ?? getString('color_variation')
        const reminderEnabled = getString('reminderEnabled') ?? getString('reminder_enabled')
        const reminderDate = getString('reminderDate') ?? getString('reminder_date')

        if (category !== null) data.category = category
        if (price !== null && price !== undefined) data.price = price
        if (expirationDate) data.expirationDate = new Date(expirationDate)
        if (openingDate) data.openingDate = new Date(openingDate)
        if (paoMonths) data.paoMonths = parseInt(paoMonths as string, 10)
        if (status !== null) data.status = status
        if (isCurrentlyInUse !== null) data.isCurrentlyInUse = (isCurrentlyInUse === 'true' || isCurrentlyInUse === '1')
        if (usagePercentage) data.usagePercentage = parseInt(usagePercentage as string, 10)
        if (colorVariation !== null) data.colorVariation = colorVariation
        if (reminderEnabled !== null) data.reminderEnabled = (reminderEnabled === 'true' || reminderEnabled === '1')
        if (reminderDate) data.reminderDate = new Date(reminderDate)

        const file = form.get('image') as File | null
        if (file && typeof (file as any).arrayBuffer === 'function') {
            const path = await uploadImageToProductBucket(file as File)
            data.imageUrl = path
        }
    } else {
        let body: any
        try {
            body = await req.json()
        } catch (err) {
            return NextResponse.json({ status: 'error', message: 'Invalid JSON' }, { status: 400 })
        }

        if (body.category !== undefined) data.category = body.category
        if (body.status !== undefined) data.status = body.status
        if (body.custom_brand_name || body.customBrandName || body.brand) data.brand = body.brand ?? body.custom_brand_name ?? body.customBrandName
        if (body.custom_product_name || body.customProductName || body.name) data.name = body.name ?? body.custom_product_name ?? body.customProductName
        if (body.price !== undefined) data.price = parseIntegerPrice(body.price)
        if (body.expiration_date || body.expirationDate) data.expirationDate = body.expiration_date ? new Date(body.expiration_date) : new Date(body.expirationDate)
        if (body.opening_date || body.openingDate) data.openingDate = body.opening_date ? new Date(body.opening_date) : new Date(body.openingDate)
        if (body.image_url || body.imageUrl) data.imageUrl = body.imageUrl ?? body.image_url
    }

    const updated = await updateItem(id, user.id, data)
    if (!updated) return NextResponse.json({ status: 'error', message: 'Not found or not allowed' }, { status: 404 })
    return NextResponse.json({ status: 'success', message: 'Item updated successfully', data: { item: buildPublicItem(updated) } })
}

export async function DELETE(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ status: 'error', message: 'Not authenticated' }, { status: 401 })

    const id = Number(req.url.split('/').pop())
    const deleted = await deleteItem(id, user.id)
    if (!deleted) return NextResponse.json({ status: 'error', message: 'Not found or not allowed' }, { status: 404 })
    return NextResponse.json({ status: 'success', message: 'Item deleted successfully', data: { item: buildPublicItem(deleted) } })
}
