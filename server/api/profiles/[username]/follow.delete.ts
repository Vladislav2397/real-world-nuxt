import { getRouterParam } from 'h3'
import { getCurrentUser } from '../../../utils/auth'
import { findUserByUsername } from '../../../utils/users'
import { unfollowUser } from '../../../utils/profiles'
import { transformProfile } from '../../../utils/transform'

export default defineEventHandler(event => {
    const currentUser = getCurrentUser(event)

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

    const user = findUserByUsername(username)

    if (!user) {
        throw createError({
            statusCode: 404,
            message: 'User not found',
        })
    }

    unfollowUser(currentUser.id, user.id)

    return {
        profile: transformProfile(user, currentUser.id),
    }
})
