// import { getHeader } from 'h3'
import type { EventHandlerRequest, H3Event } from 'h3'
import { findUserByToken } from './users'

export const getCurrentUser = (event: H3Event<EventHandlerRequest>) => {
    // const authHeader = getHeader(event, 'authorization')
    // if (!authHeader) return null

    // // Формат: "Bearer <token>"
    // const token = authHeader.replace(/^(Bearer)\s+/i, '')
    // return findUserByToken(token)

    const token = getCookie(event, 'token')
    if (!token) return null

    return findUserByToken(token)
}
