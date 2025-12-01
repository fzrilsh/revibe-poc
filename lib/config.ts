export const COOKIE_NAME = 'rv_token'
export const BUCKET = 'profile'
export const POST_BUCKET = 'post'
export const PRODUCT_BUCKET = 'product'

export const SUPABASE_URL = process.env.SUPABASE_URL ?? ''
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

export const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'
export const TOKEN_EXPIRES_IN = '10y'
export const TEN_YEARS_IN_SECONDS = 60 * 60 * 24 * 365 * 10

export function buildPublicUrl(path: string | null, bucket?: string) {
    if (!path) return null
    // If already an absolute URL, return as-is
    if (typeof path === 'string' && /^https?:\/\//i.test(path)) return path
    if (!SUPABASE_URL) return null
    const b = bucket ?? BUCKET
    return `${SUPABASE_URL}/storage/v1/object/public/${b}/${path}`
}

export function createSupabaseClient() {
    // lazy import to avoid bringing @supabase/supabase-js in contexts where not needed
    // caller can still import createClient directly if they prefer
    const { createClient } = require('@supabase/supabase-js')
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
}
