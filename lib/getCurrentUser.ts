import { parse as parseCookie } from 'cookie'
import jwt from 'jsonwebtoken'
import { COOKIE_NAME, JWT_SECRET } from './config'
import { findUserById } from '@/features/auth/auth.repository'

export async function getCurrentUserFromRequest(req: Request) {
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

export default getCurrentUserFromRequest
