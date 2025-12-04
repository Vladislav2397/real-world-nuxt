import { getHeader } from 'h3'
import type { EventHandlerRequest, H3Event } from 'h3'
import type { UserService } from './user.service'

export class AuthService {
    private userService: UserService

    constructor({ userService }: { userService: UserService }) {
        this.userService = userService
    }

    async getCurrentUser(event: H3Event<EventHandlerRequest>) {
        const authHeader = getHeader(event, 'authorization')
        if (!authHeader) return null

        // Формат: "Bearer <token>"
        const token = authHeader.replace(/^(Bearer)\s+/i, '')
        return await this.userService.findUserByToken(token)
    }
}
