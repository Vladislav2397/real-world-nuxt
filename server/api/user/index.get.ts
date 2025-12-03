import { authService } from '../../services'
import { transformUser } from '../../utils/transform'

export default defineEventHandler(event => {
    const user = authService.getCurrentUser(event)

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
