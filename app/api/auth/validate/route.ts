import { NextResponse } from 'next/server'
import getCurrentUserFromRequest from '@/lib/getCurrentUser'

export async function GET(req: Request) {
    try {
        const user = await getCurrentUserFromRequest(req)
        if (!user) return NextResponse.json({ ok: false }, { status: 401 })
        return NextResponse.json({ ok: true })
    } catch (err) {
        return NextResponse.json({ ok: false }, { status: 500 })
    }
}
