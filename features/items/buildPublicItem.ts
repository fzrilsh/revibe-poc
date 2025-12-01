import { buildPublicUrl, PRODUCT_BUCKET } from '@/lib/config'

export function buildPublicItem(item: any) {
    if (!item) return null
    const rawImage = item.imageUrl ?? (item as any).image_url ?? null
    return {
        id: item.id,
        brand: item.brand ?? (item as any).brand ?? null,
        name: item.name ?? (item as any).name ?? null,
        category: item.category ?? null,
        price: item.price ?? null,
        expiration_date: item.expirationDate?.toISOString?.() ?? (item as any).expiration_date ?? null,
        opening_date: item.openingDate?.toISOString?.() ?? (item as any).opening_date ?? null,
        pao_months: item.paoMonths ?? (item as any).pao_months ?? null,
        status: item.status ?? null,
        is_currently_in_use: item.isCurrentlyInUse ?? (item as any).is_currently_in_use ?? false,
        usage_percentage: item.usagePercentage ?? (item as any).usage_percentage ?? null,
        color_variation: item.colorVariation ?? (item as any).color_variation ?? null,
        created_at: item.createdAt?.toISOString?.() ?? (item as any).created_at ?? new Date().toISOString(),
        reminder_enabled: item.reminderEnabled ?? (item as any).reminder_enabled ?? false,
        reminder_date: item.reminderDate?.toISOString?.() ?? (item as any).reminder_date ?? null,
        image_url: buildPublicUrl(rawImage, PRODUCT_BUCKET),
    }
}

export function buildPublicItems(items: any[]) {
    return items.map(i => buildPublicItem(i))
}
