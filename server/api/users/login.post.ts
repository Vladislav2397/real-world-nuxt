import { authenticateUser } from '../../utils/users'
import { transformUser } from '../../utils/transform'
import { createCustomError } from '~~/server/utils/custom-error'

export default defineEventHandler(async event => {
    const body = await readBody(event)

    if (!body?.user?.email || !body?.user?.password) {
        return createCustomError(event, 422, {
            errors: {
                ...(!body.user.email && {
                    email: ['Email is required'],
                }),
                ...(!body.user.password && {
                    password: ['Password is required'],
                }),
            },
        })
    }

    const user = authenticateUser(body.user.email, body.user.password)

    if (!user) {
        return createCustomError(event, 401, {
            errors: {
                password: ['Invalid email or password'],
            },
        })
    }

    return {
        user: transformUser(user),
    }
})
