import { getRouterParam } from 'h3'
import { userService, authService } from '../../services'
import { transformProfile } from '../../utils/transform'

export default defineEventHandler(event => {
    const username = getRouterParam(event, 'username')
    const currentUser = authService.getCurrentUser(event)

    if (!username) {
        throw createError({
            statusCode: 400,
            message: 'Username is required',
        })
    }

    const user = userService.findUserByUsername(username)

    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found',
        })
    }

    return {
        profile: transformProfile(user, currentUser?.id),
    }
})
