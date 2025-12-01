import { NextResponse } from 'next/server'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'
import { listItemsByUser, createItem } from '@/features/items/item.repository'
import { buildPublicItems, buildPublicItem } from '@/features/items/buildPublicItem'
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

    const url = new URL(req.url)
    const take = Number(url.searchParams.get('take') ?? '50')
    const skip = Number(url.searchParams.get('skip') ?? '0')

    const items = await listItemsByUser(user.id, take, skip)
    return NextResponse.json({ status: 'success', message: 'Items retrieved successfully', data: { items: buildPublicItems(items) } })
}

export async function POST(req: Request) {
    const user = await getCurrentUserFromRequest(req)
    if (!user) return NextResponse.json({ status: 'error', message: 'Not authenticated' }, { status: 401 })

    const contentType = req.headers.get('content-type') ?? ''
    if (contentType.includes('multipart/form-data')) {
        const form = await req.formData()
        // parse all expected fields from the form
        const getString = (k: string) => {
            const v = form.get(k)
            return v == null ? null : String(v)
        }

        const brand = getString('brand') ?? getString('custom_brand_name') ?? getString('customBrandName')
        const name = getString('name') ?? getString('custom_product_name') ?? getString('customProductName')
        if (!brand || !name) return NextResponse.json({ status: 'error', message: 'brand and name are required' }, { status: 400 })

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

        const file = form.get('image') as File | null

        let imagePath: string | null = null
        if (file && typeof (file as any).arrayBuffer === 'function') {
            imagePath = await uploadImageToProductBucket(file as File)
        }

        const payload: any = {
            brand,
            name,
            category: category ?? null,
            price: price ?? null,
            expirationDate: expirationDate ? new Date(expirationDate) : null,
            openingDate: openingDate ? new Date(openingDate) : null,
            paoMonths: paoMonths ? parseInt(paoMonths as string, 10) : null,
            status: status ?? null,
            isCurrentlyInUse: isCurrentlyInUse ? (isCurrentlyInUse === 'true' || isCurrentlyInUse === '1') : false,
            usagePercentage: usagePercentage ? parseInt(usagePercentage as string, 10) : null,
            colorVariation: colorVariation ?? null,
            reminderEnabled: reminderEnabled ? (reminderEnabled === 'true' || reminderEnabled === '1') : false,
            reminderDate: reminderDate ? new Date(reminderDate) : null,
            imageUrl: imagePath ?? null,
        }

        const created = await createItem(user.id, payload)
        return NextResponse.json({ status: 'success', message: 'Item created successfully', data: { item: buildPublicItem(created) } }, { status: 201 })
    }

    const body = await req.json()
    const payload = {
        brand: body.brand ?? body.custom_brand_name ?? body.customBrandName ?? null,
        name: body.name ?? body.custom_product_name ?? body.customProductName ?? null,
        category: body.category ?? null,
        price: parseIntegerPrice(body.price),
        expirationDate: body.expiration_date ? new Date(body.expiration_date) : (body.expirationDate ? new Date(body.expirationDate) : null),
        openingDate: body.opening_date ? new Date(body.opening_date) : (body.openingDate ? new Date(body.openingDate) : null),
        paoMonths: body.pao_months ?? body.paoMonths ?? null,
        status: body.status ?? null,
        isCurrentlyInUse: body.is_currently_in_use ?? body.isCurrentlyInUse ?? false,
        usagePercentage: body.usage_percentage ?? body.usagePercentage ?? null,
        colorVariation: body.color_variation ?? body.colorVariation ?? null,
        reminderEnabled: body.reminder_enabled ?? body.reminderEnabled ?? false,
        reminderDate: body.reminder_date ? new Date(body.reminder_date) : (body.reminderDate ? new Date(body.reminderDate) : null),
    }

    const created = await createItem(user.id, payload)
    return NextResponse.json({ status: 'success', message: 'Item created successfully', data: { item: buildPublicItem(created) } }, { status: 201 })
}
