import { getCurrentUser } from '../../utils/auth'
import { updateUser } from '../../utils/users'
import { transformUser } from '../../utils/transform'

export default defineEventHandler(async event => {
    const currentUser = getCurrentUser(event)

    if (!currentUser) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const body = await readBody(event)

    const updatedUser = updateUser(currentUser.id, {
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

