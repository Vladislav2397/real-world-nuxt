import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

/**
 * Хеширует пароль
 */
export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Сравнивает пароль с хешем
 * Защищено от timing attacks
 */
export async function comparePassword(
    password: string,
    hash: string
): Promise<boolean> {
    return await bcrypt.compare(password, hash)
}

/**
 * Валидирует пароль
 * Минимум 8 символов, хотя бы одна буква и одна цифра
 */
export function validatePassword(password: string): {
    valid: boolean
    error?: string
} {
    if (password.length < 8) {
        return {
            valid: false,
            error: 'Password must be at least 8 characters long',
        }
    }

    if (!/[a-zA-Z]/.test(password)) {
        return {
            valid: false,
            error: 'Password must contain at least one letter',
        }
    }

    if (!/[0-9]/.test(password)) {
        return {
            valid: false,
            error: 'Password must contain at least one number',
        }
    }

    return { valid: true }
}

