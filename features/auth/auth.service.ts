import jwt from 'jsonwebtoken'
import { createUser } from './auth.repository'
import type { RegisterDto, UserPublic } from './auth.types'
import { JWT_SECRET, TOKEN_EXPIRES_IN } from '@/lib/config'
import { buildPublicUser } from './buildPublicUser'

export async function register(dto: RegisterDto) {
    const user = await createUser({ ...dto })

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN })

    return { user: buildPublicUser(user), token }
}
