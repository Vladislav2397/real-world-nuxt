import { authService, userService } from '../../services'
import { transformUser } from '../../utils/transform'

export default defineEventHandler(async event => {
    const currentUser = authService.getCurrentUser(event)

    if (!currentUser) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const body = await readBody(event)

    const updatedUser = userService.updateUser(currentUser.id, {
        email: body?.user?.email,
        username: body?.user?.username,
        password: body?.user?.password,
        bio: body?.user?.bio,
        image: body?.user?.image,
    })

    if (!updatedUser) {
        throw createError({
            statusCode: 404,
            message: 'User not found',
        })
    }

    return {
        user: transformUser(updatedUser),
    }
})

