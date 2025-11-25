import { getCurrentUser } from '../../utils/auth'
import { transformUser } from '../../utils/transform'

export default defineEventHandler(event => {
    const user = getCurrentUser(event)

    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    return {
        user: transformUser(user),
    }
})
