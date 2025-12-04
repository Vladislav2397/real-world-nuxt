import { getRouterParam } from 'h3'
import { authService, userService, profileService } from '../../../services'
import { transformProfile } from '../../../utils/transform'

export default defineEventHandler(async event => {
    const currentUser = await authService.getCurrentUser(event)

    if (!currentUser) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const username = getRouterParam(event, 'username')

    if (!username) {
        throw createError({
            statusCode: 400,
            message: 'Username is required',
        })
    }

    const user = await userService.findUserByUsername(username)

    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found',
        })
    }

    if (user.id === currentUser.id) {
        throw createError({
            statusCode: 422,
            message: 'Cannot follow yourself',
        })
    }

    await profileService.followUser(currentUser.id, user.id)

    return {
        profile: await transformProfile(user, currentUser.id),
    }
})
