import { getRouterParam } from 'h3'
import { findUserByUsername } from '../../utils/users'
import { transformProfile } from '../../utils/transform'
import { getCurrentUser } from '../../utils/auth'

export default defineEventHandler(event => {
    const username = getRouterParam(event, 'username')
    const currentUser = getCurrentUser(event)

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

    return {
        profile: transformProfile(user, currentUser?.id),
    }
})
