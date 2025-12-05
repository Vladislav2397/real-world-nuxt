import { userService } from '../../services'
import { transformUser } from '../../utils/transform'
import { validateEmail, validateUsername } from '../../utils/validation'
import { validatePassword } from '../../utils/password'
import { checkRateLimit, getClientIP } from '../../utils/rate-limit'

export default defineEventHandler(async event => {
    // Rate limiting: максимум 3 регистрации в час с одного IP
    const clientIP = getClientIP(event)
    const rateLimit = checkRateLimit(clientIP, 3, 60 * 60 * 1000)

    if (!rateLimit.allowed) {
        throw createError({
            statusCode: 429,
            message: 'Too many registration attempts. Please try again later.',
            data: {
                errors: {
                    email: [
                        `Too many registration attempts. Try again after ${new Date(rateLimit.resetTime).toLocaleTimeString()}`,
                    ],
                },
            },
        })
    }
    const body = await readBody(event)

    if (!body?.user?.email || !body?.user?.password || !body?.user?.username) {
        throw createError({
            statusCode: 422,
            data: {
                errors: {
                    ...(!body?.user?.email && { email: ['Email is required'] }),
                    ...(!body?.user?.password && {
                        password: ['Password is required'],
                    }),
                    ...(!body?.user?.username && {
                        username: ['Username is required'],
                    }),
                },
            },
        })
    }

    const errors: Record<string, string[]> = {}

    // Валидация email
    if (!validateEmail(body.user.email)) {
        errors.email = ['Email is invalid']
    }

    // Валидация username
    const usernameValidation = validateUsername(body.user.username)
    if (!usernameValidation.valid) {
        errors.username = [usernameValidation.error || 'Username is invalid']
    }

    // Валидация password
    const passwordValidation = validatePassword(body.user.password)
    if (!passwordValidation.valid) {
        errors.password = [passwordValidation.error || 'Password is invalid']
    }

    if (Object.keys(errors).length > 0) {
        throw createError({
            statusCode: 422,
            data: { errors },
        })
    }

    // Проверяем, не существует ли уже пользователь с таким email или username
    if (await userService.findUserByEmail(body.user.email)) {
        throw createError({
            statusCode: 422,
            data: {
                errors: {
                    email: ['User with this email already exists'],
                },
            },
        })
    }

    if (await userService.findUserByUsername(body.user.username)) {
        throw createError({
            statusCode: 422,
            data: {
                errors: {
                    username: ['User with this username already exists'],
                },
            },
        })
    }

    const user = await userService.createUser({
        email: body.user.email,
        username: body.user.username,
        password: body.user.password,
    })

    return {
        user: transformUser(user),
    }
})
