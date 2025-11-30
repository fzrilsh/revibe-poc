export const TARGET_TYPE_TABLE_MAP: Record<string, string> = {
    Post: 'posts',
    Review: 'reviews', // supported at API-level; DB/table may be added in feature branch
}

export function isSupportedTargetType(targetType?: string) {
    if (!targetType) return false
    return Boolean(TARGET_TYPE_TABLE_MAP[targetType])
}

export function getTargetTable(targetType?: string) {
    if (!targetType) return null
    return TARGET_TYPE_TABLE_MAP[targetType] ?? null
}
