import { userService } from '../../services'
import { transformUser } from '../../utils/transform'

export default defineEventHandler(async event => {
    const body = await readBody(event)

    if (!body?.user?.email || !body?.user?.password) {
        throw createError({
            statusCode: 422,
            data: {
                errors: {
                    ...(!body.user.email && {
                        email: ['Email is required'],
                    }),
                    ...(!body.user.password && {
                        password: ['Password is required'],
                    }),
                },
            },
        })
    }

    const user = userService.authenticateUser(body.user.email, body.user.password)

    if (!user) {
        throw createError({
            statusCode: 401,
            data: {
                errors: {
                    password: ['Invalid email or password'],
                },
            },
        })
    }

    return {
        user: transformUser(user),
    }
})
