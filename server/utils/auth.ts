import { getHeader } from 'h3'
import type { EventHandlerRequest, H3Event } from 'h3'
import { findUserByToken } from './users'

export const getCurrentUser = (event: H3Event<EventHandlerRequest>) => {
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader) return null

    // Формат: "Token <token>" или "Bearer <token>"
    const token = authHeader.replace(/^(Token|Bearer)\s+/i, '')
    return findUserByToken(token)
}
