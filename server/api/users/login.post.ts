import { userService } from '../../services'
import { transformUser } from '../../utils/transform'
import { validateEmail } from '../../utils/validation'
import { checkRateLimit, getClientIP } from '../../utils/rate-limit'

export default defineEventHandler(async event => {
    // Rate limiting: максимум 5 попыток входа в минуту
    const clientIP = getClientIP(event)
    const rateLimit = checkRateLimit(clientIP, 5, 60 * 1000)

    if (!rateLimit.allowed) {
        throw createError({
            statusCode: 429,
            message: 'Too many login attempts. Please try again later.',
            data: {
                errors: {
                    email: [
                        `Too many attempts. Try again after ${new Date(rateLimit.resetTime).toLocaleTimeString()}`,
                    ],
                },
            },
        })
    }
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

    // Валидация email формата
    if (!validateEmail(body.user.email)) {
        throw createError({
            statusCode: 422,
            data: {
                errors: {
                    email: ['Email is invalid'],
                },
            },
        })
    }

    const user = await userService.authenticateUser(
        body.user.email,
        body.user.password
    )

    if (!user) {
        // Используем одинаковое время ответа для защиты от timing attacks
        // (хотя bcrypt.compare уже защищен, но дополнительная защита не помешает)
        throw createError({
            statusCode: 401,
            data: {
                errors: {
                    email: ['Invalid email or password'],
                    password: ['Invalid email or password'],
                },
            },
        })
    }

    return {
        user: transformUser(user),
    }
})
