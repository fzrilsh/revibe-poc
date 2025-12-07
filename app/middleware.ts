import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = [
    '/onboarding',
    '/opening',
    '/splash',
    '/registration',
    '/api/auth/register',
    '/api/auth/me',
    '/favicon.ico',
    '/_next',
]

function isPublic(pathname: string) {
    return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p))
}

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname

    if (isPublic(pathname)) return NextResponse.next()

    const token = req.cookies.get('rv_token')?.value
    if (!token) {
        const url = req.nextUrl.clone()
        url.pathname = '/'
        const res = NextResponse.redirect(url)
        res.headers.append('Set-Cookie', 'rv_token=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0')
        res.headers.append('Set-Cookie', 'revibe_intro_seen=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0')
        return res
    }

    try {
        const validateUrl = new URL('/api/auth/me', req.url).toString()
        const resp = await fetch(validateUrl, {
            method: 'GET',
            headers: { cookie: req.headers.get('cookie') ?? '' },
            cache: 'no-store',
        })
        if (resp.ok) return NextResponse.next()
    } catch (err) {
        // fallthrough to clear cookie + redirect
    }

    const url = req.nextUrl.clone()
    url.pathname = '/'
    const res = NextResponse.redirect(url)
    res.headers.append('Set-Cookie', 'rv_token=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0')
    res.headers.append('Set-Cookie', 'revibe_intro_seen=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0')
    return res
}

export const config = {
    matcher: [
        '/app/:path*',
        '/dashboard/:path*',
        '/activity/:path*',
        '/directory/:path*',
        '/feed/:path*',
        '/history/:path*',
        '/profile/:path*',
    ],
}