import { userService } from '../../services'
import { transformUser } from '../../utils/transform'

export default defineEventHandler(async event => {
    const body = await readBody(event)

    if (!body?.user?.email || !body?.user?.password || !body?.user?.username) {
        throw createError({
            statusCode: 422,
            message: 'Email, password and username are required',
        })
    }

    // Проверяем, не существует ли уже пользователь с таким email или username
    if (userService.findUserByEmail(body.user.email)) {
        throw createError({
            statusCode: 422,
            message: 'User with this email already exists',
        })
    }

    if (userService.findUserByUsername(body.user.username)) {
        throw createError({
            statusCode: 422,
            message: 'User with this username already exists',
        })
    }

    const user = userService.createUser({
        email: body.user.email,
        username: body.user.username,
        password: body.user.password,
    })

    return {
        user: transformUser(user),
    }
})
